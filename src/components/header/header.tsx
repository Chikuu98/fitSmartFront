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

  const mentorNavItems = [{ title: "Dashboard", link: "/mentor-dashboard" }];

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
    <header className="bg-white dark:bg-black text-black dark:text-white px-20 py-3 flex items-center shadow-md border-b border-gray-300 dark:border-gray-800">
      {/* Left - Logo */}
      <Link to={navItems.length > 0 ? navItems[0].link : "/"}>
        <img
          src={isDarkMode ? logoDark : logoLight}
          alt="FitSmart Logo"
          className="h-9"
        />
      </Link>

      {/* Right - Navigation + User */}
      <div className="ml-auto flex items-center gap-x-8 text-sm font-medium">
        {/* Navigation */}
        <nav className="flex items-center gap-x-6">
          {navItems.map((item) => (
            <Link
              key={item.link}
              to={item.link}
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none hover:text-blue-600 dark:hover:text-blue-400"
          >
            <UserCircle />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
              <button
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                onClick={() => {
                  setIsOpen(false);
                  console.log("Account clicked");
                }}
              >
                <User className="w-4 h-4 mr-2" /> Account
              </button>
              <button
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                onClick={() => {
                  setIsOpen(false);
                  console.log("Settings clicked");
                }}
              >
                <Settings className="w-4 h-4 mr-2" /> Settings
              </button>
              <button
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
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
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700 text-sm text-red-600"
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
