// import React, { useState, useEffect } from "react";
// import {
//     Home,
//     LogOut,
//     X,
//     Activity,
//     Mountain,
//     Map,
//     Menu,
//     ChevronDown,
//     ChevronRight,
//     Logs,
//     User,
//     Folder,
//     FolderTree,
//     LayoutDashboard,
// } from "lucide-react";
// import { Link, usePage } from "@inertiajs/react";
// import axios from "axios";

// const AdminSideBar = ({
//     isMobileOpen,
//     onMobileToggle,
//     collapsed,
//     setCollapsed,
// }) => {
//     const user = usePage().props.auth.user;
//     const [toursOpen, setToursOpen] = useState(false);
//     const [trekkingOpen, setTrekkingOpen] = useState(false);
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

//     // Function to get initials from name
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

//     // Deterministic color class for initials based on name's first character
//     const getColorClass = (name) => {
//         if (!name) return colors[Math.floor(Math.random() * colors.length)];
//         return colors[name.charCodeAt(0) % colors.length];
//     };

//     const handleLogout = () => {
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

//     const isActive = (path) => {
//         return window.location.pathname === path
//             ? "bg-gray-400 text-white"
//             : "hover:bg-gray-200";
//     };

//     const toggleCollapse = () => {
//         setCollapsed(!collapsed);
//     };

//     useEffect(() => {
//         if (collapsed) {
//             setToursOpen(false);
//             setTrekkingOpen(false);
//         }
//     }, [collapsed]);

//     return (
//         <div>
//             {isMobileOpen && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//                     onClick={onMobileToggle}
//                 />
//             )}

//             <div
//                 className={`
//                     fixed top-0 left-0 h-screen bg-slate-50 text-slate-800 flex flex-col shadow-xl transform transition-all duration-300 ease-in-out z-50
//                     ${collapsed ? "w-[5%]" : "w-[85%] md:w-[30%] lg:w-[18%]"}
//                     ${
//                         isMobileOpen
//                             ? "translate-x-0"
//                             : "-translate-x-full lg:translate-x-0"
//                     }
//                 `}
//             >
//                 <div className="flex h-20 items-center justify-between p-1 border-b border-gray-200 relative">
//                     {!collapsed && (
//                         <div className="flex items-center gap-2 flex-1 pr-10">
//                             <img
//                                 src="/images/logo.png"
//                                 alt="logo"
//                                 className="w-28 object-cover"
//                             />
//                         </div>
//                     )}

//                     <button
//                         onClick={onMobileToggle}
//                         className="lg:hidden p-1 rounded-md hover:bg-gray-200 transition-colors"
//                         aria-label="Close sidebar"
//                     >
//                         <X className="w-5 h-5" />
//                     </button>

//                     <button
//                         onClick={toggleCollapse}
//                         className="hidden lg:block absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-gray-200 transition-colors"
//                         aria-label={
//                             collapsed ? "Expand sidebar" : "Collapse sidebar"
//                         }
//                     >
//                         <Menu className="w-5 h-5" />
//                     </button>
//                 </div>

//                 <nav className="flex-1 px-2 md:px-4 flex flex-col gap-2 mt-4 overflow-y-auto">
//                     <Link
//                         href="/dashboard"
//                         className={`flex items-center gap-3 px-3 py-2 md:px-3 md:py-3 rounded-xl transition-all w-full text-sm md:text-base ${isActive(
//                             "/dashboard"
//                         )}`}
//                         onClick={() =>
//                             window.innerWidth < 1024 && onMobileToggle()
//                         }
//                         title="Dashboard"
//                     >
//                         <LayoutDashboard
//                             size={18}
//                             className="md:w-5 md:h-5 flex-shrink-0"
//                         />
//                         {!collapsed && (
//                             <span className="font-medium">Dashboard</span>
//                         )}
//                     </Link>

//                     {/*Category*/}
//                     <Link
//                         href="/category"
//                         className={`flex items-center gap-3 px-3 py-2 md:px-3 md:py-3 rounded-xl transition-all w-full text-sm md:text-base ${isActive(
//                             "/category"
//                         )}`}
//                         onClick={() =>
//                             window.innerWidth < 1024 && onMobileToggle()
//                         }
//                         title="Category"
//                     >
//                         <Folder
//                             size={18}
//                             className="md:w-5 md:h-5 flex-shrink-0"
//                         />
//                         {!collapsed && (
//                             <span className="font-medium">Category</span>
//                         )}
//                     </Link>

