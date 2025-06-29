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
    mentor?: {
      id: number;
      name: string;
      email: string;
      country?: string;
      language?: string;
      mentorDetails?: {
        id: number;
        expertise: string;
        bio: string;
        certifications: string;
        social_links: string;
        contact_number: string;
      };
    };
  };
  status: "pending" | "accepted" | "rejected" | "cancelled" | "completed";
  payment_status: "unpaid" | "paid" | "refunded";
  google_meet_link?: string;
  created_at: string;
  updated_at: string;
}
