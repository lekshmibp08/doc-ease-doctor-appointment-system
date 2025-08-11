import type React from "react"

interface MessageInputProps {
  newMessage: string
  setNewMessage: (message: string) => void
  imagePreview: string | null
  setImagePreview: (preview: string | null) => void
  setImageUrl: (url: string) => void
  isImageUploading: boolean
  onSendMessage: () => void
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  imagePreview,
  setImagePreview,
  setImageUrl,
  isImageUploading,
  onSendMessage,
  onImageUpload,
}) => {
  return (
    <div className="p-4 bg-white border-t border-gray-300">
      {imagePreview && (
        <div className="mt-2 relative inline-block">
          <img
            src={imagePreview || "/placeholder.svg"}
            alt="Preview"
            className="max-w-xs h-auto rounded-lg border border-gray-300"
          />
          {isImageUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="text-white text-sm">Uploading...</div>
            </div>
          )}
          <button
            onClick={() => {
              setImagePreview(null)
              setImageUrl("")
            }}
            className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded-full"
          >
            ✕
          </button>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <label htmlFor="image-upload" className="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
            />
          </svg>
        </label>
        <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={onImageUpload} />
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSendMessage()
          }}
          placeholder="Type a message"
          className="flex-1 p-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={onSendMessage}
          disabled={isImageUploading}
          className={`p-2 rounded-lg ${
            isImageUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default MessageInput