//                     {/*Sub Category */}
//                     <Link
//                         href="/sub_category"
//                         className={`flex items-center gap-3 px-3 py-2 md:px-3 md:py-3 rounded-xl transition-all w-full text-sm md:text-base ${isActive(
//                             "/sub_category"
//                         )}`}
//                         onClick={() =>
//                             window.innerWidth < 1024 && onMobileToggle()
//                         }
//                         title="Sub Category "
//                     >
//                         <FolderTree
//                             size={18}
//                             className="md:w-5 md:h-5 flex-shrink-0"
//                         />
//                         {!collapsed && (
//                             <span className="font-medium">Sub Category</span>
//                         )}
//                     </Link>

//                     {/*tour */}
//                     <Link
//                         href="/tour"
//                         className={`flex items-center gap-3 px-3 py-2 md:px-3 md:py-3 rounded-xl transition-all w-full text-sm md:text-base ${isActive(
//                             "/tour"
//                         )}`}
//                         onClick={() =>
//                             window.innerWidth < 1024 && onMobileToggle()
//                         }
//                         title="Tour"
//                     >
//                         <Map
//                             size={18}
//                             className="md:w-5 md:h-5 flex-shrink-0"
//                         />
//                         {!collapsed && (
//                             <span className="font-medium">Tour</span>
//                         )}
//                     </Link>

//                     {/* Tours with dropdown */}
//                     {/* <div className="flex flex-col">
//                         <button
//                             onClick={() => setToursOpen(!toursOpen)}
//                             className={`flex items-center justify-between gap-3 px-3 py-2 md:px-3 md:py-3 rounded-xl transition-all w-full text-sm md:text-base ${isActive(
//                                 "/tour"
//                             )}`}
//                             title="Tour"
//                         >
//                             <div className="flex items-center gap-3">
//                                 <Map
//                                     size={18}
//                                     className="md:w-5 md:h-5 flex-shrink-0"
//                                 />
//                                 {!collapsed && (
//                                     <span className="font-medium">Tour</span>
//                                 )}
//                             </div>
//                             {!collapsed &&
//                                 (toursOpen ? (
//                                     <ChevronDown size={16} />
//                                 ) : (
//                                     <ChevronRight size={16} />
//                                 ))}
//                         </button>

//                         {toursOpen && !collapsed && (
//                             <div className="ml-8 mt-1 flex flex-col gap-2 border-l-2 border-gray-300 pl-3">
//                                 <Link
//                                     href="/tour/all"
//                                     className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm ${isActive(
//                                         "/tour/all"
//                                     )}`}
//                                     onClick={() =>
//                                         window.innerWidth < 1024 &&
//                                         onMobileToggle()
//                                     }
//                                     title="All Tours"
//                                 >
//                                     <span className="font-medium">
//                                         All Tours
//                                     </span>
//                                 </Link>
//                                 <Link
//                                     href="/tour/categories"
//                                     className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm ${isActive(
//                                         "/tour/categories"
//                                     )}`}
//                                     onClick={() =>
//                                         window.innerWidth < 1024 &&
//                                         onMobileToggle()
//                                     }
//                                     title="Tour Categories"
//                                 >
//                                     <span className="font-medium">
//                                         Categories
//                                     </span>
//                                 </Link>
//                                 <Link
//                                     href="/tour/sub_category"
//                                     className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm ${isActive(
//                                         "/tour/create"
//                                     )}`}
//                                     onClick={() =>
//                                         window.innerWidth < 1024 &&
//                                         onMobileToggle()
//                                     }
//                                     title="Create Tour"
//                                 >
//                                     <span className="font-medium">
//                                         Sub Category
//                                     </span>
//                                 </Link>
//                             </div>
//                         )}
//                     </div> */}

