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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.start_time || !formData.end_time) {
      toast.error("Please fill all fields");
      return;
    }

    if (formData.start_time >= formData.end_time) {
      toast.error("End time must be after start time");
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
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-gray-900 transition-colors duration-300 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-orange-400 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-orange-200">
              Loading time slot...
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
              <Clock className="w-6 h-6 text-blue-600 dark:text-orange-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-orange-100">
              Edit Time Slot
            </h1>
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

            <div className="flex items-center gap-3">
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

            <div className="flex gap-4 pt-4">
              <Button type="submit" variant="true" disabled={loading}>
                {loading ? "Updating..." : "Update Time Slot"}
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
