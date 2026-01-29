import React from "react";
import type { UpdateMentorDetailsDto } from "../../../interfaces/user";
import FormInput from "../../../components/ui/formInput";
import TextAreaInput from "../../../components/ui/textAreaInput";
import { Button } from "../../../components/ui/button";

interface MentorDetailsFormProps {
  mentorDetails: UpdateMentorDetailsDto;
  onMentorDetailsChange: (details: UpdateMentorDetailsDto) => void;
  onSubmit: () => void;
  updating: boolean;
}

const MentorDetailsForm: React.FC<MentorDetailsFormProps> = ({
  mentorDetails,
  onMentorDetailsChange,
  onSubmit,
  updating,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Mentor Details
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Your professional information and expertise
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Expertise"
              name="expertise"
              value={mentorDetails.expertise || ""}
              onChange={(e) =>
                onMentorDetailsChange({
                  ...mentorDetails,
                  expertise: e.target.value,
                })
              }
              placeholder="e.g., Fitness and Nutrition Expert"
              size="md"
              rounded="xl"
              required
            />

            <FormInput
              label="Contact Number"
              name="contact_number"
              value={mentorDetails.contact_number || ""}
              onChange={(e) =>
                onMentorDetailsChange({
                  ...mentorDetails,
                  contact_number: e.target.value,
                })
              }
              placeholder="e.g., +1234567890"
              size="md"
              rounded="xl"
            />
          </div>

          <TextAreaInput
            label="Bio"
            name="bio"
            value={mentorDetails.bio || ""}
            onChange={(e) =>
              onMentorDetailsChange({
                ...mentorDetails,
                bio: e.target.value,
              })
            }
            placeholder="Tell us about your experience and qualifications..."
            rows={4}
            size="md"
            maxLength={255}
          />

          <div className="flex justify-end">
            <Button type="submit" variant="orange" disabled={updating}>
              {updating ? "Updating..." : "Update Details"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentorDetailsForm;
