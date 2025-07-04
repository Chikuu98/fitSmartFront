import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import type { RootState } from "../../store/store";
import {
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
  UserCircle,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileSections, setExpandedMobileSections] = useState<
    Set<string>
  >(new Set());
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const triggerRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const userDropdownRef = useRef<HTMLDivElement | null>(null);
  const userTriggerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const toggleMobileSection = (sectionTitle: string) => {
    setExpandedMobileSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionTitle)) {
        newSet.delete(sectionTitle);
      } else {
        newSet.add(sectionTitle);
      }
      return newSet;
    });
  };

  const isMobileSectionExpanded = (sectionTitle: string) => {
    return expandedMobileSections.has(sectionTitle);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setExpandedMobileSections(new Set());
  };

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
      let clickedMobileMenu = false;
      if (
        mobileMenuRef.current?.contains(event.target as Node) ||
        mobileMenuButtonRef.current?.contains(event.target as Node)
      ) {
        clickedMobileMenu = true;
      }
      if (!clickedDropdown) setOpenDropdown(null);
      if (!clickedUserDropdown) setIsUserOpen(false);
      if (!clickedMobileMenu) closeMobileMenu();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  return (
    <>
      <header className="bg-white dark:bg-black text-black dark:text-white px-4 md:px-20 py-3 flex items-center border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        {/* Logo */}
        <Link
          to={navItems.length > 0 && navItems[0].link ? navItems[0].link : "/"}
          className="flex items-center focus:outline-none"
        >
          <img
            src={isDarkMode ? logoDark : logoLight}
            alt="FitSmart Logo"
            className="h-8 md:h-9 w-auto transition-transform duration-200 hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="ml-auto hidden md:flex items-center gap-x-6 lg:gap-x-8 text-sm font-medium">
          <nav className="flex items-center gap-x-4 lg:gap-x-6">
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
                    className="px-2 py-1 rounded transition-colors duration-150 hover:text-orange-600 dark:hover:text-orange-300 focus:outline-none flex items-center gap-1"
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
                  className="px-2 py-1 rounded transition-colors duration-150 hover:text-orange-600 dark:hover:text-orange-300 focus:outline-none"
                >
                  {item.title}
                </Link>
              ),
            )}
          </nav>

          {/* Desktop User Dropdown */}
          <div className="relative" ref={userDropdownRef}>
            <button
              ref={userTriggerRef}
              onClick={() => setIsUserOpen((prev) => !prev)}
              className="flex items-center justify-center rounded-full p-1.5 transition-colors duration-150 hover:bg-orange-100 dark:hover:bg-orange-900 focus:outline-none"
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
                    navigate("/account");
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
                  className="flex items-center w-full px-4 py-2 hover:bg-red-100 dark:hover:bg-red-800 text-sm text-red-600 dark:text-red-200 transition-colors"
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

        {/* Mobile Menu Button */}
        <div className="ml-auto flex md:hidden items-center gap-3">
          {/* Theme Toggle for Mobile */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center justify-center rounded-full p-1.5 transition-colors duration-150 hover:bg-orange-100 dark:hover:bg-orange-900 focus:outline-none"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-orange-500 dark:text-orange-300" />
            ) : (
              <Moon className="w-5 h-5 text-orange-500 dark:text-orange-300" />
            )}
          </button>

          {/* Mobile Hamburger */}
          <button
            ref={mobileMenuButtonRef}
            onClick={() => {
              if (isMobileMenuOpen) {
                closeMobileMenu();
              } else {
                setIsMobileMenuOpen(true);
              }
            }}
            className="flex items-center justify-center rounded-md p-2 transition-colors duration-150 hover:bg-orange-100 dark:hover:bg-orange-900 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-orange-500 dark:text-orange-300" />
            ) : (
              <Menu className="w-6 h-6 text-orange-500 dark:text-orange-300" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 animate-fade-in"
        >
          <nav className="px-4 py-4 space-y-2">
            {navItems.map((item) =>
              item.dropdown && item.dropdownItems ? (
                <div key={item.title} className="space-y-1">
                  {/* Expandable Section Header */}
                  <button
                    onClick={() => toggleMobileSection(item.title)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors hover:bg-orange-100 dark:hover:bg-orange-900 hover:text-orange-600 dark:hover:text-orange-300"
                  >
                    <span>{item.title}</span>
                    {isMobileSectionExpanded(item.title) ? (
                      <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                    )}
                  </button>

                  {/* Expandable Section Content */}
                  {isMobileSectionExpanded(item.title) && (
                    <div className="pl-4 space-y-1 animate-fade-in">
                      {item.dropdownItems.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.to}
                          to={dropdownItem.to}
                          className="block px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 transition-colors hover:bg-orange-100 dark:hover:bg-orange-900 hover:text-orange-600 dark:hover:text-orange-300"
                          onClick={closeMobileMenu}
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
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors hover:bg-orange-100 dark:hover:bg-orange-900 hover:text-orange-600 dark:hover:text-orange-300"
                  onClick={closeMobileMenu}
                >
                  {item.title}
                </Link>
              ),
            )}

            {/* Mobile User Menu */}
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
              <button
                className="flex items-center w-full px-3 py-2 rounded-md text-sm text-gray-900 dark:text-gray-100 transition-colors hover:bg-orange-100 dark:hover:bg-orange-900 hover:text-orange-600 dark:hover:text-orange-300"
                onClick={() => {
                  navigate("/account");
                  closeMobileMenu();
                }}
              >
                <User className="w-4 h-4 mr-3" /> Account
              </button>
              <button
                className="flex items-center w-full px-3 py-2 rounded-md text-sm text-gray-900 dark:text-gray-100 transition-colors hover:bg-orange-100 dark:hover:bg-orange-900 hover:text-orange-600 dark:hover:text-orange-300"
                onClick={() => {
                  closeMobileMenu();
                  // Settings click handler
                }}
              >
                <Settings className="w-4 h-4 mr-3" /> Settings
              </button>
              <button
                className="flex items-center w-full px-3 py-2 rounded-md text-sm text-red-600 dark:text-red-400 transition-colors hover:bg-red-100 dark:hover:bg-red-900"
                onClick={() => {
                  closeMobileMenu();
                  dispatch(logout());
                }}
              >
                <LogOut className="w-4 h-4 mr-3" /> Logout
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
