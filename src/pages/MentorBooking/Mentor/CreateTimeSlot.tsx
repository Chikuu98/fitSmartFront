import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button, DateInput, TimeInput } from "../../../components/ui";
import { useConfirmationDialog } from "../../../components/ui/confirmationDialog";
import type { CreateSlotDto } from "../../../interfaces/mentorSlot";
import { createMentorSlot } from "../../../api/endpoints/mentorSlots";
import { toast } from "react-toastify";

export function CreateTimeSlot() {
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
            setFormData({
              date: "",
              start_time: "",
              end_time: "",
            });
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
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-gray-900 transition-colors duration-300 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/90 dark:bg-[#18181c] border border-gray-200 dark:border-orange-800 shadow-xl rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-orange-950 rounded-lg">
              <Plus className="w-6 h-6 text-blue-600 dark:text-orange-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-orange-100">
              Create Time Slot
            </h1>
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

            <div className="flex gap-4 pt-4">
              <Button type="submit" variant="true" disabled={loading}>
                {loading ? "Creating..." : "Create Time Slot"}
              </Button>
              <Button type="button" variant="outline" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </form>
        </div>

        <ConfirmDialog />
      </div>
    </div>
  );
}