//                     {/* Trekking with dropdown */}
//                     {/* <div className="flex flex-col">
//                         <button
//                             onClick={() => setTrekkingOpen(!trekkingOpen)}
//                             className={`flex items-center justify-between gap-3 px-3 py-2 md:px-3 md:py-3 rounded-xl transition-all w-full text-sm md:text-base ${isActive(
//                                 "/trekking"
//                             )}`}
//                             title="Trekking"
//                         >
//                             <div className="flex items-center gap-3">
//                                 <Mountain
//                                     size={18}
//                                     className="md:w-5 md:h-5 flex-shrink-0"
//                                 />
//                                 {!collapsed && (
//                                     <span className="font-medium">Trekking</span>
//                                 )}
//                             </div>
//                             {!collapsed && (
//                                 trekkingOpen ?
//                                     <ChevronDown size={16} /> :
//                                     <ChevronRight size={16} />
//                             )}
//                         </button>

//                         {trekkingOpen && !collapsed && (
//                             <div className="ml-8 mt-1 flex flex-col gap-2 border-l-2 border-gray-300 pl-3">
//                                 <Link
//                                     href="/trekking/all"
//                                     className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm ${isActive(
//                                         "/trekking/all"
//                                     )}`}
//                                     onClick={() =>
//                                         window.innerWidth < 1024 && onMobileToggle()
//                                     }
//                                     title="All Trekking"
//                                 >
//                                     <span className="font-medium">All Trekking</span>
//                                 </Link>
//                                 <Link
//                                     href="/trekking/categories"
//                                     className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm ${isActive(
//                                         "/trekking/categories"
//                                     )}`}
//                                     onClick={() =>
//                                         window.innerWidth < 1024 && onMobileToggle()
//                                     }
//                                     title="Trekking Categories"
//                                 >
//                                     <span className="font-medium">Categories</span>
//                                 </Link>
//                                 <Link
//                                     href="/trekking/sub_category"
//                                     className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm ${isActive(
//                                         "/trekking/create"
//                                     )}`}
//                                     onClick={() =>
//                                         window.innerWidth < 1024 && onMobileToggle()
//                                     }
//                                     title="Create Trekking"
//                                 >
//                                     <span className="font-medium">Sub Category</span>
//                                 </Link>
//                             </div>
//                         )}
//                     </div> */}

//                     <Link
//                         href="/trekking"
//                         className={`flex items-center gap-3 px-3 py-2 md:px-3 md:py-3 rounded-xl transition-all w-full text-sm md:text-base ${isActive(
//                             "/trekking"
//                         )}`}
//                         onClick={() =>
//                             window.innerWidth < 1024 && onMobileToggle()
//                         }
//                         title="Trekking"
//                     >
//                         <Mountain
//                             size={18}
//                             className="md:w-5 md:h-5 flex-shrink-0"
//                         />
//                         {!collapsed && (
//                             <span className="font-medium">Trekking</span>
//                         )}
//                     </Link>

//                     <Link
//                         href="/hiking"
//                         className={`flex items-center gap-3 px-3 py-2 md:px-3 md:py-3 rounded-xl transition-all w-full text-sm md:text-base ${isActive(
//                             "/hiking"
//                         )}`}
//                         onClick={() =>
//                             window.innerWidth < 1024 && onMobileToggle()
//                         }
//                         title="Hiking"
//                     >
//                         <Activity
//                             size={18}
//                             className="md:w-5 md:h-5 flex-shrink-0"
//                         />
//                         {!collapsed && (
//                             <span className="font-medium">Hiking</span>
//                         )}
//                     </Link>

//                     {/* Logs */}

//                     <Link
//                         href="/log"
//                         className={`flex items-center gap-3 px-3 py-2 md:px-3 md:py-3 rounded-xl transition-all w-full text-sm md:text-base ${isActive(
//                             "/log"
//                         )}`}
//                         onClick={() =>
//                             window.innerWidth < 1024 && onMobileToggle()
//                         }
//                         title="Logs"
//                     >
//                         <Logs
//                             size={18}
//                             className="md:w-5 md:h-5 flex-shrink-0"
//                         />
//                         {!collapsed && (
//                             <span className="font-medium">Logs</span>
//                         )}
//                     </Link>

//                     {/*User */}
//                     <Link
//                         href="/user"
//                         className={`flex items-center gap-3 px-3 py-2 md:px-3 md:py-3 rounded-xl transition-all w-full text-sm md:text-base ${isActive(
//                             "/user"
//                         )}`}
//                         onClick={() =>
//                             window.innerWidth < 1024 && onMobileToggle()
//                         }
//                         title="User Management"
//                     >
//                         <User
//                             size={18}
//                             className="md:w-5 md:h-5 flex-shrink-0"
//                         />
//                         {!collapsed && (
//                             <span className="font-medium">User Management</span>
//                         )}
//                     </Link>
//                 </nav>

