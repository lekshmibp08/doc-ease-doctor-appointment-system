import type { Slot } from "../../types/interfaces"

interface TimeSlotSectionProps {
  title: string
  slots: Slot[]
  selectedSlot?: Slot
  onSlotClick: (slot: Slot) => void
  lockedSlotIds: Set<string>
}

const TimeSlotSection = ({ title, slots, selectedSlot, onSlotClick, lockedSlotIds }: TimeSlotSectionProps) => {
  if (slots.length === 0) return null

  return (
    <div className="mb-6">
      <h2 className="font-semibold text-lg mb-2">{title}</h2>
      <div className="flex flex-wrap gap-4">
        {slots.map((slot) => {
          const isLocked = lockedSlotIds.has(slot._id)
          const isDisabled = isLocked || slot.status === "Booked" || !slot.isAvailable
          const isSelected = selectedSlot?._id === slot._id

          return(
            <button
              key={slot._id}
              onClick={() => !isDisabled && onSlotClick(slot)}
              className={`px-3 py-1 rounded-md border
                ${isSelected ? "bg-customTeal text-white" : "bg-white text-customTeal"}
                ${isDisabled ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300" : ""}
              `}
              disabled={isDisabled}
              title={isLocked ? "Someone is currently booking this slot" : undefined}
            >
              {slot.time}
            </button>
          )
          
        })}
      </div>
    </div>
  )
}

export default TimeSlotSection
