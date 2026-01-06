import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import AdminDashboard from "./pages/Dashboards/AdminDashboard";
import MemberDashboard from "./pages/Dashboards/MemberDashboard";
import MentorDashboard from "./pages/Dashboards/MentorDashboard";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./routes/protectedRoute";
import MainLayout from "./layouts/mainLayout";
import Register from "./pages/Register/Register";
import LandingPage from "./pages/Landing/LandingPage";
import { UserRole } from "./enums/userDetailEnums";
import BookingListMentor from "./pages/MentorBooking/Mentor/BookingListMentor";
import { CreateTimeSlot } from "./pages/MentorBooking/Mentor/CreateTimeSlot";
import { MyMentorSlotList } from "./pages/MentorBooking/Mentor/MyMentorSlotList";
import { EditTimeSlot } from "./pages/MentorBooking/Mentor/EditTimeSlot";
import { UpdateBooking } from "./pages/MentorBooking/Mentor/UpdateBooking";
import SearchForMentor from "./pages/MentorBooking/Member/SearchForMentor";
import MentorSlotList from "./pages/MentorBooking/Member/MentorSlotList";
import CreateBooking from "./pages/MentorBooking/Member/CreateBooking";
import Unauthorized from "./pages/Unauthorized/Unauthorizred";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import MyBookings from "./pages/MentorBooking/Member/MyBookings";
import ProfileUpdate from "./pages/UserAccount/ProfileUpdate";
import NewsFeed from "./pages/CommunityForum/NewsFeed";
import ForumTypes from "./pages/CommunityForum/Master/ForumTypes";
import ForumTags from "./pages/CommunityForum/Master/ForumTags";
import PendingMentorApprovals from "./pages/Admin/PendingMentorApprovals";
import CreateNewThread from "./pages/CommunityForum/CreateNewThread";
import MyThreads from "./pages/CommunityForum/MyThreads";
import ThreadDetails from "./pages/CommunityForum/ThreadDetails";
import GeneratePlan from "./pages/Plans/GeneratePlan";
import ViewGeneratedPlan from "./pages/Plans/ViewGeneratedPlan";
import MyPlans from "./pages/Plans/MyPlans";
import ViewAcceptedPlan from "./pages/Plans/ViewAcceptedPlan";
import DailyProgressTracker from "./pages/Plans/DailyProgressTracker";
import ProgressHistory from "./pages/Plans/ProgressHistory";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes for all users */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[UserRole.ADMIN, UserRole.MEMBER, UserRole.MENTOR]}
            />
          }
        >
          <Route element={<MainLayout />}>
            <Route path="/account" element={<ProfileUpdate />} />
            <Route path="community-forum" element={<NewsFeed />} />
            <Route path="/community-forum" element={<NewsFeed />} />
            <Route path="/community-forum/create-thread" element={<CreateNewThread />} />
            <Route path="/community-forum/my-threads" element={<MyThreads />} />
            <Route path="/community-forum/thread/:threadId" element={<ThreadDetails />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
          <Route element={<MainLayout />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/pending-mentor-approvals" element={<PendingMentorApprovals />} />
            <Route path="/admin/manage-forum-types" element={<ForumTypes />} />
            <Route path="/admin/manage-forum-tags" element={<ForumTags />} />
          </Route>
        </Route>

        {/* Member Routes */}
        <Route element={<ProtectedRoute allowedRoles={[UserRole.MEMBER]} />}>
          <Route element={<MainLayout />}>
            <Route path="/member-dashboard" element={<MemberDashboard />} />
            <Route
              path="/member/search-for-mentor"
              element={<SearchForMentor />}
            />
            <Route
              path="/member/mentor-slots/:mentor_id"
              element={<MentorSlotList />}
            />
            <Route
              path="/member/create-booking/:mentor_id/:slotId"
              element={<CreateBooking />}
            />
            <Route path="/member/my-bookings" element={<MyBookings />} />
            <Route path="/member/my-plans" element={<MyPlans />} />
            <Route path="/member/generate-plan" element={<GeneratePlan />} />
            <Route path="/member/plans/generated/:planId" element={<ViewGeneratedPlan />} />
            <Route path="/member/plans/accepted/:planId" element={<ViewAcceptedPlan />} />
            <Route path="/member/plans/:planId/track-progress" element={<DailyProgressTracker />} />
            <Route path="/member/plans/:planId/progress-history" element={<ProgressHistory />} />
          </Route>
        </Route>

        {/* Mentor Routes */}
        <Route element={<ProtectedRoute allowedRoles={[UserRole.MENTOR]} />}>
          <Route element={<MainLayout />}>
            <Route path="/mentor-dashboard" element={<MentorDashboard />} />
            <Route path="/mentor/my-bookings" element={<BookingListMentor />} />
            <Route path="/mentor/create-slot" element={<CreateTimeSlot />} />
            <Route path="/mentor/my-slots" element={<MyMentorSlotList />} />
            <Route
              path="/mentor/time-slots/edit/:slotId"
              element={<EditTimeSlot />}
            />
            <Route
              path="/mentor/bookings/update/:booking_id"
              element={<UpdateBooking />}
            />
          </Route>
        </Route>

        <Route path="*" element={<PageNotFound />} />
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