//                 <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50">
//                     {!collapsed ? (
//                         <>
//                             <div className="flex items-center space-x-3 mb-4 p-3 bg-white rounded-xl shadow-sm">
//                                 <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
//                                     {user?.image ? (
//                                         <img
//                                             src={`${imgurl}/${user.image}`}
//                                             alt={user.name}
//                                             className="w-full h-full object-cover"
//                                         />
//                                     ) : (
//                                         <div
//                                             className={`w-full h-full flex items-center justify-center rounded-full ${getColorClass(
//                                                 user?.name
//                                             )}`}
//                                         >
//                                             <span className="font-bold text-sm">
//                                                 {getInitials(user?.name)}
//                                             </span>
//                                         </div>
//                                     )}
//                                 </div>
//                                 <div className="flex-1 min-w-0">
//                                     <p className="text-sm font-semibold text-slate-800 truncate">
//                                         {user?.name || "Admin"}
//                                     </p>
//                                     <p className="text-xs text-slate-500 truncate">
//                                         {user?.email || "admin@example.com"}
//                                     </p>
//                                 </div>
//                                 {/* <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0" /> */}
//                             </div>

//                             <button
//                                 onClick={handleLogout}
//                                 className="flex items-center justify-center space-x-3 p-3 rounded-xl w-full
//                                          bg-gradient-to-r from-red-500 to-red-600 text-white
//                                          hover:from-red-600 hover:to-red-700 transition-all duration-200
//                                          transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
//                             >
//                                 <LogOut className="w-4 h-4 flex-shrink-0" />
//                                 <span className="font-medium text-sm">Sign Out</span>
//                             </button>
//                         </>
//                     ) : (
//                         <div className="flex flex-col items-center space-y-4">
//                             <div
//                                 className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${getColorClass(
//                                     user?.name
//                                 )}`}
//                             >
//                                 <span className="text-white text-sm font-bold">
//                                     <img
//                                             src={`${imgurl}/${user.image}`}
//                                             alt={user.name}
//                                             className="w-full h-full object-cover"
//                                         />
//                                 </span>
//                             </div>
//                             <button
//                                 onClick={handleLogout}
//                                 className="flex items-center justify-center p-3 rounded-xl w-full
//                                          bg-gradient-to-r from-red-500 to-red-600 text-white
//                                          hover:from-red-600 hover:to-red-700 transition-all duration-200
//                                          transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
//                                 title="Sign Out"
//                             >
//                                 <LogOut className="w-4 h-4" />
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminSideBar;

import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    X,
    Menu,
    LayoutDashboard,
    Images,
    Calendar,
    Handshake,
    UserCog,
    Activity,
    Folder,
    FolderTree,
    Map,
    Mountain,
    Footprints,
    ClipboardList,
} from "lucide-react";

