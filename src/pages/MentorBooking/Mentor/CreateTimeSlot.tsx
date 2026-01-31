import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, DateInput, TimeInput } from "../../../components/ui";
import { useConfirmationDialog } from "../../../components/ui/confirmationDialog";
import type { CreateSlotDto } from "../../../interfaces/mentorSlot";
import { createMentorSlot } from "../../../api/endpoints/mentorSlots";
import { toast } from "react-toastify";

export function CreateTimeSlot() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateSlotDto>({
    date: "",
    start_time: "",
    end_time: "",
  });
  const [loading, setLoading] = useState(false);
  const { openDialog, ConfirmDialog } = useConfirmationDialog();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateTimeSlot = () => {
    if (!formData.date || !formData.start_time || !formData.end_time) {
      toast.error("Please fill all fields");
      return false;
    }

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error("Cannot create time slot for a past date");
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

    const now = new Date();
    const slotDateTime = new Date(`${formData.date}T${formData.start_time}`);
    
    if (slotDateTime < now) {
      toast.error("Cannot create time slot for a past date and time");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateTimeSlot()) {
      return;
    }

    openDialog({
      title: "Create Time Slot",
      message: "Are you sure you want to create this time slot?",
      confirmText: "Create",
      cancelText: "Cancel",
      variant: "info",
      onConfirm: (close) => {
        close();
        setLoading(true);
        createMentorSlot(formData)
          .then(() => {
            navigate("/mentor/my-slots");
          })
          .catch(() => {})
          .finally(() => {
            setLoading(false);
          });
      },
    });
  };

  const handleClear = () => {
    if (!formData.date && !formData.start_time && !formData.end_time) {
      return;
    }

    openDialog({
      title: "Clear Form",
      message:
        "Are you sure you want to clear all fields? This will remove all entered data.",
      confirmText: "Clear",
      cancelText: "Cancel",
      variant: "warning",
      onConfirm: (close) => {
        close();
        setFormData({ date: "", start_time: "", end_time: "" });
        toast.info("Form cleared");
      },
    });
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Plus className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Create Time Slot
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add a new available time slot</p>
              </div>
            </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <DateInput
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              label="Date"
              required
              min={getTodayDate()}
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

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button type="submit" variant="orange" disabled={loading} className="w-full sm:w-auto">
                {loading ? "Creating..." : "Create Time Slot"}
              </Button>
              <Button type="button" variant="outline" onClick={handleClear} className="w-full sm:w-auto">
                Clear
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
