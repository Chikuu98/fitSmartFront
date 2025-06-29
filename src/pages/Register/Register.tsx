import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerMember, registerMentor } from "../../api/endpoints/register";
import logodark from "../../assets/logodark.png";
import { Gender } from "../../enums/userDetailEnums";
import { CustomSelect, FormInput, TextAreaInput } from "../../components/ui";
import { filterPayload } from "../../utils/filterPayload";
import { languageOptions } from "../../utils/languageOptions";
import { countryOptions } from "../../utils/countryOptions";

const Register: React.FC = () => {

  const [activeTab, setActiveTab] = useState<"member" | "mentor">("member");
  const [showMoreMember, setShowMoreMember] = useState(false);
  const [showMoreMentor, setShowMoreMentor] = useState(false);

  const [memberData, setMemberData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    fitness_level: "",
    goal: "",
    dietary_preference: "",
    country: "",
    language: "",
  });

  const [mentorData, setMentorData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    expertise: "",
    bio: "",
    country: "",
    language: "",
    certifications: "",
    social_links: "",
    contact_number: "",
  });

  const [loading, setLoading] = useState(false);
  const [memberErrors, setMemberErrors] = useState<{ [key: string]: string }>(
    {},
  );
  const [mentorErrors, setMentorErrors] = useState<{ [key: string]: string }>(
    {},
  );
  const [generalError, setGeneralError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleMemberChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setMemberData({ ...memberData, [e.target.name]: e.target.value });
    setMemberErrors({ ...memberErrors, [e.target.name]: "" });
  };

  const handleMentorChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setMentorData({ ...mentorData, [e.target.name]: e.target.value });
    setMentorErrors({ ...mentorErrors, [e.target.name]: "" });
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMemberErrors({});
    setGeneralError(null);
    try {
      const rawPayload = {
        ...memberData,
        age: memberData.age ? Number(memberData.age) : undefined,
        height: memberData.height ? Number(memberData.height) : undefined,
        weight: memberData.weight ? Number(memberData.weight) : undefined,
      };
      const payload = filterPayload(rawPayload);
      await registerMember(payload);
      setMemberData({
        name: "",
        email: "",
        password: "",
        gender: "",
        age: "",
        height: "",
        weight: "",
        fitness_level: "",
        goal: "",
        dietary_preference: "",
        country: "",
        language: "",
      });
    } catch (err: any) {
      if (err?.response?.data?.validation_errors) {
        const errorArr = err.response.data.validation_errors;
        const errorObj = errorArr.reduce(
          (acc: any, curr: any) => ({ ...acc, ...curr }),
          {},
        );
        setMemberErrors(errorObj);
      } else if (err?.response?.data?.message) {
        setGeneralError(err.response.data.message);
      } else {
        setGeneralError("Registration failed. Please try again.");
      }
    }
    setLoading(false);
  };

  const handleMentorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMentorErrors({});
    setGeneralError(null);
    try {
      const rawPayload = { ...mentorData };
      const payload = filterPayload(rawPayload);
      await registerMentor(payload);
      setMentorData({
        name: "",
        email: "",
        password: "",
        gender: "",
        expertise: "",
        bio: "",
        country: "",
        language: "",
        certifications: "",
        social_links: "",
        contact_number: "",
      });
    } catch (err: any) {
      if (err?.response?.data?.validation_errors) {
        const errorArr = err.response.data.validation_errors;
        const errorObj = errorArr.reduce(
          (acc: any, curr: any) => ({ ...acc, ...curr }),
          {},
        );
        setMentorErrors(errorObj);
      } else if (err?.response?.data?.message) {
        setGeneralError(err.response.data.message);
      } else {
        setGeneralError("Registration failed. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Left Side Cover - always fills left half, no white space */}
      <div className="hidden md:block md:w-1/2 h-screen bg-gradient-to-br from-blue-800 to-orange-600 text-white">
        <div className="flex flex-col items-center justify-center h-full w-full">
          <img
            src={logodark}
            alt="FitSmart Logo"
            className="h-20 mb-4"
          />
          <h2 className="text-2xl font-bold mb-1 text-center">Join with us!</h2>
          <p className="text-base md:text-md text-center max-w-xs">
            Empower your fitness journey with smart guidance and a supportive
            community.
          </p>
        </div>
      </div>
      {/* Right Side Form */}
      <div className="w-full min-h-screen md:min-h-0 md:w-1/2 flex flex-col justify-center items-center px-2 py-4 md:px-6 md:py-8 bg-gray-50 dark:bg-gray-900">
        <div className="flex mb-4 w-full max-w-md">
          <button
            className={`flex-1 py-2 font-semibold rounded-tl-lg border-b-2 transition-colors ${
              activeTab === "member"
                ? "border-orange-500 text-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400"
                : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800"
            }`}
            onClick={() => setActiveTab("member")}
          >
            Member Sign Up
          </button>
          <button
            className={`flex-1 py-2 font-semibold rounded-tr-lg border-b-2 transition-colors ${
              activeTab === "mentor"
                ? "border-orange-500 text-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400"
                : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800"
            }`}
            onClick={() => setActiveTab("mentor")}
          >
            Mentor Sign Up
          </button>
        </div>

        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 p-3 md:p-4 overflow-y-auto max-h-[90vh] text-xs md:text-sm border border-gray-200 dark:border-gray-700 transition-colors">
          {generalError && (
            <div className="mb-4 text-center text-red-600 dark:text-red-400 text-sm">
              {generalError}
            </div>
          )}
          {activeTab === "member" ? (
            <form onSubmit={handleMemberSubmit} className="space-y-2">
              {!showMoreMember && (
                <>
                  <FormInput
                    label="Full Name"
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    value={memberData.name}
                    onChange={handleMemberChange}
                    required
                    error={memberErrors.name}
                  />
                  <FormInput
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={memberData.email}
                    onChange={handleMemberChange}
                    required
                    error={memberErrors.email}
                  />
                  <FormInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={memberData.password}
                    onChange={handleMemberChange}
                    required
                    error={memberErrors.password}
                  />
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <CustomSelect
                      name="gender"
                      value={memberData.gender}
                      onChange={(option) =>
                        setMemberData({
                          ...memberData,
                          gender: option ? option.value : "",
                        })
                      }
                      options={Object.values(Gender).map((g) => ({
                        value: g,
                        label: g.charAt(0).toUpperCase() + g.slice(1),
                      }))}
                      placeholder="Select Gender"
                      required
                      height="1.5rem"
                      fontSize="0.75rem"
                    />
                    {memberErrors.gender && (
                      <div className="text-xs text-red-600 dark:text-red-400">
                        {memberErrors.gender}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <CustomSelect
                      name="country"
                      value={memberData.country}
                      onChange={(option) =>
                        setMemberData({
                          ...memberData,
                          country: option ? option.value : "",
                        })
                      }
                      options={countryOptions}
                      placeholder="Select Country"
                      required
                      height="1.5rem"
                      fontSize="0.75rem"
                    />
                    {memberErrors.country && (
                      <div className="text-xs text-red-600 dark:text-red-400">
                        {memberErrors.country}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Language <span className="text-red-500">*</span>
                    </label>
                    <CustomSelect
                      name="language"
                      value={memberData.language}
                      onChange={(option) =>
                        setMemberData({
                          ...memberData,
                          language: option ? option.value : "",
                        })
                      }
                      options={languageOptions}
                      placeholder="Select Language"
                      required
                      height="1.5rem"
                      fontSize="0.75rem"
                    />
                    {memberErrors.language && (
                      <div className="text-xs text-red-600 dark:text-red-400">
                        {memberErrors.language}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMoreMember(true)}
                    className="text-sm text-orange-600 hover:underline"
                  >
                    Fill Optional Fields
                  </button>
                </>
              )}
              {showMoreMember && (
                <>
                  <FormInput
                    label="Age (optional)"
                    name="age"
                    type="number"
                    placeholder="Age"
                    value={memberData.age}
                    onChange={handleMemberChange}
                    error={memberErrors.age}
                  />
                  <FormInput
                    label="Height (cm) (optional)"
                    name="height"
                    type="number"
                    placeholder="Height (cm)"
                    value={memberData.height}
                    onChange={handleMemberChange}
                    error={memberErrors.height}
                  />
                  <FormInput
                    label="Weight (kg) (optional)"
                    name="weight"
                    type="number"
                    placeholder="Weight (kg)"
                    value={memberData.weight}
                    onChange={handleMemberChange}
                    error={memberErrors.weight}
                  />
                  <FormInput
                    label="Goal (optional)"
                    name="goal"
                    type="text"
                    placeholder="Goal"
                    value={memberData.goal}
                    onChange={handleMemberChange}
                    error={memberErrors.goal}
                  />
                  <FormInput
                    label="Dietary Preference (optional)"
                    name="dietary_preference"
                    type="text"
                    placeholder="Dietary Preference"
                    value={memberData.dietary_preference}
                    onChange={handleMemberChange}
                    error={memberErrors.dietary_preference}
                  />
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Fitness Level{" "}
                      <span className="text-gray-400 dark:text-gray-500">
                        (optional)
                      </span>
                    </label>
                    <CustomSelect
                      name="fitness_level"
                      value={memberData.fitness_level}
                      onChange={(option) =>
                        setMemberData({
                          ...memberData,
                          fitness_level: option ? option.value : "",
                        })
                      }
                      options={[
                        { value: "beginner", label: "Beginner" },
                        { value: "intermediate", label: "Intermediate" },
                        { value: "advanced", label: "Advanced" },
                      ]}
                      placeholder="Select Fitness Level"
                      height="1.5rem"
                      fontSize="0.75rem"
                    />
                    {memberErrors.fitness_level && (
                      <div className="text-xs text-red-600 dark:text-red-400">
                        {memberErrors.fitness_level}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMoreMember(false)}
                    className="text-sm text-red-600 dark:text-red-400 hover:underline"
                  >
                    Back to * Required Fields
                  </button>
                </>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded font-semibold text-sm"
              >
                {loading ? "Registering..." : "Sign Up as Member"}
              </button>
              <div className="text-center mt-3 text-xs text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-orange-500 dark:text-orange-400 hover:underline"
                >
                  Login
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleMentorSubmit} className="space-y-2">
              {!showMoreMentor && (
                <>
                  <FormInput
                    label="Full Name"
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    value={mentorData.name}
                    onChange={handleMentorChange}
                    required
                    error={mentorErrors.name}
                  />
                  <FormInput
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={mentorData.email}
                    onChange={handleMentorChange}
                    required
                    error={mentorErrors.email}
                  />
                  <FormInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={mentorData.password}
                    onChange={handleMentorChange}
                    required
                    error={mentorErrors.password}
                  />
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <CustomSelect
                      name="gender"
                      value={mentorData.gender}
                      onChange={(option) =>
                        setMentorData({
                          ...mentorData,
                          gender: option ? option.value : "",
                        })
                      }
                      options={Object.values(Gender).map((g) => ({
                        value: g,
                        label: g.charAt(0).toUpperCase() + g.slice(1),
                      }))}
                      placeholder="Select Gender"
                      required
                      height="1.5rem"
                      fontSize="0.75rem"
                    />
                    {mentorErrors.gender && (
                      <div className="text-xs text-red-600 dark:text-red-400">
                        {mentorErrors.gender}
                      </div>
                    )}
                  </div>
                  <FormInput
                    label="Expertise"
                    name="expertise"
                    type="text"
                    placeholder="Expertise"
                    value={mentorData.expertise}
                    onChange={handleMentorChange}
                    required
                    error={mentorErrors.expertise}
                  />
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <CustomSelect
                      name="country"
                      value={mentorData.country}
                      onChange={(option) =>
                        setMentorData({
                          ...mentorData,
                          country: option ? option.value : "",
                        })
                      }
                      options={countryOptions}
                      placeholder="Select Country"
                      required
                      height="1.5rem"
                      fontSize="0.75rem"
                    />
                    {mentorErrors.country && (
                      <div className="text-xs text-red-600 dark:text-red-400">
                        {mentorErrors.country}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Language <span className="text-red-500">*</span>
                    </label>
                    <CustomSelect
                      name="language"
                      value={mentorData.language}
                      onChange={(option) =>
                        setMentorData({
                          ...mentorData,
                          language: option ? option.value : "",
                        })
                      }
                      options={languageOptions}
                      placeholder="Select Language"
                      required
                      height="1.5rem"
                      fontSize="0.75rem"
                    />
                    {mentorErrors.language && (
                      <div className="text-xs text-red-600 dark:text-red-400">
                        {mentorErrors.language}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMoreMentor(true)}
                    className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
                  >
                    Fill Optional Fields
                  </button>
                </>
              )}
              {showMoreMentor && (
                <>
                  <TextAreaInput
                    label="Bio (optional)"
                    name="bio"
                    placeholder="Bio"
                    value={mentorData.bio}
                    onChange={handleMentorChange}
                    error={mentorErrors.bio}
                  />
                  <FormInput
                    label="Certifications (optional)"
                    name="certifications"
                    type="text"
                    placeholder="Certifications"
                    value={mentorData.certifications}
                    onChange={handleMentorChange}
                    error={mentorErrors.certifications}
                  />
                  <FormInput
                    label="Social Links (optional)"
                    name="social_links"
                    type="text"
                    placeholder="Social Links"
                    value={mentorData.social_links}
                    onChange={handleMentorChange}
                    error={mentorErrors.social_links}
                  />
                  <FormInput
                    label="Contact Number (optional)"
                    name="contact_number"
                    type="text"
                    placeholder="Contact Number"
                    value={mentorData.contact_number}
                    onChange={handleMentorChange}
                    error={mentorErrors.contact_number}
                  />
                  <button
                    type="button"
                    onClick={() => setShowMoreMentor(false)}
                    className="text-sm text-red-600 dark:text-red-400 hover:underline"
                  >
                    Back to * Required Fields
                  </button>
                </>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded font-semibold text-sm"
              >
                {loading ? "Registering..." : "Sign Up as Mentor"}
              </button>
              <div className="text-center mt-3 text-xs text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-orange-600 dark:text-orange-400 hover:underline"
                >
                  Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;