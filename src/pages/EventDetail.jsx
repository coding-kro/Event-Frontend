import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChair,
  FaMoneyBillWave,
} from 'react-icons/fa';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // =========================
  // FETCH EVENT
  // =========================
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data.event);
      } catch (err) {
        console.error(err);
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // =========================
  // BOOKING HANDLER
  // =========================
  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      // STEP 1: SEND OTP
      if (!showOTP) {
        await api.post('/bookings/send-otp');
        setShowOTP(true);
        setSuccessMsg('OTP sent to your email. Please verify.');
      }

      // STEP 2: VERIFY OTP + BOOK
      else {
        if (otp.length !== 6) {
          setError('Please enter a valid 6-digit OTP.');
          setBookingLoading(false);
          return;
        }

        await api.post('/bookings', {
          eventId: event._id,
          otp,
        });

        // 🔥 REFRESH EVENT (IMPORTANT FIX)
        const { data } = await api.get(`/events/${id}`);
        setEvent(data.event);

        setSuccessMsg('Booking successful!');
        setShowOTP(false);
        setOtp('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  // =========================
  // LOADING / ERROR STATES
  // =========================
  if (loading)
    return (
      <div className="text-center py-20 text-xl font-semibold">Loading...</div>
    );

  if (error && !event)
    return (
      <div className="text-center py-20 text-xl text-red-500">
        {error || 'Event not found'}
      </div>
    );

  // =========================
  // SEATS CALCULATION
  // =========================
  const availableSeats = event.totalSeats - (event.bookedSeats || 0);
  const isSoldOut = availableSeats <= 0;

  // =========================
  // UI
  // =========================
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-8">
      {/* IMAGE */}
      {event.imageUrl ? (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-80 object-cover"
        />
      ) : (
        <div className="w-full h-64 bg-gray-900 flex items-center justify-center text-white/50 text-6xl font-black uppercase tracking-widest">
          {event.category}
        </div>
      )}

      <div className="p-8 md:p-12">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
          {/* EVENT INFO */}
          <div>
            <div className="inline-block bg-gray-200 text-gray-800 text-xs font-bold px-3 py-1 rounded-full uppercase mb-3">
              {event.category}
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              {event.title}
            </h1>

            <p className="text-gray-600 text-lg mb-6">{event.description}</p>
          </div>

          {/* BOOKING PANEL */}
          <div className="bg-gray-50 p-6 rounded-xl border shadow-sm w-full md:w-[320px]">
            <h3 className="text-xl font-bold mb-6">Booking Details</h3>

            {isSoldOut && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center font-bold">
                Sold out!
              </div>
            )}

            {/* PRICE */}
            <div className="flex items-center gap-4 mb-4">
              <FaMoneyBillWave />
              <div>
                <p className="text-sm text-gray-400">Ticket Price</p>
                <p className="font-bold">
                  {event.ticketPrice === 0 ? 'Free' : `₹${event.ticketPrice}`}
                </p>
              </div>
            </div>

            {/* SEATS */}
            <div className="flex items-center gap-4 mb-4">
              <FaChair />
              <div>
                <p className="text-sm text-gray-400">Availability</p>
                <p className="font-bold">
                  <span
                    className={availableSeats < 10 ? 'text-orange-500' : ''}
                  >
                    {availableSeats}
                  </span>{' '}
                  / {event.totalSeats}
                </p>
              </div>
            </div>

            {/* DATE */}
            <div className="flex items-center gap-4 mb-4">
              <FaCalendarAlt />
              <div>
                <p className="text-sm text-gray-400">Date</p>
                <p className="font-bold">
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* LOCATION */}
            <div className="flex items-center gap-4 mb-6">
              <FaMapMarkerAlt />
              <div>
                <p className="text-sm text-gray-400">Location</p>
                <p className="font-bold">{event.location}</p>
              </div>
            </div>

            {/* OTP INPUT */}
            {showOTP && (
              <input
                type="text"
                maxLength="6"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl text-center tracking-widest font-bold mb-4"
              />
            )}

            {/* BUTTON */}
            <button
              onClick={handleBooking}
              disabled={
                isSoldOut || bookingLoading || (showOTP && otp.length !== 6)
              }
              className={`w-full py-4 rounded-xl font-bold ${
                isSoldOut
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-black text-white'
              }`}
            >
              {bookingLoading
                ? 'Processing...'
                : showOTP
                  ? 'Verify OTP'
                  : isSoldOut
                    ? 'Sold Out'
                    : 'Book Now'}
            </button>

            {/* MESSAGES */}
            {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
            {successMsg && (
              <p className="text-green-600 mt-3 text-center">{successMsg}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
