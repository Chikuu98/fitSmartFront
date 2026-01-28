import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { Button, DateInput, TimeInput } from "../../../components/ui";
import { useConfirmationDialog } from "../../../components/ui/confirmationDialog";
import type { UpdateSlotDto, MentorSlot } from "../../../interfaces/mentorSlot";
import {
  updateMentorSlot,
  getSlotById,
} from "../../../api/endpoints/mentorSlots";
import { toast } from "react-toastify";

export function EditTimeSlot() {
  const { slotId } = useParams<{ slotId: string }>();
  const navigate = useNavigate();
  const { openDialog, ConfirmDialog } = useConfirmationDialog();
  const [formData, setFormData] = useState<UpdateSlotDto>({
    date: "",
    start_time: "",
    end_time: "",
    is_booked: false,
  });
  const [originalData, setOriginalData] = useState<UpdateSlotDto>({
    date: "",
    start_time: "",
    end_time: "",
    is_booked: false,
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (slotId) {
      fetchSlot();
    }
  }, [slotId]);

  const fetchSlot = async () => {
    if (!slotId) return;

    try {
      setFetchLoading(true);
      const slot: MentorSlot = await getSlotById(Number(slotId));
      const slotData = {
        date: slot.date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_booked: slot.is_booked,
      };
      setFormData(slotData);
      setOriginalData(slotData);
    } catch (error: any) {
      toast.error("Failed to load time slot");
      navigate(-1);
    } finally {
      setFetchLoading(false);
    }
  };

  const hasChanges = () => {
    return (
      formData.date !== originalData.date ||
      formData.start_time !== originalData.start_time ||
      formData.end_time !== originalData.end_time ||
      formData.is_booked !== originalData.is_booked
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateTimeSlot = () => {
    if (!formData.date || !formData.start_time || !formData.end_time) {
      toast.error("Please fill all fields");
      return false;
    }

    if (formData.start_time >= formData.end_time) {
      toast.error("End time must be after start time");
      return false;
    }

    const [startHour, startMin] = formData.start_time.split(':').map(Number);
    const [endHour, endMin] = formData.end_time.split(':').map(Number);
    const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);

    if (durationMinutes < 30) {
      toast.error("Time slot must be at least 30 minutes long");
      return false;
    }

    if (durationMinutes > 480) {
      toast.error("Time slot cannot exceed 8 hours");
      return false;
    }

    if (!formData.is_booked) {
      const now = new Date();
      const slotDateTime = new Date(`${formData.date}T${formData.start_time}`);
      
      if (slotDateTime < now) {
        toast.error("Cannot set time slot to a past date and time");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateTimeSlot()) {
      return;
    }

    if (!slotId) return;

    openDialog({
      title: "Update Time Slot",
      message: "Are you sure you want to update this time slot?",
      confirmText: "Update",
      cancelText: "Cancel",
      variant: "info",
      loading: loading,
      onConfirm: async (close) => {
        close();
        setLoading(true);
        try {
          await updateMentorSlot(Number(slotId), formData);
          navigate("/mentor/my-slots");
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
              Loading time slot...
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
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit Time Slot
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Update your time slot details</p>
              </div>
            </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <DateInput
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              label="Date"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TimeInput
                name="start_time"
                value={formData.start_time}
                onChange={handleInputChange}
                label="Start Time"
                required
              />

              <TimeInput
                name="end_time"
                value={formData.end_time}
                onChange={handleInputChange}
                label="End Time"
                required
              />
            </div>

            <div className="items-center gap-3 hidden">
              <input
                type="checkbox"
                id="is_booked"
                name="is_booked"
                checked={formData.is_booked}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-orange-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="is_booked"
                className="text-sm font-medium text-gray-700 dark:text-orange-200"
              >
                Mark as booked
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button type="submit" variant="orange" disabled={loading} className="w-full sm:w-auto">
                {loading ? "Updating..." : "Update Time Slot"}
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
