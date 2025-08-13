import type { Server, Socket } from "socket.io";

type LockKey = string; // `${doctorId}:${date}:${slotId}`

interface LockRecord {
  key: LockKey;
  doctorId: string;
  date: string;     // "YYYY-MM-DD"
  slotId: string;
  ownerSocketId: string;
  userId?: string;
  expiresAt: number;
  timeout: NodeJS.Timeout;
}

const locks = new Map<LockKey, LockRecord>();
const DEFAULT_TTL_MS = 2 * 60 * 1000; // 2 minutes

const roomName = (doctorId: string, date: string) => `appointment:${doctorId}:${date}`;
const makeKey  = (doctorId: string, date: string, slotId: string) => `${doctorId}:${date}:${slotId}`;

function isActiveLock(rec?: LockRecord | null) {
  return !!rec && rec.expiresAt > Date.now();
}

function broadcastToRoom(io: Server, doctorId: string, date: string, event: string, payload: any) {
  io.to(roomName(doctorId, date)).emit(event, payload);
}

export function registerSlotEvents(io: Server, socket: Socket) {
  socket.on("setup", (userId: string) => {
    (socket.data as any).userId = userId;
  });

  // Join/leave viewing room
  socket.on("join_appointment_room", ({ doctorId, date }: { doctorId: string; date: string }) => {
    socket.join(roomName(doctorId, date));
  });

  socket.on("leave_appointment_room", ({ doctorId, date }: { doctorId: string; date: string }) => {
    socket.leave(roomName(doctorId, date));
  });

  // Request a lock with ACK semantics
  socket.on(
    "slot_lock_request",
    (
      payload: { doctorId: string; date: string; slotId: string; userId?: string },
      ack?: (resp: { ok: boolean; reason?: string }) => void
    ) => {
      const { doctorId, date, slotId, userId } = payload;
      const key = makeKey(doctorId, date, slotId);
      const existing = locks.get(key);

      // Clean up expired lock if any
      if (existing && !isActiveLock(existing)) {
        clearTimeout(existing.timeout);
        locks.delete(key);
      }

      const current = locks.get(key);
      if (current && isActiveLock(current)) {
        ack?.({ ok: false, reason: "LOCKED" });
        return;
      }

      // Create lock
      const expiresAt = Date.now() + DEFAULT_TTL_MS;
      const timeout = setTimeout(() => {
        const rec = locks.get(key);
        if (rec) {
          locks.delete(key);
          broadcastToRoom(io, doctorId, date, "slot_unlocked", { doctorId, date, slotId });
        }
      }, DEFAULT_TTL_MS);

      const record: LockRecord = {
        key,
        doctorId,
        date,
        slotId,
        ownerSocketId: socket.id,
        userId: userId || (socket.data as any)?.userId,
        expiresAt,
        timeout,
      };

      locks.set(key, record);

      // Notify everyone else in this room
      broadcastToRoom(io, doctorId, date, "slot_locked", { doctorId, date, slotId });

      // Ack success
      ack?.({ ok: true });
    }
  );

  // Release lock (only owner)
  socket.on("slot_lock_release", ({ doctorId, date, slotId }: { doctorId: string; date: string; slotId: string }) => {
    const key = makeKey(doctorId, date, slotId);
    const rec = locks.get(key);
    if (rec && rec.ownerSocketId === socket.id) {
      clearTimeout(rec.timeout);
      locks.delete(key);
      broadcastToRoom(io, doctorId, date, "slot_unlocked", { doctorId, date, slotId });
    }
  });

  // Announce booked -> clear any lock and broadcast permanent unavailable
  socket.on("slot_booked", ({ doctorId, date, slotId }: { doctorId: string; date: string; slotId: string }) => {
    const key = makeKey(doctorId, date, slotId);
    const rec = locks.get(key);
    if (rec) {
      clearTimeout(rec.timeout);
      locks.delete(key);
    }
    broadcastToRoom(io, doctorId, date, "slot_booked", { doctorId, date, slotId });
  });

  // Cleanup all locks owned by this socket on disconnect
  socket.on("disconnect", () => {
    const mine: LockRecord[] = [];
    for (const rec of locks.values()) {
      if (rec.ownerSocketId === socket.id) mine.push(rec);
    }
    mine.forEach(rec => {
      clearTimeout(rec.timeout);
      locks.delete(rec.key);
      broadcastToRoom(io, rec.doctorId, rec.date, "slot_unlocked", {
        doctorId: rec.doctorId,
        date: rec.date,
        slotId: rec.slotId,
      });
    });
  });
}
