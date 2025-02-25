
interface DateRangeSelectorProps {
  startDate: Date | null
  endDate: Date | null
  onStartDateChange: (date: Date | null) => void
  onEndDateChange: (date: Date | null) => void
  onRangeSelect: (range: string) => void
}

const DateRangeSelector = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onRangeSelect,
}: DateRangeSelectorProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <button
        onClick={() => onRangeSelect("week")}
        className="px-4 py-2 bg-customTeal text-white rounded hover:scale-105"
      >
        This Week
      </button>
      <button
        onClick={() => onRangeSelect("month")}
        className="px-4 py-2 bg-customTeal text-white rounded hover:scale-105"
      >
        This Month
      </button>
      <button
        onClick={() => onRangeSelect("year")}
        className="px-4 py-2 bg-customTeal text-white rounded hover:scale-105"
      >
        This Year
      </button>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={startDate ? startDate.toISOString().split("T")[0] : ""}
          onChange={(e) => onStartDateChange(e.target.valueAsDate)}
          className="px-2 py-1 border rounded"
        />
        <span>to</span>
        <input
          type="date"
          value={endDate ? endDate.toISOString().split("T")[0] : ""}
          onChange={(e) => onEndDateChange(e.target.valueAsDate)}
          className="px-2 py-1 border rounded"
        />
      </div>
    </div>
  )
}

export default DateRangeSelector;

