import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerMember, registerMentor } from "../../api/endpoints/register";
import logodark from "../../assets/logodark.png";
import { Gender } from "../../enums/userDetailEnums";
import countryList from "react-select-country-list";
import CustomSelect from "../../components/ui/customSelect";
import ISO6391 from "iso-639-1";
import { filterPayload } from "../../utils/filterPayload";

const Register: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"member" | "mentor">("member");
  const [showMoreMember, setShowMoreMember] = useState(false);
  const [showMoreMentor, setShowMoreMentor] = useState(false);
  const countries = useMemo(() => countryList().getData(), []);
  const languages = ISO6391.getAllNames().map((name) => ({
    value: name,
    label: name,
  }));

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
    <div className="min-h-screen flex flex-col justify-center items-center md:flex-row md:justify-start bg-white">
      <div className="hidden md:flex md:h-screen md:w-1/2 flex flex-col flex-1 items-center justify-center bg-gradient-to-br from-blue-800 to-orange-600 text-white p-0">
        <div className="flex flex-col flex-1 justify-center items-center w-full">
          <img src={logodark} alt="FitSmart Logo" className="h-20 mb-4" />
          <h2 className="text-2xl font-bold mb-1 text-center">Join with us!</h2>
          <p className="text-base md:text-md text-center max-w-xs">
            Empower your fitness journey with smart guidance and a supportive
            community.
          </p>
        </div>
      </div>

      <div className="w-full min-h-screen md:min-h-0 md:w-1/2 flex flex-col justify-center items-center px-2 py-4 md:px-6 md:py-8">
        <div className="flex mb-4 w-full max-w-md">
          <button
            className={`flex-1 py-2 font-semibold rounded-tl-lg border-b-2 ${
              activeTab === "member"
                ? "border-blue-500 text-blue-500 bg-blue-50"
                : "border-gray-200 text-gray-500 bg-white"
            }`}
            onClick={() => setActiveTab("member")}
          >
            Member Sign Up
          </button>
          <button
            className={`flex-1 py-2 font-semibold rounded-tr-lg border-b-2 ${
              activeTab === "mentor"
                ? "border-orange-500 text-orange-500 bg-orange-50"
                : "border-gray-200 text-gray-500 bg-white"
            }`}
            onClick={() => setActiveTab("mentor")}
          >
            Mentor Sign Up
          </button>
        </div>

        <div className="w-full max-w-md bg-white rounded-lg shadow p-3 md:p-4 overflow-y-auto max-h-[90vh] text-xs md:text-sm">
          {generalError && (
            <div className="mb-4 text-center text-red-600 text-sm">
              {generalError}
            </div>
          )}
          {activeTab === "member" ? (
            <form onSubmit={handleMemberSubmit} className="space-y-2">
              {!showMoreMember && (
                <>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={memberData.name}
                      onChange={handleMemberChange}
                      required
                      className="w-full border p-1 rounded text-xs"
                    />
                    {memberErrors.name && (
                      <div className="text-xs text-red-600">
                        {memberErrors.name}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={memberData.email}
                      onChange={handleMemberChange}
                      required
                      className="w-full border p-1 rounded text-xs"
                    />
                    {memberErrors.email && (
                      <div className="text-xs text-red-600">
                        {memberErrors.email}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={memberData.password}
                      onChange={handleMemberChange}
                      required
                      className="w-full border p-1 rounded text-xs"
                    />
                    {memberErrors.password && (
                      <div className="text-xs text-red-600">
                        {memberErrors.password}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
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
                      <div className="text-xs text-red-600">
                        {memberErrors.gender}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
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
                      options={countries}
                      placeholder="Select Country"
                      required
                      height="1.5rem"
                      fontSize="0.75rem"
                    />
                    {memberErrors.country && (
                      <div className="text-xs text-red-600">
                        {memberErrors.country}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
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
                      options={languages}
                      placeholder="Select Language"
                      required
                      height="1.5rem"
                      fontSize="0.75rem"
                    />
                    {memberErrors.language && (
                      <div className="text-xs text-red-600">
                        {memberErrors.language}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMoreMember(true)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Fill Optional Fields
                  </button>
                </>
              )}
              {showMoreMember && (
                <>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
                      Age <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      placeholder="Age"
                      value={memberData.age}
                      onChange={handleMemberChange}
                      className="w-full border p-1 rounded text-xs"
                    />
                    {memberErrors.age && (
                      <div className="text-xs text-red-600">
                        {memberErrors.age}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
                      Height (cm){" "}
                      <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="number"
                      name="height"
                      placeholder="Height (cm)"
                      value={memberData.height}
                      onChange={handleMemberChange}
                      className="w-full border p-1 rounded text-xs"
                    />
                    {memberErrors.height && (
                      <div className="text-xs text-red-600">
                        {memberErrors.height}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
                      Weight (kg){" "}
                      <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="number"
                      name="weight"
                      placeholder="Weight (kg)"
                      value={memberData.weight}
                      onChange={handleMemberChange}
                      className="w-full border p-1 rounded text-xs"
                    />
                    {memberErrors.weight && (
                      <div className="text-xs text-red-600">
                        {memberErrors.weight}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
                      Goal <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      name="goal"
                      placeholder="Goal"
                      value={memberData.goal}
                      onChange={handleMemberChange}
                      className="w-full border p-1 rounded text-xs"
                    />
                    {memberErrors.goal && (
                      <div className="text-xs text-red-600">
                        {memberErrors.goal}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
                      Dietary Preference{" "}
                      <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      name="dietary_preference"
                      placeholder="Dietary Preference"
                      value={memberData.dietary_preference}
                      onChange={handleMemberChange}
                      className="w-full border p-1 rounded text-xs"
                    />
                    {memberErrors.dietary_preference && (
                      <div className="text-xs text-red-600">
                        {memberErrors.dietary_preference}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
                      Fitness Level{" "}
                      <span className="text-gray-400">(optional)</span>
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
                      <div className="text-xs text-red-600">
                        {memberErrors.fitness_level}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMoreMember(false)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Back to * Required Fields
                  </button>
                </>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold text-sm"
              >
                {loading ? "Registering..." : "Sign Up as Member"}
              </button>
              <div className="text-center mt-3 text-xs text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-500 hover:underline"
                >
                  Login
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleMentorSubmit} className="space-y-2">
              {!showMoreMentor && (
                <>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={mentorData.name}
                      onChange={handleMentorChange}
                      required
                      className="w-full border p-1 rounded text-xs"
                    />
                    {mentorErrors.name && (
                      <div className="text-xs text-red-600">
                        {mentorErrors.name}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={mentorData.email}
                      onChange={handleMentorChange}
                      required
                      className="w-full border p-1 rounded text-xs"
                    />
                    {mentorErrors.email && (
                      <div className="text-xs text-red-600">
                        {mentorErrors.email}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={mentorData.password}
                      onChange={handleMentorChange}
                      required
                      className="w-full border p-1 rounded text-xs"
                    />
                    {mentorErrors.password && (
                      <div className="text-xs text-red-600">
                        {mentorErrors.password}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
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
                      <div className="text-xs text-red-600">
                        {mentorErrors.gender}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
                      Expertise <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="expertise"
                      placeholder="Expertise"
                      value={mentorData.expertise}
                      onChange={handleMentorChange}
                      required
                      className="w-full border p-1 rounded text-xs"
                    />
                    {mentorErrors.expertise && (
                      <div className="text-xs text-red-600">
                        {mentorErrors.expertise}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
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
                      options={countries}
                      placeholder="Select Country"
                      required
                      height="1.5rem"
                      fontSize="0.75rem"
                    />
                    {mentorErrors.country && (
                      <div className="text-xs text-red-600">
                        {mentorErrors.country}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
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
                      options={languages}
                      placeholder="Select Language"
                      required
                      height="1.5rem"
                      fontSize="0.75rem"
                    />
                    {mentorErrors.language && (
                      <div className="text-xs text-red-600">
                        {mentorErrors.language}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMoreMentor(true)}
                    className="text-sm text-orange-600 hover:underline"
                  >
                    Fill Optional Fields
                  </button>
                </>
              )}
              {showMoreMentor && (
                <>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
                      Bio <span className="text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      name="bio"
                      placeholder="Bio"
                      value={mentorData.bio}
                      onChange={handleMentorChange}
                      className="w-full border p-1 rounded text-xs"
                    />
                    {mentorErrors.bio && (
                      <div className="text-xs text-red-600">
                        {mentorErrors.bio}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
                      Certifications{" "}
                      <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      name="certifications"
                      placeholder="Certifications"
                      value={mentorData.certifications}
                      onChange={handleMentorChange}
                      className="w-full border p-1 rounded text-xs"
                    />
                    {mentorErrors.certifications && (
                      <div className="text-xs text-red-600">
                        {mentorErrors.certifications}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
                      Social Links{" "}
                      <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      name="social_links"
                      placeholder="Social Links"
                      value={mentorData.social_links}
                      onChange={handleMentorChange}
                      className="w-full border p-1 rounded text-xs"
                    />
                    {mentorErrors.social_links && (
                      <div className="text-xs text-red-600">
                        {mentorErrors.social_links}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">
                      Contact Number{" "}
                      <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      name="contact_number"
                      placeholder="Contact Number"
                      value={mentorData.contact_number}
                      onChange={handleMentorChange}
                      className="w-full border p-1 rounded text-xs"
                    />
                    {mentorErrors.contact_number && (
                      <div className="text-xs text-red-600">
                        {mentorErrors.contact_number}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMoreMentor(false)}
                    className="text-sm text-red-600 hover:underline"
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
              <div className="text-center mt-3 text-xs text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-orange-600 hover:underline"
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
