interface ConsultationModeSelectorProps {
  modesOfConsultation: string[]
  visitType: string
  onModeChange: (mode: string) => void
}

const ConsultationModeSelector = ({ modesOfConsultation, visitType, onModeChange }: ConsultationModeSelectorProps) => {
  return (
    <div className="mt-4">
      <div className="flex flex-nowrap gap-16">
        {modesOfConsultation.map((mode) => (
          <label key={mode} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="visitType"
              value={mode}
              checked={visitType === mode}
              onChange={(e) => onModeChange(e.target.value)}
            />
            <span>{mode}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default ConsultationModeSelector
