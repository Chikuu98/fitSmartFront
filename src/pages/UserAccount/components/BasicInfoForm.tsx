import React from "react";
import { Gender } from "../../../enums/userDetailEnums";
import type { UpdateUserDto } from "../../../interfaces/user";
import FormInput from "../../../components/ui/formInput";
import CustomSelect from "../../../components/ui/customSelect";
import { Button } from "../../../components/ui/button";
import { countryOptions } from "../../../utils/countryOptions";
import { languageOptions } from "../../../utils/languageOptions";

interface BasicInfoFormProps {
  basicInfo: UpdateUserDto;
  onBasicInfoChange: (info: UpdateUserDto) => void;
  onSubmit: () => void;
  updating: boolean;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  basicInfo,
  onBasicInfoChange,
  onSubmit,
  updating,
}) => {
  const genderOptions = [
    { value: Gender.MALE, label: "Male" },
    { value: Gender.FEMALE, label: "Female" },
    { value: Gender.OTHER, label: "Other" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Basic Information
        </h2>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Full Name"
              name="name"
              value={basicInfo.name || ""}
              onChange={(e) =>
                onBasicInfoChange({ ...basicInfo, name: e.target.value })
              }
              placeholder="Enter your full name"
              size="md"
              required
            />

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={basicInfo.email || ""}
              onChange={(e) =>
                onBasicInfoChange({ ...basicInfo, email: e.target.value })
              }
              placeholder="Enter your email"
              size="md"
              required
            />

            <CustomSelect
              name="gender"
              label="Gender"
              value={basicInfo.gender || null}
              onChange={(option) =>
                onBasicInfoChange({
                  ...basicInfo,
                  gender: option?.value as Gender,
                })
              }
              options={genderOptions}
              placeholder="Select gender"
              height="2.5rem"
              fontSize="0.875rem"
              required
            />

            <CustomSelect
              name="country"
              label="Country"
              value={basicInfo.country || null}
              onChange={(option) =>
                onBasicInfoChange({ ...basicInfo, country: option?.value })
              }
              options={countryOptions}
              placeholder="Select country"
              height="2.5rem"
              fontSize="0.875rem"
              isSearchable
              required
            />

            <CustomSelect
              name="language"
              label="Language"
              value={basicInfo.language || null}
              onChange={(option) =>
                onBasicInfoChange({ ...basicInfo, language: option?.value })
              }
              options={languageOptions}
              placeholder="Select language"
              height="2.5rem"
              fontSize="0.875rem"
              isSearchable
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="orange" disabled={updating}>
              {updating ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BasicInfoForm;
