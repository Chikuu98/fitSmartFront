export interface MentorSlot {
  id: number;
  mentor: {
    id: number;
    name?: string;
    email?: string;
  };
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSlotDto {
  date: string;
  start_time: string;
  end_time: string;
}

export interface UpdateSlotDto {
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}
