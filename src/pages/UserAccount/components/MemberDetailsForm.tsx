import React from "react";
import { FitnessLevelEnum } from "../../../enums/userDetailEnums";
import type { UpdateMemberDetailsDto } from "../../../interfaces/user";
import FormInput from "../../../components/ui/formInput";
import CustomSelect from "../../../components/ui/customSelect";
import { Button } from "../../../components/ui/button";

interface MemberDetailsFormProps {
  memberDetails: UpdateMemberDetailsDto;
  onMemberDetailsChange: (details: UpdateMemberDetailsDto) => void;
  onSubmit: () => void;
  updating: boolean;
}

const MemberDetailsForm: React.FC<MemberDetailsFormProps> = ({
  memberDetails,
  onMemberDetailsChange,
  onSubmit,
  updating,
}) => {
  const fitnessLevelOptions = [
    { value: FitnessLevelEnum.BEGINNER, label: "Beginner" },
    { value: FitnessLevelEnum.INTERMEDIATE, label: "Intermediate" },
    { value: FitnessLevelEnum.ADVANCED, label: "Advanced" },
  ];

  const dietaryPreferenceOptions = [
    { value: "vegetarian", label: "Vegetarian" },
    { value: "non-vegetarian", label: "Non-Vegetarian" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Member Details
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Your fitness and health information
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormInput
              label="Age"
              name="age"
              type="number"
              value={memberDetails.age?.toString() || ""}
              onChange={(e) =>
                onMemberDetailsChange({
                  ...memberDetails,
                  age: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              placeholder="Enter your age"
              size="md"
              rounded="xl"
            />

            <FormInput
              label="Height (cm)"
              name="height"
              type="number"
              step="0.1"
              value={memberDetails.height?.toString() || ""}
              onChange={(e) =>
                onMemberDetailsChange({
                  ...memberDetails,
                  height: e.target.value
                    ? parseFloat(e.target.value)
                    : undefined,
                })
              }
              placeholder="Enter your height"
              size="md"
              rounded="xl"
            />

            <FormInput
              label="Weight (kg)"
              name="weight"
              type="number"
              step="0.1"
              value={memberDetails.weight?.toString() || ""}
              onChange={(e) =>
                onMemberDetailsChange({
                  ...memberDetails,
                  weight: e.target.value
                    ? parseFloat(e.target.value)
                    : undefined,
                })
              }
              placeholder="Enter your weight"
              size="md"
              rounded="xl"
            />

            <CustomSelect
              name="fitness_level"
              label="Fitness Level"
              value={memberDetails.fitness_level || null}
              onChange={(option) =>
                onMemberDetailsChange({
                  ...memberDetails,
                  fitness_level: option?.value as FitnessLevelEnum,
                })
              }
              options={fitnessLevelOptions}
              placeholder="Select fitness level"
              height="2.5rem"
              fontSize="0.875rem"
            />

            <FormInput
              label="Fitness Goal"
              name="goal"
              value={memberDetails.goal || ""}
              onChange={(e) =>
                onMemberDetailsChange({
                  ...memberDetails,
                  goal: e.target.value,
                })
              }
              placeholder="e.g., Lose weight, Build muscle"
              size="md"
              rounded="xl"
            />

            <CustomSelect
              name="dietary_preference"
              label="Dietary Preference"
              value={memberDetails.dietary_preference || null}
              onChange={(option) =>
                onMemberDetailsChange({
                  ...memberDetails,
                  dietary_preference: option?.value || "",
                })
              }
              options={dietaryPreferenceOptions}
              placeholder="Select dietary preference"
              height="2.5rem"
              fontSize="0.875rem"
            />
          </div>

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

export default MemberDetailsForm;
