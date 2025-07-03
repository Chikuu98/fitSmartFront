import { axiosInstance } from "../axiosInstance";
import { appConfig } from "../../config/appConfig";
import type {
  CreateSlotDto,
  UpdateSlotDto,
  MentorSlot,
} from "../../interfaces/mentorSlot";

function withApiUrl(path: string) {
  return `${appConfig.apiUrl.replace(/\/?$/, "/")}${path.replace(/^\//, "")}`;
}

export const createMentorSlot = async (dto: CreateSlotDto) => {
  const response = await axiosInstance.post(withApiUrl("mentor-slots"), dto);
  return response.data;
};

export const updateMentorSlot = async (slotId: number, dto: UpdateSlotDto) => {
  const response = await axiosInstance.post(
    withApiUrl(`mentor-slots/${slotId}`),
    dto,
  );
  return response.data;
};

export const getMentorSlots = async (
  mentor_id: number,
): Promise<MentorSlot[]> => {
  const response = await axiosInstance.get(
    withApiUrl(`mentor-slots/mentor/${mentor_id}`),
  );
  return response.data.data;
};

export const getSlotById = async (slotId: number): Promise<MentorSlot> => {
  const response = await axiosInstance.get(
    withApiUrl(`mentor-slots/${slotId}`),
  );
  return response.data.data;
};

export const deleteMentorSlot = async (slotId: number) => {
  const response = await axiosInstance.delete(
    withApiUrl(`mentor-slots/${slotId}`),
  );
  return response.data;
};
