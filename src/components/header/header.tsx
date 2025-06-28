import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import type { RootState } from "../../store/store";
import { LogOut, Moon, Settings, Sun, User, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { logout } from "../../store/authSlice";
import logoLight from "../../assets/logolight.png";
import logoDark from "../../assets/logodark.png";
import { UserRole } from "../../enums/userDetailEnums";

interface NavDropdownItem {
  label: string;
  to: string;
}

interface NavItem {
  title: string;
  link?: string;
  dropdown?: boolean;
  dropdownItems?: NavDropdownItem[];
}

const Header = () => {
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const triggerRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const userDropdownRef = useRef<HTMLDivElement | null>(null);
  const userTriggerRef = useRef<HTMLButtonElement | null>(null);
  const dispatch = useDispatch();

  const adminNavItems: NavItem[] = [
    { title: "Dashboard", link: "/admin-dashboard" },
  ];

  const memberNavItems: NavItem[] = [
    { title: "Dashboard", link: "/member-dashboard" },
        {
      title: "Mentor Booking",
      dropdown: true,
      dropdownItems: [
        { label: "Search Mentors", to: "/member/search-for-mentor" },
        { label: "My Bookings", to: "/member/my-bookings" },
      ],
    },
  ];

  const mentorNavItems: NavItem[] = [
    { title: "Dashboard", link: "/mentor-dashboard" },
    {
      title: "My Bookings",
      dropdown: true,
      dropdownItems: [{ label: "My Booking List", to: "/mentor/my-bookings" }],
    },
    {
      title: "Mentor Slots",
      dropdown: true,
      dropdownItems: [
        { label: "Create Slot", to: "/mentor/create-slot" },
        { label: "Available Slots", to: "/mentor/my-slots" },
      ],
    },
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
      let clickedDropdown = false;
      if (openDropdown && dropdownRefs.current[openDropdown]) {
        if (
          dropdownRefs.current[openDropdown]?.contains(event.target as Node) ||
          triggerRefs.current[openDropdown]?.contains(event.target as Node)
        ) {
          clickedDropdown = true;
        }
      }
      let clickedUserDropdown = false;
      if (
        userDropdownRef.current?.contains(event.target as Node) ||
        userTriggerRef.current?.contains(event.target as Node)
      ) {
        clickedUserDropdown = true;
      }
      if (!clickedDropdown) setOpenDropdown(null);
      if (!clickedUserDropdown) setIsUserOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  return (
    <header className="bg-white dark:bg-black text-black dark:text-white px-4 md:px-20 py-3 flex items-center border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      {/* Left - Logo */}
      <Link
        to={navItems.length > 0 && navItems[0].link ? navItems[0].link : "/"}
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
          {navItems.map((item) =>
            item.dropdown && item.dropdownItems ? (
              <div key={item.title} className="relative">
                <button
                  ref={(el) => {
                    triggerRefs.current[item.title] = el;
                  }}
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === item.title ? null : item.title,
                    )
                  }
                  className="px-2 py-1 rounded transition-colors duration-150 hover:text-orange-600 dark:hover:text-orange-400 focus:outline-none flex items-center gap-1"
                >
                  {item.title}
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openDropdown === item.title && (
                  <div
                    ref={(el) => {
                      dropdownRefs.current[item.title] = el;
                    }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#18181c] border border-gray-200 dark:border-orange-900 rounded shadow-xl z-50 overflow-hidden animate-fade-in"
                  >
                    {item.dropdownItems.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.to}
                        to={dropdownItem.to}
                        className="flex items-center w-full px-4 py-2 hover:bg-orange-100 dark:hover:bg-orange-800 text-sm transition-colors text-blue-900 dark:text-orange-200"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {dropdownItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.link}
                to={item.link || "/"}
                className="px-2 py-1 rounded transition-colors duration-150 hover:text-orange-600 dark:hover:text-orange-400 focus:outline-none"
              >
                {item.title}
              </Link>
            ),
          )}
        </nav>

        {/* User Dropdown */}
        <div className="relative" ref={userDropdownRef}>
          <button
            ref={userTriggerRef}
            onClick={() => setIsUserOpen((prev) => !prev)}
            className="flex items-center justify-center rounded-full p-1.5 transition-colors duration-150 hover:bg-orange-100 dark:hover:bg-orange-900 focus:outline-nono"
            aria-label="User menu"
          >
            <UserCircle className="w-7 h-7 text-orange-500 dark:text-orange-300 transition-colors duration-150" />
          </button>

          {isUserOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#18181c] border border-gray-200 dark:border-orange-900 rounded shadow-xl z-50 overflow-hidden animate-fade-in">
              <button
                className="flex items-center w-full px-4 py-2 hover:bg-orange-100 dark:hover:bg-orange-800 text-sm transition-colors text-blue-900 dark:text-orange-200"
                onClick={() => {
                  setIsUserOpen(false);
                  // Account click handler
                }}
              >
                <User className="w-4 h-4 mr-2" /> Account
              </button>
              <button
                className="flex items-center w-full px-4 py-2 hover:bg-orange-100 dark:hover:bg-orange-800 text-sm transition-colors text-blue-900 dark:text-orange-200"
                onClick={() => {
                  setIsUserOpen(false);
                  // Settings click handler
                }}
              >
                <Settings className="w-4 h-4 mr-2" /> Settings
              </button>
              <button
                className="flex items-center w-full px-4 py-2 hover:bg-orange-100 dark:hover:bg-orange-800 text-sm transition-colors text-blue-900 dark:text-orange-200"
                onClick={() => {
                  setIsDarkMode(!isDarkMode);
                  setIsUserOpen(false);
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
                  setIsUserOpen(false);
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
