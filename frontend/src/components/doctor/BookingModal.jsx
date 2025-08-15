import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookAppointment } from '../../api/appointmentApi';
import { createPaymentOrder, verifyPayment } from '../../api/paymentApi';

const BookingModal = ({ doctor, onClose, onBookingSuccess }) => {
  const { userInfo } = useAuth();
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Predefined time slots for simplicity
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

const handlePaymentAndBooking = async () => {
    if (!appointmentDate || !appointmentTime) {
      setError('Please select a date and time.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      // 1. Create a payment order from our backend
      const order = await createPaymentOrder(doctor.consultationFee, userInfo.token);

      // 2. Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Sanjeevani',
        description: `Appointment with Dr. ${doctor.user.name}`,
        image: '[https://placehold.co/100x100/14B8A6/FFFFFF?text=S](https://placehold.co/100x100/14B8A6/FFFFFF?text=S)',
        order_id: order.id,
        handler: async function (response) {
          // 3. This function is called after the user completes the payment
          const paymentData = {
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          };

          // 4. Verify the payment on our backend
          const verificationResult = await verifyPayment(paymentData, userInfo.token);

          if (verificationResult.success) {
            // 5. If payment is verified, book the appointment
            const appointmentData = {
              doctorId: doctor._id,
              appointmentDate,
              appointmentTime,
            };
            const finalBooking = await bookAppointment(appointmentData, userInfo.token);
            onBookingSuccess(finalBooking);
          } else {
            setError('Payment verification failed. Please try again.');
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
        },
        theme: {
          color: '#0000FF',
        },
      };

      // 6. Open the Razorpay checkout modal
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Book Appointment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-lg font-semibold">With: <span className="text-blue-600">Dr. {doctor.user.name}</span></p>
          <p className="text-gray-600">{doctor.specialty}</p>
        </div>

        <form onSubmit={handlePaymentAndBooking}>
          <div className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Calendar className="h-5 w-5 text-gray-400" /></div>
                <input type="date" id="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} className="block w-full pl-10 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map(time => (
                  <button key={time} type="button" onClick={() => setAppointmentTime(time)} className={`p-2 border rounded-md text-sm transition-colors ${appointmentTime === time ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 hover:bg-gray-100'}`}>
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

          <div className="mt-8">
            <button 
            onClick={handlePaymentAndBooking} 
            disabled={isLoading} 
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition duration-300">
            {isLoading ? 'Processing...' : `Proceed to Pay (₹${doctor.consultationFee})`}
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;

// This component handles the booking modal for selecting a date and time for an appointment with a doctor.
// It includes form validation, loading state, and error handling.