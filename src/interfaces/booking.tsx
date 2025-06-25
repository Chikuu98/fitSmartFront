export interface Booking {
  id: number;
  member?: {
    id: number;
    name: string;
    email: string;
    country: string;
    language: string;
  };
  mentorSlot?: {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
  };
  status: "pending" | "accepted" | "rejected";
  payment_status: "unpaid" | "paid";
  google_meet_link?: string;
  created_at: string;
  updated_at: string;
}
