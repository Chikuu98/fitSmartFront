import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import type { RootState } from "../../store/store";
import { LogOut, Moon, Settings, Sun, User, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { logout } from "../../store/authSlice";
import logoLight from "../../assets/logolight.png";
import logoDark from "../../assets/logodark.png";
import { UserRole } from "../../enums/userDetailEnums";

const Header = () => {
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  const adminNavItems = [{ title: "Dashboard", link: "/admin-dashboard" }];

  const memberNavItems = [{ title: "Dashboard", link: "/member-dashboard" }];

  const mentorNavItems = [
    { title: "Dashboard", link: "/mentor-dashboard" },
    { title: "My Bookings", link: "/mentor/my-bookings" },
  ];

  const navItems =
    role === UserRole.ADMIN
      ? adminNavItems
      : role === UserRole.MEMBER
        ? memberNavItems
        : role === UserRole.MENTOR
          ? mentorNavItems
          : [];

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-color-mode",
      isDarkMode ? "dark" : "light",
    );
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white dark:bg-black text-black dark:text-white px-4 md:px-20 py-3 flex items-center shadow-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      {/* Left - Logo */}
      <Link
        to={navItems.length > 0 ? navItems[0].link : "/"}
        className="flex items-center focus:outline-none"
      >
        <img
          src={isDarkMode ? logoDark : logoLight}
          alt="FitSmart Logo"
          className="h-9 w-auto transition-transform duration-200 hover:scale-105"
        />
      </Link>

      {/* Right - Navigation + User */}
      <div className="ml-auto flex items-center gap-x-4 md:gap-x-8 text-sm font-medium">
        {/* Navigation */}
        <nav className="flex items-center gap-x-4 md:gap-x-6">
          {navItems.map((item) => (
            <Link
              key={item.link}
              to={item.link}
              className="px-2 py-1 rounded transition-colors duration-150 hover:text-orange-600 dark:hover:text-orange-400 focus:outline-none"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center rounded-full p-1.5 transition-colors duration-150 hover:bg-orange-100 dark:hover:bg-orange-900 focus:outline-non"
            aria-label="User menu"
          >
            <UserCircle className="w-7 h-7 text-orange-500 dark:text-orange-300 transition-colors duration-150" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#18181c] border border-gray-200 dark:border-orange-900 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
              <button
                className="flex items-center w-full px-4 py-2 hover:bg-orange-100 dark:hover:bg-orange-800 text-sm transition-colors text-blue-900 dark:text-orange-200"
                onClick={() => {
                  setIsOpen(false);
                  // Account click handler
                }}
              >
                <User className="w-4 h-4 mr-2" /> Account
              </button>
              <button
                className="flex items-center w-full px-4 py-2 hover:bg-orange-100 dark:hover:bg-orange-800 text-sm transition-colors text-blue-900 dark:text-orange-200"
                onClick={() => {
                  setIsOpen(false);
                  // Settings click handler
                }}
              >
                <Settings className="w-4 h-4 mr-2" /> Settings
              </button>
              <button
                className="flex items-center w-full px-4 py-2 hover:bg-orange-100 dark:hover:bg-orange-800 text-sm transition-colors text-blue-900 dark:text-orange-200"
                onClick={() => {
                  setIsDarkMode(!isDarkMode);
                  setIsOpen(false);
                }}
                title="Toggle Theme"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-4 h-4 mr-2" /> Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 mr-2" /> Dark Mode
                  </>
                )}
              </button>
              <button
                className="flex items-center w-full px-4 py-2 hover:bg-orange-100 dark:hover:bg-orange-800 text-sm text-red-600 transition-colors"
                onClick={() => {
                  setIsOpen(false);
                  dispatch(logout());
                }}
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