const AdminSideBar = ({
    isMobileOpen,
    onMobileToggle,
    isCollapsed,
    onToggleCollapse,
}) => {
    const { url } = usePage();
    const currentPath = url.split("/")[1];
    const [openDropdown, setOpenDropdown] = useState(null);

    const isActive = (href) => {
        const path = href.replace("/", "");
        return currentPath === path;
    };

    const isPageActive = () => {
        return [
            "our-teams",
            "gallery",
            "events",
            "partners",
            "inscriptions",
        ].includes(currentPath);
    };

    const isUsersActive = () => {
        return [
            "users",
            "user-management",
            "activity-log",
            "activities",
        ].includes(currentPath);
    };

    const toggleDropdown = (dropdownName) => {
        if (openDropdown === dropdownName) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(dropdownName);
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onMobileToggle}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                    fixed left-0 top-0 h-screen border-r z-50 transition-all duration-300
                    bg-white border-gray-200
                    ${isCollapsed ? "w-16" : "w-64"}
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                {/* Header */}
                <div
                    className={`flex items-center justify-between p-4 border-b h-16 ${isCollapsed ? "px-3" : ""}`}
                >
                    {/* {!isCollapsed && (
                        <div className="text-xl font-bold text-gray-800 whitespace-nowrap">
                            Nepal Inscription
                        </div>
                    )} */}

                    {!isCollapsed && (
                        <div className="flex items-center gap-2 flex-1 pr-10">
                            <img
                                src="/images/logo.png"
                                alt="logo"
                                className="w-28 object-cover"
                            />
                        </div>
                    )}

                    <div className="flex items-center space-x-1">
                        {/* Desktop Collapse Toggle */}
                        <button
                            onClick={onToggleCollapse}
                            className="hidden lg:flex p-1.5 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title={
                                isCollapsed
                                    ? "Expand sidebar"
                                    : "Collapse sidebar"
                            }
                        >
                            <Menu className="w-4 h-4 text-gray-600" />
                        </button>

                        {/* Mobile Close Button */}
                        <button
                            onClick={onMobileToggle}
                            className="lg:hidden p-1.5 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        >
                            <X className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Menu Items */}
                <div
                    className={`p-2 space-y-1 overflow-y-auto h-[calc(100vh-4rem)] ${isCollapsed ? "px-2" : "px-3"}`}
                >
                    {/* Dashboard Link */}
                    <Link
                        href="/dashboard"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${isActive("/dashboard") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                        `}
                        title={isCollapsed ? "Dashboard" : ""}
                    >
                        <LayoutDashboard
                            className={`w-5 h-5 ${isActive("/") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
                        />

                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Dashboard
                            </span>
                        )}

                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Dashboard
                            </div>
                        )}
                    </Link>

                    {/* Category Link */}
                    <Link
                        href="/category"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${isActive("/category") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                        `}
                        title={isCollapsed ? "Category" : ""}
                    >
                        <Folder
                            className={`w-5 h-5 ${isActive("/category") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
                        />

                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Category
                            </span>
                        )}

                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Category
                            </div>
                        )}
                    </Link>

                    {/* Sub Category Link */}
                    <Link
                        href="/sub-category"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${isActive("/sub-category") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                        `}
                        title={isCollapsed ? "Sub Category" : ""}
                    >
                        <FolderTree
                            className={`w-5 h-5 ${isActive("/sub-category") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
                        />

                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Sub Category
                            </span>
                        )}

                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Sub Category
                            </div>
                        )}
                    </Link>

                    {/* Tour Link */}
                    <Link
                        href="/tour"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${isActive("/tour") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                        `}
                        title={isCollapsed ? "Tour" : ""}
                    >
                        <Map
                            className={`w-5 h-5 ${isActive("/tour") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
                        />

                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Tours
                            </span>
                        )}

                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Tours
                            </div>
                        )}
                    </Link>

                    {/* Trekking Link */}
                    <Link
                        href="/trekking"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${isActive("/trekking") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                        `}
                        title={isCollapsed ? "Trekking" : ""}
                    >
                        <Mountain
                            className={`w-5 h-5 ${isActive("/trekking") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
                        />

                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Trekking
                            </span>
                        )}

                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Trekking
                            </div>
                        )}
                    </Link>

                    {/* Hiking Link */}
                    <Link
                        href="/hiking"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${isActive("/hiking") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                        `}
                        title={isCollapsed ? "Hiking" : ""}
                    >
                        <Footprints
                            className={`w-5 h-5 ${isActive("/hiking") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
                        />

                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Hiking
                            </span>
                        )}

                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Hiking
                            </div>
                        )}
                    </Link>
                    {/* Activity Logs Link */}
                    <Link
                        href="/activity-logs"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${isActive("/activity-logs") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                        `}
                        title={isCollapsed ? "Activity Logs" : ""}
                    >
                        <ClipboardList
                            className={`w-5 h-5 ${isActive("/activity-logs") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
                        />

                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Activity Logs
                            </span>
                        )}

                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Activity Logs
                            </div>
                        )}
                    </Link>

                    {/* User Management Link */}
                    <Link
                        href="/user-management"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${isActive("/user-management") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                        `}
                        title={isCollapsed ? "User Management" : ""}
                    >
                        <UserCog
                            className={`w-5 h-5 ${isActive("/user-management") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
                        />

                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                User Management
                            </span>
                        )}

                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                User Management
                            </div>
                        )}
                    </Link>
                </div>
            </div>
        </>
    );
};

export default AdminSideBar;
