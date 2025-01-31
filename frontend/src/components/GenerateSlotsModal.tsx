import React from "react";

interface GenerateSlotsModalProps {
  showGenerateModal: boolean;
  setShowGenerateModal: (show: boolean) => void;
  repeat: string;
  setRepeat: (repeat: string) => void;
  duration: number | undefined;
  handleDurationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  durationError: string;
  selectedDays: string[];
  toggleDaySelection: (day: string) => void;
  dayTimeSettings: { [key: string]: { startTime: string; endTime: string } };
  handleTimeChange: (day: string, field: "startTime" | "endTime", value: string) => void;
  timeErrors: { [key: string]: string };
  handleGenerateSlots: () => void;
  daysOfWeek: string[];
}

const GenerateSlotsModal: React.FC<GenerateSlotsModalProps> = ({
  showGenerateModal,
  setShowGenerateModal,
  repeat,
  setRepeat,
  duration,
  handleDurationChange,
  durationError,
  selectedDays,
  toggleDaySelection,
  dayTimeSettings,
  handleTimeChange,
  timeErrors,
  handleGenerateSlots,
  daysOfWeek,
}) => {
  if (!showGenerateModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hidden">
        {/* Modal Header */}
        <div className="bg-blue-500 text-white p-4 rounded-t-lg">
          <h3 className="text-xl font-semibold">Generate Slots</h3>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Repeat Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Repeat:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
            >
              <option value="weekly">For 1 Week</option>
              <option value="monthly">For 1 Month</option>
            </select>
          </div>

          {/* Duration Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes):</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={duration}
              min="1"
              max="60"
              onChange={handleDurationChange}
            />
            {durationError && <p className="text-red-500 text-sm mt-1">{durationError}</p>}
          </div>

          {/* Days & Time Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Days & Time:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {daysOfWeek.map((day) => (
                <div key={day} className="p-4 border border-gray-200 rounded-lg">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedDays.includes(day)}
                      onChange={() => toggleDaySelection(day)}
                      className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{day}</span>
                  </label>

                  {selectedDays.includes(day) && (
                    <div className="mt-2 space-y-2">
                      <input
                        type="time"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={dayTimeSettings[day]?.startTime || ""}
                        onChange={(e) => handleTimeChange(day, "startTime", e.target.value)}
                      />
                      <input
                        type="time"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={dayTimeSettings[day]?.endTime || ""}
                        onChange={(e) => handleTimeChange(day, "endTime", e.target.value)}
                      />
                      {timeErrors[day] && <p className="text-red-500 text-sm">{timeErrors[day]}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 p-4 rounded-b-lg flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={() => setShowGenerateModal(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleGenerateSlots}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateSlotsModal;