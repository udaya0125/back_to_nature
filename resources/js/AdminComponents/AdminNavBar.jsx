// import React, { useState, useRef, useEffect } from "react";
// import {
//     Search,
//     Bell,
//     User,
//     Menu,
//     X,
//     ChevronDown,
//     UserCircle,
//     Settings,
//     Shield,
//     LogOut,
// } from "lucide-react";
// import { usePage, router } from "@inertiajs/react";

// const AdminNavBar = ({ onMenuToggle }) => {
//     const [isSearchOpen, setIsSearchOpen] = useState(false);
//     const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
//     const [searchQuery, setSearchQuery] = useState("");
//     const userMenuRef = useRef(null);
//     const searchInputRef = useRef(null);
//     const user = usePage().props.auth.user;

//     const imgurl = import.meta.env.VITE_IMAGE_PATH;

//     const colors = [
//         "bg-red-100 text-red-700",
//         "bg-green-100 text-green-700",
//         "bg-blue-100 text-blue-700",
//         "bg-purple-100 text-purple-700",
//         "bg-yellow-100 text-yellow-700",
//         "bg-pink-100 text-pink-700",
//         "bg-indigo-100 text-indigo-700",
//         "bg-teal-100 text-teal-700",
//     ];

//     const getInitials = (name) => {
//         if (!name) return "?";
//         const parts = name.trim().split(" ");
//         if (parts.length >= 2) {
//             return (
//                 parts[0].charAt(0).toUpperCase() +
//                 parts[parts.length - 1].charAt(0).toUpperCase()
//             );
//         }
//         return parts[0].charAt(0).toUpperCase();
//     };

//     const getColorClass = (name) => {
//         if (!name) return colors[Math.floor(Math.random() * colors.length)];
//         return colors[name.charCodeAt(0) % colors.length];
//     };

//     const toggleSearch = () => {
//         setIsSearchOpen(!isSearchOpen);
//         if (!isSearchOpen) {
//             setTimeout(() => {
//                 searchInputRef.current?.focus();
//             }, 100);
//         } else {
//             setSearchQuery("");
//         }
//     };

//     const toggleUserMenu = () => {
//         setIsUserMenuOpen(!isUserMenuOpen);
//     };

//     const handleSearch = (e) => {
//         e.preventDefault();
//         if (searchQuery.trim()) {
//             router.get(route('admin.search'), { query: searchQuery });
//         }
//     };

//       const handleLogout = () => {
//         axios
//             .post(route("logout"))
//             .then((response) => {
//                 if (response.data.redirect) {
//                     window.location.href = response.data.redirect;
//                 } else {
//                     window.location.href = "/login";
//                 }
//             })
//             .catch((error) => {
//                 console.error("logout error:", error);
//                 console.error("Failed to logout. Please try again.");
//             });
//     };

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (
//                 userMenuRef.current &&
//                 !userMenuRef.current.contains(event.target)
//             ) {
//                 setIsUserMenuOpen(false);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);


//     return (
//         <nav className="w-full lg:w-[95%] py-2 bg-white shadow-md fixed top-0 right-0 z-30 transition-all duration-300">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-between items-center h-16">
//                     <div className="flex items-center">
//                         <button
//                             onClick={onMenuToggle}
//                             className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors mr-2"
//                             aria-label="Toggle menu"
//                         >
//                             <Menu className="w-5 h-5" />
//                         </button>
//                     </div>

//                     <div className="flex items-center justify-end">
//                         {/* User Menu */}
//                         <div className="relative" ref={userMenuRef}>
//                             <button
//                                 onClick={toggleUserMenu}
//                                 className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 aria-label="User menu"
//                                 aria-expanded={isUserMenuOpen}
//                             >
//                                 {user?.image ? (
//                                     <img
//                                         src={`${imgurl}/${user?.image}`}
//                                         alt={user.name}
//                                         className="w-8 h-8 rounded-full object-cover"
//                                     />
//                                 ) : (
//                                     <div
//                                         className={`w-8 h-8 flex items-center justify-center rounded-full ${getColorClass(
//                                             user?.name
//                                         )}`}
//                                     >
//                                         <span className="font-bold text-sm">
//                                             {getInitials(user?.name)}
//                                         </span>
//                                     </div>
//                                 )}

//                                 <span className="hidden sm:block text-sm font-medium text-gray-700">
//                                     {user.name}
//                                 </span>
//                                 <ChevronDown
//                                     className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
//                                         isUserMenuOpen ? "rotate-180" : ""
//                                     }`}
//                                 />
//                             </button>

//                             {isUserMenuOpen && (
//                                 <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
//                                     <div className="px-4 py-3 border-b border-gray-100">
//                                         <div className="flex items-center space-x-3">
//                                             {user?.image ? (
//                                                 <img
//                                                     src={`${imgurl}/${user?.image}`}
//                                                     alt={user.name}
//                                                     className="w-10 h-10 rounded-full object-cover"
//                                                 />
//                                             ) : (
//                                                 <div
//                                                     className={`w-10 h-10 flex items-center justify-center rounded-full ${getColorClass(
//                                                         user?.name
//                                                     )}`}
//                                                 >
//                                                     <span className="font-bold text-sm">
//                                                         {getInitials(user?.name)}
//                                                     </span>
//                                                 </div>
//                                             )}
//                                             <div>
//                                                 <p className="text-sm font-medium text-gray-900">
//                                                     {user.name}
//                                                 </p>
                                                
//                                                 <p className="text-xs text-gray-500">
//                                                     {user.email}
//                                                 </p>
//                                                  <p className="text-xs text-gray-600">
//                                                     {user.role}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="py-1">
//                                         <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
//                                             <UserCircle className="w-4 h-4 mr-3 text-gray-400" />
//                                             View Profile
//                                         </button>

//                                         <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
//                                             <Settings className="w-4 h-4 mr-3 text-gray-400" />
//                                             Account Settings
//                                         </button>
//                                     </div>

//                                     <div className="border-t border-gray-100 my-1" />

//                                     <div className="py-1">
//                                         <button
//                                             onClick={handleLogout}
//                                             className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
//                                         >
//                                             <LogOut className="w-4 h-4 mr-3" />
//                                             Sign Out
//                                         </button>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default AdminNavBar;


import React, { useState, useRef, useEffect } from "react";
import { Menu, UserCircle, Settings, LogOut, ChevronDown } from "lucide-react";
import { Link, usePage, router } from "@inertiajs/react";

const AdminNavBar = ({ onMenuToggle }) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const { auth } = usePage().props;
    const user = auth?.user;

    const toggleUserMenu = () => {
        setIsUserMenuOpen((prev) => !prev);
    };

    const handleLogout = async () => {
        try {
            await axios.post(route("logout"));
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout error:", error);
            window.location.href = "/login";
        }
    };

    // Close menu when clicking outside or pressing Escape key
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setIsUserMenuOpen(false);
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === "Escape") {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscapeKey);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsUserMenuOpen(false);
    }, [window.location.pathname]);

    return (
        <nav className="fixed top-0 right-0 w-full lg:w-[98%] h-16 border-b z-30 bg-white">
            <div className="h-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-full">
                    {/* Left side - Menu toggle and branding */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onMenuToggle}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-5 h-5 text-gray-700" />
                        </button>

                        {/* Optional: Add branding/logo here */}
                        <div className="hidden lg:block px-8">
                            <img src="/images/logo.png" alt="Logo" className="h-12 w-auto" />
                        </div>
                    </div>

                    {/* Right side - User menu */}
                    <div className="flex items-center space-x-4">
                        {/* Optional: Add notifications or other icons here */}

                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={toggleUserMenu}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                aria-expanded={isUserMenuOpen}
                                aria-haspopup="true"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-gray-200">
                                        {user?.image ? (
                                            <img
                                                src={user.image}
                                                alt={`${
                                                    user?.name || "User"
                                                } profile`}
                                                className="w-full h-full rounded-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display =
                                                        "none";
                                                }}
                                            />
                                        ) : (
                                            <UserCircle className="w-6 h-6 text-gray-600" />
                                        )}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <span className="text-sm font-medium text-gray-700 block">
                                            {user?.name || "Guest"}
                                        </span>
                                    </div>
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                                        isUserMenuOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {/* User dropdown menu */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-40">
                                    {/* User info section */}
                                    <div className="px-4 py-3 border-b border-gray-200">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {user?.name || "Guest"}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate mt-1">
                                            {user?.email || ""}
                                        </p>
                                    </div>

                                    {/* Logout section */}
                                    <div className="border-t border-gray-200 pt-1">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-150 focus:outline-none"
                                        >
                                            <LogOut className="w-4 h-4 mr-3" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavBar;