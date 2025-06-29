import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import { login } from "../../store/authSlice";
import { UserRole } from "../../enums/userDetailEnums";
import logodark from "../../assets/logodark.png";

const Login = () => {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));

    if (login.fulfilled.match(result)) {
      const role = result.payload.user.role;

      if (role === UserRole.ADMIN) {
        navigate("/admin-dashboard");
      } else if (role === UserRole.MEMBER) {
        navigate("/member-dashboard");
      } else if (role === UserRole.MENTOR) {
        navigate("/mentor-dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center md:flex-row md:justify-start bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="hidden md:flex md:h-screen md:w-1/2 flex-col justify-center items-center bg-gradient-to-br from-blue-800 to-orange-600 text-white p-8 md:p-12">
        <img
          src={logodark}
          alt="FitSmart Logo"
          className="h-20 mb-6"
        />
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">
          Welcome Back!
        </h2>
        <p className="text-base md:text-lg text-center max-w-xs">
          Sign in to continue your FitSmart journey and reach your fitness goals
          with smart guidance.
        </p>
      </div>
      <div className="w-full min-h-screen md:min-h-0 md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 p-6 md:p-8 border border-gray-200 dark:border-gray-700 transition-colors">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-blue-500 dark:text-blue-400">
            Login to FitSmart
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 dark:border-gray-600 p-1.5 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 dark:border-gray-600 p-1.5 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-2 rounded text-sm font-semibold transition-colors"
            >
              {loading ? "Logging in..." : "Sign in"}
            </button>
            <div className="text-center mt-2">
              <a
                href="#"
                className="text-sm hover:font-semibold text-blue-500 dark:text-blue-400"
              >
                Forgot password?
              </a>
            </div>
            <div className="text-center mt-3">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-blue-400 dark:text-blue-300 hover:font-semibold"
                  onClick={() => navigate("/register")}
                >
                  Register
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
