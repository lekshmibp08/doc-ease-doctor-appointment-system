import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

interface DateSelectorProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

const DateSelector = ({ selectedDate, onDateChange }: DateSelectorProps) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <label htmlFor="appointmentDate" className="font-semibold">
        Select a Date:
      </label>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => onDateChange(date as Date)}
        minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
        dateFormat="yyyy-MM-dd"
        className="border rounded-md px-3 py-2"
        placeholderText="Select a date"
      />
    </div>
  )
}

export default DateSelector
