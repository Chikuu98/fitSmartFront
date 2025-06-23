import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerMember, registerMentor } from "../../api/endpoints/register";
import logodark from "../../assets/logodark.png";
import { FitnessLevelEnum, Gender } from "../../enums/userDetailEnums";

const Register: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"member" | "mentor">("member");
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
    certifications: "",
    social_links: "",
    contact_number: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleMemberChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setMemberData({ ...memberData, [e.target.name]: e.target.value });
  };

  const handleMentorChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setMentorData({ ...mentorData, [e.target.name]: e.target.value });
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
    } catch (err) {}
    setLoading(false);
  };

  const handleMentorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerMentor(mentorData);
      setMentorData({
        name: "",
        email: "",
        password: "",
        gender: "",
        expertise: "",
        bio: "",
        certifications: "",
        social_links: "",
        contact_number: "",
      });
    } catch (err) {}
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-gradient-to-br from-blue-800 to-orange-600 text-white p-12">
        <img src={logodark} alt="FitSmart Logo" className="h-25 mb-6" />
        <h2 className="text-3xl font-bold mb-2">Join with us!</h2>
        <p className="text-lg text-center max-w-xs">
          Empower your fitness journey with smart guidance and a supportive
          community.
        </p>
      </div>
      {/* Right Side */}
      <div className="w-1/2 flex flex-col justify-center items-center p-12">
        {/* Tabs */}
        <div className="flex mb-8 w-full max-w-md">
          <button
            className={`flex-1 py-2 font-semibold rounded-tl-lg border-b-2 ${
              activeTab === "member"
                ? "border-blue-700 text-blue-700 bg-blue-50"
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
        {/* Forms */}
        <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
          {activeTab === "member" ? (
            <form onSubmit={handleMemberSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={memberData.name}
                onChange={handleMemberChange}
                className="w-full border p-1.5 rounded text-sm"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={memberData.email}
                onChange={handleMemberChange}
                className="w-full border p-1.5 rounded text-sm"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={memberData.password}
                onChange={handleMemberChange}
                className="w-full border p-1.5 rounded text-sm"
                required
              />
              <select
                name="gender"
                value={memberData.gender}
                onChange={handleMemberChange}
                className="w-full border p-1.5 rounded text-sm"
                required
              >
                <option value="">Select Gender</option>
                {Object.values(Gender).map((g) => (
                  <option key={g} value={g}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={memberData.age}
                onChange={handleMemberChange}
                className="w-full border p-1.5 rounded text-sm"
              />
              <input
                type="number"
                name="height"
                placeholder="Height (cm)"
                value={memberData.height}
                onChange={handleMemberChange}
                className="w-full border p-1.5 rounded text-sm"
              />
              <input
                type="number"
                name="weight"
                placeholder="Weight (kg)"
                value={memberData.weight}
                onChange={handleMemberChange}
                className="w-full border p-1.5 rounded text-sm"
              />
              <select
                name="fitness_level"
                value={memberData.fitness_level}
                onChange={handleMemberChange}
                className="w-full border p-1.5 rounded text-sm"
                required
              >
                <option value="">Select Fitness Level</option>
                {Object.values(FitnessLevelEnum).map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="goal"
                placeholder="Goal"
                value={memberData.goal}
                onChange={handleMemberChange}
                className="w-full border p-1.5 rounded text-sm"
              />
              <input
                type="text"
                name="dietary_preference"
                placeholder="Dietary Preference"
                value={memberData.dietary_preference}
                onChange={handleMemberChange}
                className="w-full border p-1.5 rounded text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded font-semibold text-sm"
              >
                {loading ? "Registering..." : "Sign Up as Member"}
              </button>
              <div className="text-center mt-3">
                <span className="text-xs text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-blue-700 hover:underline"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                </span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleMentorSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={mentorData.name}
                onChange={handleMentorChange}
                className="w-full border p-1.5 rounded text-sm"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={mentorData.email}
                onChange={handleMentorChange}
                className="w-full border p-1.5 rounded text-sm"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={mentorData.password}
                onChange={handleMentorChange}
                className="w-full border p-1.5 rounded text-sm"
                required
              />
              <select
                name="gender"
                value={mentorData.gender}
                onChange={handleMentorChange}
                className="w-full border p-1.5 rounded text-sm"
                required
              >
                <option value="">Select Gender</option>
                {Object.values(Gender).map((g) => (
                  <option key={g} value={g}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="expertise"
                placeholder="Expertise"
                value={mentorData.expertise}
                onChange={handleMentorChange}
                className="w-full border p-1.5 rounded text-sm"
              />
              <textarea
                name="bio"
                placeholder="Bio"
                value={mentorData.bio}
                onChange={handleMentorChange}
                className="w-full border p-1.5 rounded text-sm"
              />
              <input
                type="text"
                name="certifications"
                placeholder="Certifications"
                value={mentorData.certifications}
                onChange={handleMentorChange}
                className="w-full border p-1.5 rounded text-sm"
              />
              <input
                type="text"
                name="social_links"
                placeholder="Social Links"
                value={mentorData.social_links}
                onChange={handleMentorChange}
                className="w-full border p-1.5 rounded text-sm"
              />
              <input
                type="text"
                name="contact_number"
                placeholder="Contact Number"
                value={mentorData.contact_number}
                onChange={handleMentorChange}
                className="w-full border p-1.5 rounded text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded font-semibold text-sm"
              >
                {loading ? "Registering..." : "Sign Up as Mentor"}
              </button>
              <div className="text-center mt-3">
                <span className="text-xs text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-orange-500 hover:underline"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
