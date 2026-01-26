import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import type { MentorSlot } from "../../../interfaces/mentorSlot";
import {
  getMentorSlots,
  deleteMentorSlot,
} from "../../../api/endpoints/mentorSlots";
import { Button } from "../../../components/ui/button";
import { useConfirmationDialog } from "../../../components/ui/confirmationDialog";
import type { RootState } from "../../../store/store";
import { toast } from "react-toastify";

export function MyMentorSlotList() {
  const [slots, setSlots] = useState<MentorSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const mentor_id = useSelector((state: RootState) => state.auth.user?.id);
  const navigate = useNavigate();
  const { openDialog, ConfirmDialog } = useConfirmationDialog();

  useEffect(() => {
    if (!mentor_id) return;
    fetchSlots();
  }, [mentor_id]);

  const fetchSlots = async () => {
    if (!mentor_id) return;
    try {
      setLoading(true);
      const data = await getMentorSlots(mentor_id);
      setSlots(data);
    } catch (error: any) {
      toast.error("Failed to load time slots");
      console.error("Failed to load slots", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slotId: number) => {
    openDialog({
      title: "Delete Time Slot",
      message:
        "Are you sure you want to delete this time slot? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
      loading: deleteLoading === slotId,
      onConfirm: async (close) => {
        close();
        setDeleteLoading(slotId);
        try {
          await deleteMentorSlot(slotId);
          fetchSlots();
        } catch (error: any) {
        } finally {
          setDeleteLoading(null);
        }
      },
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-gray-900 transition-colors duration-300 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-orange-400 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-orange-200">
              Loading time slots...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-gray-900 transition-colors duration-300 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-orange-950 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-orange-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-orange-100">
              My Time Slots
            </h1>
          </div>
          <div className="text-sm text-gray-600 dark:text-orange-300">
            {slots.length} slot{slots.length !== 1 ? "s" : ""} available
          </div>
        </div>

        <div className="space-y-4">
          {slots.length === 0 ? (
            <div className="text-center py-16">
              <AlertCircle className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-orange-100 mb-2">
                No time slots found
              </h3>
              <p className="text-gray-600 dark:text-orange-300">
                Create your first time slot to start accepting bookings.
              </p>
            </div>
          ) : (
            slots.map((slot) => (
              <div
                key={slot.id}
                className="bg-white/90 dark:bg-[#18181c] border border-gray-200 dark:border-orange-800 shadow-xl rounded-2xl p-6 transition hover:shadow-2xl hover:border-blue-300 dark:hover:border-orange-400 group"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-orange-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-orange-100">
                        {formatDate(slot.date)}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-orange-300">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {formatTime(slot.start_time)} -{" "}
                          {formatTime(slot.end_time)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {slot.is_booked ? (
                          <>
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span className="text-red-600 dark:text-red-400 font-medium">
                              Booked
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              Available
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="true"
                      onClick={() =>
                        navigate(`/mentor/time-slots/edit/${slot.id}`)
                      }
                      className="py-2"
                    >
                      <Edit size={20} />
                    </Button>

                    <Button
                      variant="outline"
                      disabled={deleteLoading === slot.id}
                      onClick={() => handleDelete(slot.id)}
                      className="py-2"
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <ConfirmDialog />
      </div>
    </div>
  );
}
