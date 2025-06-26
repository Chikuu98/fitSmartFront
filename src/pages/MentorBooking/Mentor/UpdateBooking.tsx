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
import { toast } from "react-toastify";

interface UpdateBookingDto {
  status?: string;
  payment_status?: string;
  google_meet_link?: string;
}

// Status and payment status options for the select dropdowns
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
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { openDialog, ConfirmDialog } = useConfirmationDialog();
  const [formData, setFormData] = useState<UpdateBookingDto>({
    status: "",
    payment_status: "",
    google_meet_link: "",
  });
  const [originalData, setOriginalData] = useState<UpdateBookingDto>({
    status: "",
    payment_status: "",
    google_meet_link: "",
  });
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    if (!bookingId) return;

    try {
      setFetchLoading(true);
      const bookingData: Booking = await getBookingById(Number(bookingId));
      setBooking(bookingData);
      const updateData = {
        status: bookingData.status,
        payment_status: bookingData.payment_status,
        google_meet_link: bookingData.google_meet_link || "",
      };
      setFormData(updateData);
      setOriginalData(updateData);
    } catch (error: any) {
      toast.error("Failed to load booking");
      navigate(-1);
    } finally {
      setFetchLoading(false);
    }
  };

  const hasChanges = () => {
    return (
      formData.status !== originalData.status ||
      formData.payment_status !== originalData.payment_status ||
      formData.google_meet_link !== originalData.google_meet_link
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
      setFormData((prev) => ({
        ...prev,
        [name]: option?.value || "",
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingId) return;

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

          if (
            formData.payment_status !== originalData.payment_status &&
            formData.payment_status
          ) {
            updateData.payment_status = formData.payment_status;
          }

          if (formData.google_meet_link !== originalData.google_meet_link) {
            updateData.google_meet_link = formData.google_meet_link;
          }

          await updateBooking(Number(bookingId), updateData);
          navigate(-1);
        } catch (error: any) {
          // Error handling is done by axios interceptor
        } finally {
          setLoading(false);
        }
      },
    });
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-gray-900 transition-colors duration-300 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-orange-400 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-orange-200">
              Loading booking...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-gray-900 transition-colors duration-300 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/90 dark:bg-[#18181c] border border-gray-200 dark:border-orange-800 shadow-xl rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="blue" onClick={handleCancel} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="p-2 bg-blue-100 dark:bg-orange-950 rounded-lg">
              <CalendarCheck className="w-6 h-6 text-blue-600 dark:text-orange-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-orange-100">
              Update Booking
            </h1>
          </div>

          {booking && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-orange-200 mb-2">
                Booking Details
              </h3>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
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
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-orange-200 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-orange-200 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Payment Status
              </label>
              <CustomSelect
                name="payment_status"
                value={formData.payment_status || ""}
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
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="true"
                disabled={loading || !hasChanges()}
              >
                {loading ? "Updating..." : "Update Booking"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </div>

        {/* Confirmation Dialog */}
        <ConfirmDialog />
      </div>
    </div>
  );
}
