import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  User,
  ArrowLeft,
  Link2,
  DollarSign,
} from "lucide-react";
import { Button, FormInput } from "../../../components/ui";
import { useConfirmationDialog } from "../../../components/ui/confirmationDialog";
import CustomSelect from "../../../components/ui/customSelect";
import type { Booking } from "../../../interfaces/booking";
import { updateBooking, getBookingById } from "../../../api/endpoints/bookings";

interface UpdateBookingDto {
  status?: string;
  google_meet_link?: string;
}

interface UpdateBookingPaymentDto {
  payment_status?: string;
}

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

const paymentStatusOptions = [
  { value: "unpaid", label: "Unpaid" },
  { value: "paid", label: "Paid" },
  { value: "refunded", label: "Refunded" },
];

export function UpdateBooking() {
  const { booking_id } = useParams<{ booking_id: string }>();
  const navigate = useNavigate();
  const { openDialog, ConfirmDialog } = useConfirmationDialog();
  const [formData, setFormData] = useState<UpdateBookingDto>({
    status: "",
    google_meet_link: "",
  });
  const [originalData, setOriginalData] = useState<UpdateBookingDto>({
    status: "",
    google_meet_link: "",
  });
  const [paymentData, setPaymentData] = useState<UpdateBookingPaymentDto>({
    payment_status: "",
  });
  const [originalPaymentData, setOriginalPaymentData] =
    useState<UpdateBookingPaymentDto>({
      payment_status: "",
    });
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

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

      const updateData = {
        status: bookingData.status,
        google_meet_link: bookingData.google_meet_link || "",
      };
      setFormData(updateData);
      setOriginalData(updateData);

      const paymentUpdateData = {
        payment_status: bookingData.bookingPayment?.status || "unpaid",
      };
      setPaymentData(paymentUpdateData);
      setOriginalPaymentData(paymentUpdateData);
    } catch (error: any) {
      navigate(-1);
    } finally {
      setFetchLoading(false);
    }
  };

  const hasChanges = () => {
    return (
      formData.status !== originalData.status ||
      formData.google_meet_link !== originalData.google_meet_link ||
      paymentData.payment_status !== originalPaymentData.payment_status
    );
  };

  const handleCancel = () => {
    if (hasChanges()) {
      openDialog({
        title: "Unsaved Changes",
        message:
          "You have unsaved changes. Are you sure you want to leave without saving?",
        confirmText: "Leave",
        cancelText: "Stay",
        variant: "warning",
        onConfirm: (close) => {
          close();
          navigate(-1);
        },
      });
    } else {
      navigate(-1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange =
    (name: string) => (option: { value: string; label: string } | null) => {
      if (name === "payment_status") {
        setPaymentData((prev) => ({
          ...prev,
          [name]: option?.value || "",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: option?.value || "",
        }));
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!booking_id) return;

    openDialog({
      title: "Update Booking",
      message: "Are you sure you want to update this booking?",
      confirmText: "Update",
      cancelText: "Cancel",
      variant: "info",
      loading: loading,
      onConfirm: async (close) => {
        close();
        setLoading(true);
        try {
          const updateData: any = {};

          if (formData.status !== originalData.status && formData.status) {
            updateData.status = formData.status;
          }

          if (formData.google_meet_link !== originalData.google_meet_link) {
            updateData.google_meet_link = formData.google_meet_link;
          }

          if (
            paymentData.payment_status !== originalPaymentData.payment_status &&
            paymentData.payment_status
          ) {
            updateData.bookingPayment = {
              status: paymentData.payment_status,
            };
          }

          await updateBooking(Number(booking_id), updateData);
          navigate(-1);
        } catch (error: any) {
        } finally {
          setLoading(false);
        }
      },
    });
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen transition-colors">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading booking...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Button variant="outline" onClick={handleCancel} className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <CalendarCheck className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Update Booking
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Modify booking and payment details</p>
              </div>
            </div>

            {booking && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-600">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Booking Details
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p>
                  <User className="w-4 h-4 inline mr-2" />
                  Member: {booking.member?.name} ({booking.member?.email})
                </p>
                <p>
                  <CalendarCheck className="w-4 h-4 inline mr-2" />
                  Date: {booking.mentorSlot?.date} | Time:{" "}
                  {booking.mentorSlot?.start_time} -{" "}
                  {booking.mentorSlot?.end_time}
                </p>
                <p>
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Current Payment Status:{" "}
                  {booking.bookingPayment?.status
                    ? booking.bookingPayment.status.charAt(0).toUpperCase() +
                      booking.bookingPayment.status.slice(1)
                    : "No payment record"}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <CalendarCheck className="w-4 h-4 inline mr-2" />
                Booking Status
              </label>
              <CustomSelect
                name="status"
                value={formData.status || ""}
                onChange={handleSelectChange("status")}
                options={statusOptions}
                placeholder="Select booking status..."
                isClearable={false}
                isSearchable={false}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Payment Status
              </label>
              <CustomSelect
                name="payment_status"
                value={paymentData.payment_status || ""}
                onChange={handleSelectChange("payment_status")}
                options={paymentStatusOptions}
                placeholder="Select payment status..."
                isClearable={false}
                isSearchable={false}
              />
            </div>

            <FormInput
              type="url"
              name="google_meet_link"
              value={formData.google_meet_link || ""}
              onChange={handleInputChange}
              label="Google Meet Link"
              placeholder="https://meet.google.com/..."
              icon={<Link2 className="w-4 h-4" />}
              size="md"
              rounded="xl"
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="submit"
                variant="orange"
                disabled={loading || !hasChanges()}
                className="w-full sm:w-auto"
              >
                {loading ? "Updating..." : "Update Booking"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                Cancel
              </Button>
            </div>
          </form>
        </div>

        <ConfirmDialog />
        </div>
      </div>
    </div>
  );
}
