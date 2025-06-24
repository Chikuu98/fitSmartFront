import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerMember, registerMentor } from "../../api/endpoints/register";
import logodark from "../../assets/logodark.png";
import { FitnessLevelEnum, Gender } from "../../enums/userDetailEnums";
import countryList from "react-select-country-list";
import CustomSelect from "../../components/Select/customSelect";

const Register: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"member" | "mentor">("member");
  const [showMoreMember, setShowMoreMember] = useState(false);
  const [showMoreMentor, setShowMoreMentor] = useState(false);
  const countries = useMemo(() => countryList().getData(), []);
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
    {}
  );
  const [mentorErrors, setMentorErrors] = useState<{ [key: string]: string }>(
    {}
  );
  const [generalError, setGeneralError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleMemberChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setMemberData({ ...memberData, [e.target.name]: e.target.value });
    setMemberErrors({ ...memberErrors, [e.target.name]: "" }); // Clear error on change
  };

  const handleMentorChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setMentorData({ ...mentorData, [e.target.name]: e.target.value });
    setMentorErrors({ ...mentorErrors, [e.target.name]: "" }); // Clear error on change
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMemberErrors({});
    setGeneralError(null);
    try {
      const payload = {
        ...memberData,
        age: Number(memberData.age),
        height: Number(memberData.height),
        weight: Number(memberData.weight),
      };
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
      });
    } catch (err: any) {
      if (err?.response?.data?.validation_erros) {
        const errorArr = err.response.data.validation_erros;
        const errorObj = errorArr.reduce(
          (acc: any, curr: any) => ({ ...acc, ...curr }),
          {}
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
      await registerMentor(mentorData);
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
      if (err?.response?.data?.validation_erros) {
        const errorArr = err.response.data.validation_erros;
        const errorObj = errorArr.reduce(
          (acc: any, curr: any) => ({ ...acc, ...curr }),
          {}
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
      <div className="hidden md:flex md:h-screen md:w-1/2 flex-col justify-center items-center bg-gradient-to-br from-blue-800 to-orange-600 text-white p-8 md:p-12">
        <img src={logodark} alt="FitSmart Logo" className="h-25 mb-6" />
        <h2 className="text-3xl font-bold mb-2 text-center">Join with us!</h2>
        <p className="text-base md:text-lg text-center max-w-xs">
          Empower your fitness journey with smart guidance and a supportive
          community.
        </p>
      </div>

      <div className="w-full min-h-screen md:min-h-0 md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12">
        <div className="flex mb-8 w-full max-w-md">
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

        <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
          {generalError && (
            <div className="mb-4 text-center text-red-600 text-sm">
              {generalError}
            </div>
          )}
          {activeTab === "member" ? (
            <form onSubmit={handleMemberSubmit} className="space-y-3">
              {!showMoreMember ? (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={memberData.name}
                    onChange={handleMemberChange}
                    required
                    className="w-full border p-1.5 rounded text-sm"
                  />
                  {memberErrors.name && (
                    <div className="text-xs text-red-600">
                      {memberErrors.name}
                    </div>
                  )}
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={memberData.email}
                    onChange={handleMemberChange}
                    required
                    className="w-full border p-1.5 rounded text-sm"
                  />
                  {memberErrors.email && (
                    <div className="text-xs text-red-600">
                      {memberErrors.email}
                    </div>
                  )}
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={memberData.password}
                    onChange={handleMemberChange}
                    required
                    className="w-full border p-1.5 rounded text-sm"
                  />
                  {memberErrors.password && (
                    <div className="text-xs text-red-600">
                      {memberErrors.password}
                    </div>
                  )}
                  <CustomSelect
                    name="gender"
                    value={memberData.gender}
                    onChange={handleMemberChange}
                    options={Object.values(Gender).map((g) => ({
                      value: g,
                      label: g.charAt(0).toUpperCase() + g.slice(1),
                    }))}
                    placeholder="Select Gender"
                    required
                  />
                  {memberErrors.gender && (
                    <div className="text-xs text-red-600">
                      {memberErrors.gender}
                    </div>
                  )}
                  <CustomSelect
                    name="fitness_level"
                    value={memberData.fitness_level}
                    onChange={handleMemberChange}
                    options={Object.values(FitnessLevelEnum).map((level) => ({
                      value: level,
                      label: level.charAt(0).toUpperCase() + level.slice(1),
                    }))}
                    placeholder="Select Fitness Level"
                    required
                  />
                  {memberErrors.fitness_level && (
                    <div className="text-xs text-red-600">
                      {memberErrors.fitness_level}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowMoreMember(true)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Fill Optional Fields
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={memberData.age}
                    onChange={handleMemberChange}
                    className="w-full border p-1.5 rounded text-sm"
                  />
                  {memberErrors.age && (
                    <div className="text-xs text-red-600">
                      {memberErrors.age}
                    </div>
                  )}
                  <input
                    type="number"
                    name="height"
                    placeholder="Height (cm)"
                    value={memberData.height}
                    onChange={handleMemberChange}
                    className="w-full border p-1.5 rounded text-sm"
                  />
                  {memberErrors.height && (
                    <div className="text-xs text-red-600">
                      {memberErrors.height}
                    </div>
                  )}
                  <input
                    type="number"
                    name="weight"
                    placeholder="Weight (kg)"
                    value={memberData.weight}
                    onChange={handleMemberChange}
                    className="w-full border p-1.5 rounded text-sm"
                  />
                  {memberErrors.weight && (
                    <div className="text-xs text-red-600">
                      {memberErrors.weight}
                    </div>
                  )}
                  <input
                    type="text"
                    name="goal"
                    placeholder="Goal"
                    value={memberData.goal}
                    onChange={handleMemberChange}
                    className="w-full border p-1.5 rounded text-sm"
                  />
                  {memberErrors.goal && (
                    <div className="text-xs text-red-600">
                      {memberErrors.goal}
                    </div>
                  )}
                  <input
                    type="text"
                    name="dietary_preference"
                    placeholder="Dietary Preference"
                    value={memberData.dietary_preference}
                    onChange={handleMemberChange}
                    className="w-full border p-1.5 rounded text-sm"
                  />
                  {memberErrors.dietary_preference && (
                    <div className="text-xs text-red-600">
                      {memberErrors.dietary_preference}
                    </div>
                  )}
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
            <form onSubmit={handleMentorSubmit} className="space-y-3">
              {!showMoreMentor ? (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={mentorData.name}
                    onChange={handleMentorChange}
                    required
                    className="w-full border p-1.5 rounded text-sm"
                  />
                  {mentorErrors.name && (
                    <div className="text-xs text-red-600">
                      {mentorErrors.name}
                    </div>
                  )}
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={mentorData.email}
                    onChange={handleMentorChange}
                    required
                    className="w-full border p-1.5 rounded text-sm"
                  />
                  {mentorErrors.email && (
                    <div className="text-xs text-red-600">
                      {mentorErrors.email}
                    </div>
                  )}
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={mentorData.password}
                    onChange={handleMentorChange}
                    required
                    className="w-full border p-1.5 rounded text-sm"
                  />
                  {mentorErrors.password && (
                    <div className="text-xs text-red-600">
                      {mentorErrors.password}
                    </div>
                  )}
                  <CustomSelect
                    name="gender"
                    value={mentorData.gender}
                    onChange={handleMentorChange}
                    options={Object.values(Gender).map((g) => ({
                      value: g,
                      label: g.charAt(0).toUpperCase() + g.slice(1),
                    }))}
                    placeholder="Select Gender"
                    required
                  />
                  {mentorErrors.gender && (
                    <div className="text-xs text-red-600">
                      {mentorErrors.gender}
                    </div>
                  )}
                  <CustomSelect
                    name="country"
                    value={mentorData.country}
                    onChange={handleMentorChange}
                    options={countries}
                    placeholder="Select Country"
                    required
                  />
                  {mentorErrors.country && (
                    <div className="text-xs text-red-600">
                      {mentorErrors.country}
                    </div>
                  )}
                  <input
                    type="text"
                    name="language"
                    placeholder="Language"
                    value={mentorData.language}
                    onChange={handleMentorChange}
                    className="w-full border p-1.5 rounded text-sm"
                  />
                  {mentorErrors.language && (
                    <div className="text-xs text-red-600">
                      {mentorErrors.language}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowMoreMentor(true)}
                    className="text-sm text-orange-600 hover:underline"
                  >
                    Fill Optional Fields
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    name="expertise"
                    placeholder="Expertise"
                    value={mentorData.expertise}
                    onChange={handleMentorChange}
                    className="w-full border p-1.5 rounded text-sm"
                  />
                  {mentorErrors.expertise && (
                    <div className="text-xs text-red-600">
                      {mentorErrors.expertise}
                    </div>
                  )}
                  <textarea
                    name="bio"
                    placeholder="Bio"
                    value={mentorData.bio}
                    onChange={handleMentorChange}
                    className="w-full border p-1.5 rounded text-sm"
                  />
                  {mentorErrors.bio && (
                    <div className="text-xs text-red-600">
                      {mentorErrors.bio}
                    </div>
                  )}
                  <input
                    type="text"
                    name="certifications"
                    placeholder="Certifications"
                    value={mentorData.certifications}
                    onChange={handleMentorChange}
                    className="w-full border p-1.5 rounded text-sm"
                  />
                  {mentorErrors.certifications && (
                    <div className="text-xs text-red-600">
                      {mentorErrors.certifications}
                    </div>
                  )}
                  <input
                    type="text"
                    name="social_links"
                    placeholder="Social Links"
                    value={mentorData.social_links}
                    onChange={handleMentorChange}
                    className="w-full border p-1.5 rounded text-sm"
                  />
                  {mentorErrors.social_links && (
                    <div className="text-xs text-red-600">
                      {mentorErrors.social_links}
                    </div>
                  )}
                  <input
                    type="text"
                    name="contact_number"
                    placeholder="Contact Number"
                    value={mentorData.contact_number}
                    onChange={handleMentorChange}
                    className="w-full border p-1.5 rounded text-sm"
                  />
                  {mentorErrors.contact_number && (
                    <div className="text-xs text-red-600">
                      {mentorErrors.contact_number}
                    </div>
                  )}
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
