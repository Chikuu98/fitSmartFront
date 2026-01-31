import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Calendar,
  ArrowLeft,
  CheckCircle,
  DollarSign,
  User,
} from "lucide-react";
import { Button, FormInput } from "../../../../components/ui";
import type { Booking } from "../../../../interfaces/booking";
import { 
  getBookingById, 
  processPayment 
} from "../../../../api/endpoints/bookings";

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export function PaymentPage() {
  const { booking_id } = useParams<{ booking_id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const [errors, setErrors] = useState<Partial<PaymentFormData>>({});

  useEffect(() => {
    if (booking_id) {
      fetchBooking();
    }
  }, [booking_id]);

  const fetchBooking = async () => {
    if (!booking_id) return;

    try {
      setFetchLoading(true);
      const bookingData: Booking = await getBookingById(Number(booking_id));
      setBooking(bookingData);
      
      if (bookingData.status !== "accepted") {
        navigate(-1);
        return;
      }
      
      if (bookingData.bookingPayment?.status === "paid") {
        navigate(-1);
        return;
      }
    } catch (error: any) {
      navigate(-1);
    } finally {
      setFetchLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentFormData> = {};

    if (!formData.cardNumber || !/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    if (!formData.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Expiry date must be in MM/YY format";
    }

    if (!formData.cvv || !/^\d{3}$/.test(formData.cvv)) {
      newErrors.cvv = "CVV must be 3 digits";
    }

    if (!formData.cardholderName || formData.cardholderName.length < 2) {
      newErrors.cardholderName = "Cardholder name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
      if (formattedValue.length > 19) return;
    }

    if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.substring(0, 2) + "/" + formattedValue.substring(2, 4);
      }
      if (formattedValue.length > 5) return;
    }

    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length > 3) return;
    }

    setFormData({ ...formData, [name]: formattedValue });
    
    if (errors[name as keyof PaymentFormData]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !booking_id) return;

    try {
      setLoading(true);
      
      const paymentData = {
        cardNumber: formData.cardNumber.replace(/\s/g, ""),
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
        cardholderName: formData.cardholderName,
      };

      const result = await processPayment(Number(booking_id), paymentData);
      
      if (result.success) {
        setTransactionId(result.data.transactionId);
        setPaymentProcessed(true);
      } else {
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  const handleBackToBookings = () => {
    navigate("/member/my-bookings");
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Booking Not Found
          </h2>
          <Button onClick={() => navigate(-1)} className="text-gray-900 dark:text-white">Go Back</Button>
        </div>
      </div>
    );
  }

  if (paymentProcessed) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your payment has been processed successfully.
              </p>
              
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900 dark:text-gray-100">Transaction ID:</span>
                    <span className="font-mono text-gray-900 dark:text-gray-100">{transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900 dark:text-gray-100">Amount:</span>
                    <span className="text-gray-900 dark:text-gray-100">$10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900 dark:text-gray-100">Status:</span>
                    <span className="text-green-600 dark:text-green-400">Paid</span>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleBackToBookings}
                className="w-full"
                variant="orange"
              >
                Back to My Bookings
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Bookings
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Booking Summary
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {booking.mentorSlot?.mentor?.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mentor
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {booking.mentorSlot?.date}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {booking.mentorSlot?.start_time} - {booking.mentorSlot?.end_time}
                  </p>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    Session Fee
                  </span>
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    $10
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  One-time payment for 1-on-1 mentoring session
                </p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Payment Details
              </h2>
            </div>



            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label="Card Number"
                name="cardNumber"
                type="text"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                error={errors.cardNumber}
                icon={<CreditCard className="w-5 h-5 text-gray-400" />}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Expiry Date"
                  name="expiryDate"
                  type="text"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  error={errors.expiryDate}
                  required
                />

                <FormInput
                  label="CVV"
                  name="cvv"
                  type="text"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  error={errors.cvv}
                  required
                />
              </div>

              <FormInput
                label="Cardholder Name"
                name="cardholderName"
                type="text"
                value={formData.cardholderName}
                onChange={handleInputChange}
                placeholder="John Doe"
                error={errors.cardholderName}
                required
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  variant="green"
                  loading={loading}
                  className="w-full"
                  size="lg"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Pay $10
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}