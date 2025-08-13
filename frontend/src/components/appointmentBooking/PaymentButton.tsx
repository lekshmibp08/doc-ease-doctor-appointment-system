import { format } from "date-fns"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import type { Slot } from "../../types/interfaces"
import { createOrder, bookAppointment } from "../../services/api/userApi"

interface PaymentButtonProps {
  selectedSlot?: Slot
  visitType: string
  selectedDate: Date
  doctorId: string
  slotId: string
  fee: number
  currentUser: any
}

const PaymentButton = ({
  selectedSlot,
  visitType,
  selectedDate,
  doctorId,
  slotId,
  fee,
  currentUser,
}: PaymentButtonProps) => {
  const navigate = useNavigate()

  const handlePayNow = async () => {
    if (!selectedSlot) {
      Swal.fire({
        icon: "warning",
        title: "No Slot Selected",
        text: "Please select a time slot before proceeding.",
        confirmButtonText: "Okay",
      })
      return
    }
    if (!visitType) {
      Swal.fire({
        icon: "warning",
        title: "No Mode Selected",
        text: "Please select consultation type before proceeding.",
        confirmButtonText: "Okay",
      })
      return
    }

    try {
      const totalAmount = fee + 50
      const order = await createOrder(totalAmount)

      const options = {
        key: "rzp_test_wyMPk3or5BIJn5",
        amount: order.amount,
        currency: order.currency,
        name: "DocEase App",
        description: `Appointment Booking for ${format(selectedDate, "yyyy-MM-dd")}`,
        order_id: order.id,
        handler: async (response: any) => {
          console.log("Payment successful:", response)
          Swal.fire({
            icon: "success",
            title: "Payment Successful",
            text: `Payment ID: ${response.razorpay_payment_id}`,
            confirmButtonText: "Okay",
          })

          try {
            const appointmentData = {
              doctorId: doctorId,
              userId: currentUser?._id,
              date: selectedDate,
              slotId,
              selectedSlot,
              timeSlotId: selectedSlot._id,
              time: selectedSlot.time,
              modeOfVisit: visitType,
              amount: totalAmount,
              paymentId: response.razorpay_payment_id,
            }
            const res = await bookAppointment(appointmentData)

            Swal.fire({
              icon: "success",
              title: "Payment Successful",
              html: `
              <h3>Your appointment has been successfully created!</h3>
              <p><strong>Date:</strong> ${format(new Date(res.newAppoinment.date), "dd MMM yyyy, EEEE")}</p>
              <p><strong>Time:</strong> ${res.newAppoinment.time}</p>
              <div class="mt-4">
                <button id="go-home" class="swal2-confirm swal2-styled">Go to Home</button>
                <button id="show-appointments" class="swal2-confirm swal2-styled">Show Appointments</button>
              </div>
            `,
              showConfirmButton: false,
              didRender: () => {
                const goHomeButton = document.getElementById("go-home")
                const showAppointmentsButton = document.getElementById("show-appointments")

                goHomeButton?.addEventListener("click", () => {
                  Swal.close()
                  navigate("/")
                })

                showAppointmentsButton?.addEventListener("click", () => {
                  Swal.close()
                  navigate(`/appointments`)
                })
              },
            })
          } catch (error) {
            console.error("Error creating appointment:", error)
            Swal.fire({
              icon: "error",
              title: "Appointment Error",
              text: "There was an error while creating your appointment. Please try again later.",
              confirmButtonText: "Okay",
            })
          }
        },
        prefill: {
          name: currentUser?.fullName,
          email: currentUser?.email,
          contact: currentUser?.mobileNumber,
        },
        theme: {
          color: "#3399cc",
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

      razorpay.on("payment.failed", (response: any) => {
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          html: `
            <p><strong>Reason:</strong> ${response.error.reason}</p>
            <p><strong>Description:</strong> ${response.error.description}</p>
            <p><strong>Code:</strong> ${response.error.code}</p>
          `,
          showCancelButton: true,
          confirmButtonText: "Retry",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            razorpay.open()
          }
        })

        console.error("Payment failed:", response.error)
      })
    } catch (error) {
      console.error("Error processing payment:", error)
      Swal.fire({
        icon: "error",
        title: "Payment Error",
        text: "There was an error while processing your payment. Please try again later.",
        confirmButtonText: "Okay",
      })
    }
  }

  return (
    <button
      onClick={handlePayNow}
      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-semibold"
    >
      Pay Now
    </button>
  )
}

export default PaymentButton
