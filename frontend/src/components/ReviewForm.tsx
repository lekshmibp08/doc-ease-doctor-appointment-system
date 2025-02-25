import type React from "react"
import { useEffect, useState } from "react"
import axios from "../services/axiosConfig"
import { Star } from "lucide-react"

interface ReviewFormProps {
  appointmentId: string
  userId: string
  doctorId: string
  onClose: () => void
  onSubmit: () => void
}

const ReviewForm: React.FC<ReviewFormProps> = ({ appointmentId, doctorId, userId, onClose, onSubmit }) => {
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<string>("")
  const [reviewId, setReviewId] = useState<string | null>(null)


  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`/api/users/reviews`, {
          params: { appointmentId },
        })
        let review;
        if (response.data) {
          review = response.data.review[0]
          setRating(review.rating)
          setComment(review.comment)
          setReviewId(review._id) 
        }
      } catch (error) {
        console.error("Error fetching review:", error)
      } 
    }

    fetchReview()
  }, [appointmentId, userId, doctorId])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (reviewId) {
        await axios.put(`/api/users/reviews/${reviewId}`, {
          rating, comment
        })
      } else {
        await axios.post("/api/users/reviews", {
          appointmentId,
          userId,
          doctorId,
          rating,
          comment,
        })
      }
      onSubmit()
      onClose()
    } catch (error) {
      console.error("Error submitting review:", error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 cursor-pointer ${
                    star <= rating ? "text-yellow-500 fill-current" : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="comment" className="block mb-2">
              Comment
            </label>
            <textarea
              id="comment"
              className="w-full p-2 border rounded"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={rating === 0 || comment.trim() === ""}
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReviewForm

