import type React from "react"

interface IncomingCallModalProps {
  callerName: string
  onAccept: () => void
  onReject: () => void
}

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({ callerName, onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <p className="mb-4">Incoming call from {callerName}</p>
        <button onClick={onAccept} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
          Accept
        </button>
        <button onClick={onReject} className="bg-red-500 text-white px-4 py-2 rounded">
          Reject
        </button>
      </div>
    </div>
  )
}

export default IncomingCallModal
