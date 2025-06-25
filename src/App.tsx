import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import AdminDashboard from "./pages/Dashboards/AdminDashboard";
import MemberDashboard from "./pages/Dashboards/MemberDashboard";
import MentorDashboard from "./pages/Dashboards/MentorDashboard";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./routes/protectedRoute";
import MainLayout from "./layouts/mainLayout";
import Register from "./pages/Register/Register";
import { UserRole } from "./enums/userDetailEnums";
import BookingListMentor from "./pages/MentorBooking/Mentor/BookingListMentor";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
          <Route element={<MainLayout />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* Member Routes */}
        <Route element={<ProtectedRoute allowedRoles={[UserRole.MEMBER]} />}>
          <Route element={<MainLayout />}>
            <Route path="/member-dashboard" element={<MemberDashboard />} />
          </Route>
        </Route>

        {/* Mentor Routes */}
        <Route element={<ProtectedRoute allowedRoles={[UserRole.MENTOR]} />}>
          <Route element={<MainLayout />}>
            <Route path="/mentor-dashboard" element={<MentorDashboard />} />
            <Route path="/mentor/my-bookings" element={<BookingListMentor />} />
          </Route>
        </Route>
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
