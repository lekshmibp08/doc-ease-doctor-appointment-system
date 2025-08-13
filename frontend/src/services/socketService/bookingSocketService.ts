import { io, Socket } from "socket.io-client";

type LockReq = { doctorId: string; date: string; slotId: string; userId: string };

class BookingSocketService {
  private static instance: BookingSocketService;
  private socket: Socket | null = null;

  private readonly URL = import.meta.env.VITE_BASE_URL    

  static getInstance() {
    if (!BookingSocketService.instance) {
      BookingSocketService.instance = new BookingSocketService();
    }
    return BookingSocketService.instance;
  }

  connect(userId: string) {
    if (this.socket?.connected) return this.socket;
    this.socket = io(this.URL, {
      transports: ["websocket"],
      withCredentials: true,
      path: "/socket.io",
    });
    this.socket.on("connect", () => {
      this.socket?.emit("setup", userId);
    });
    return this.socket;
  }

  getSocket() {
    return this.socket;
  }

  joinRoom(doctorId: string, date: string) {
    this.socket?.emit("join_appointment_room", { doctorId, date });
  }
  leaveRoom(doctorId: string, date: string) {
    this.socket?.emit("leave_appointment_room", { doctorId, date });
  }

  requestLock(payload: LockReq): Promise<{ ok: boolean; reason?: string }> {
    return new Promise((resolve) => {
      this.socket?.emit("slot_lock_request", payload, (ack: any) => {
        resolve(ack || { ok: false, reason: "NO_ACK" });
      });
    });
  }

  releaseLock(payload: Omit<LockReq, "userId">) {
    this.socket?.emit("slot_lock_release", payload);
  }

  announceBooked(payload: Omit<LockReq, "userId">) {
    this.socket?.emit("slot_booked", payload);
  }

  onLocked(cb: (d: { doctorId: string; date: string; slotId: string }) => void) {
    this.socket?.on("slot_locked", cb);
  }
  onUnlocked(cb: (d: { doctorId: string; date: string; slotId: string }) => void) {
    this.socket?.on("slot_unlocked", cb);
  }
  onBooked(cb: (d: { doctorId: string; date: string; slotId: string }) => void) {
    this.socket?.on("slot_booked", cb);
  }

  offAll() {
    this.socket?.off("slot_locked");
    this.socket?.off("slot_unlocked");
    this.socket?.off("slot_booked");
  }
}

export default BookingSocketService;
