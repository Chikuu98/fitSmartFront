import type { Mentor } from "./mentor";

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
    mentor?: Mentor;
  };
  status: "pending" | "accepted" | "rejected" | "cancelled" | "completed";
  bookingPayment?: BookingPayment;
  google_meet_link?: string;
  created_at: string;
  updated_at: string;
}

export interface BookingPayment {
  id: number;
  status: "paid" | "unpaid" | "refunded";
  payment_method?: "stripe" | "paypal";
  transaction_id: string;
  amount: number;
  currency: string;
  paid_at?: string;
  refunded_at?: string;
}
