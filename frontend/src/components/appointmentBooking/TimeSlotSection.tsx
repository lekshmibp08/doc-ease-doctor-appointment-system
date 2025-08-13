import type { Slot } from "../../types/interfaces"

interface TimeSlotSectionProps {
  title: string
  slots: Slot[]
  selectedSlot?: Slot
  onSlotClick: (slot: Slot) => void
}

const TimeSlotSection = ({ title, slots, selectedSlot, onSlotClick }: TimeSlotSectionProps) => {
  if (slots.length === 0) return null

  return (
    <div className="mb-6">
      <h2 className="font-semibold text-lg mb-2">{title}</h2>
      <div className="flex flex-wrap gap-4">
        {slots.map((slot) => (
          <button
            key={slot._id}
            onClick={() => onSlotClick(slot)}
            className={`px-3 py-1 rounded-md border ${
              selectedSlot?.time === slot.time ? "bg-customTeal text-white" : "bg-white text-customTeal"
            } ${
              slot.status === "Booked" || !slot.isAvailable
                ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                : ""
            }`}
            disabled={!slot.isAvailable || slot.status === "Booked"}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TimeSlotSection
