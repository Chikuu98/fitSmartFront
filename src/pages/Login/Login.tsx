import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import { login } from "../../store/authSlice";
import { UserRole } from "../../enums/userDetailEnums";

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
    <div className="min-h-screen flex items-center justify-center bg-white text-blue-900 dark:bg-black dark:text-blue-200">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg dark:bg-black">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Welcome to FitSmart
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Email</label>
            <input
              type="email"
              className="w-full border border-neutral p-2 rounded bg-white dark:bg-gray-600"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Password</label>
            <input
              type="password"
              className="w-full border border-neutral p-2 rounded bg-white dark:bg-gray-600"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 rounded"
          >
            {loading ? "Logging in..." : "Sign in"}
          </button>
          <div className="text-center mt-2">
            <a href="#" className="text-sm hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-blue-700 hover:underline"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
