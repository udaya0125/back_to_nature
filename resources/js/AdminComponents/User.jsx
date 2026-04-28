// UserManagement.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
    Plus,
    ChevronUp,
    ChevronDown,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useTable, useSortBy, usePagination } from "react-table";
import AdminWrapper from "@/AdminComponents/AdminWrapper";
import axios from "axios";
import AddUserForm from "@/AddComponents/AddUserForm";
import { usePage } from "@inertiajs/react";

const UserManagement = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const imgurl = import.meta.env.VITE_IMAGE_PATH;
    
    // Get the authenticated user from Inertia page props
    const { auth } = usePage().props;
    const user = auth.user;
    
    // Check user role for permissions
    const isAdmin = user?.role === "admin" || user?.role === "administrator";
    const isEditor = user?.role === "editor";

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ouruser.index"));
                setAllUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
                setAllUsers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!isAdmin) return; // Only admins can delete
        
        if (!window.confirm(" Are you sure you want to delete this team member? Deleting user means they won't be able to log in.")) return;
        try {
            await axios.delete(route("ourtrekking.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting user. Please try again.");
        }
    };

    const handleEdit = (user) => {
        if (!isAdmin) return; // Only admins can edit
        setEditingUser(user);
        setShowForm(true);
    };

    const handleAdd = () => {
        if (!isAdmin) return; // Only admins can add
        setEditingUser(null);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingUser(null);
    };

    const handleUserAdded = () => {
        setReloadTrigger((prev) => !prev);
    };

    const handleUserUpdated = () => {
        setReloadTrigger((prev) => !prev);
    };

    const columns = useMemo(
        () => [
            {
                Header: "ID",
                accessor: (row, i) => i + 1,
                id: "rowIndex",
                width: 60,
            },
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Image",
                accessor: "image",
                Cell: ({ row }) => {
                    const { image, name } = row.original;
                    // Get initials
                    let initials = "?";
                    if (name) {
                        const parts = name.trim().split(" ");
                        if (parts.length >= 2) {
                            initials =
                                parts[0].charAt(0).toUpperCase() +
                                parts[parts.length - 1].charAt(0).toUpperCase();
                        } else {
                            initials = parts[0].charAt(0).toUpperCase();
                        }
                    }
                    // Tailwind color palette
                    const colors = [
                        "bg-red-100 text-red-700",
                        "bg-green-100 text-green-700",
                        "bg-blue-100 text-blue-700",
                        "bg-purple-100 text-purple-700",
                        "bg-yellow-100 text-yellow-700",
                        "bg-pink-100 text-pink-700",
                        "bg-indigo-100 text-indigo-700",
                        "bg-teal-100 text-teal-700",
                    ];
                    // Deterministic color based on first char
                    const colorClass =
                        colors[
                            name
                                ? name.charCodeAt(0) % colors.length
                                : Math.floor(Math.random() * colors.length)
                        ];
                    return (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                            {image ? (
                                <img
                                    src={`${imgurl}/${image}`}
                                    alt="User"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span
                                    className={`font-bold text-sm flex items-center justify-center w-full h-full rounded-full ${colorClass}`}
                                >
                                    {initials}
                                </span>
                            )}
                        </div>
                    );
                },
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Role",
                accessor: "role",
                Cell: ({ value }) => (
                    <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            value === "admin"
                                ? "bg-red-100 text-red-800"
                                : value === "moderator"
                                ? "bg-orange-100 text-orange-800"
                                : value === "editor"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                        }`}
                    >
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                ),
            },
            // Only show actions column for admins
            ...(isAdmin ? [{
                Header: "Actions",
                accessor: "actions",
                disableSortBy: true,
                Cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Edit"
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ),
            }] : [])
        ],
        [isAdmin] // Add isAdmin as dependency
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data: allUsers,
            initialState: { pageIndex: 0, pageSize: 5 },
        },
        useSortBy,
        usePagination
    );

    return (
        <AdminWrapper>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-wrap items-center justify-between mb-6 md:mb-8">
                    <div className="flex items-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            User Management
                        </h1>
                        {/* Display current user role */}
                        <span className="ml-4 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            Logged in as: {user?.role || "Unknown"}
                        </span>
                    </div>
                    {/* Only show Add button for admins */}
                    {isAdmin && (
                        <button
                            onClick={handleAdd}
                            className="mt-2 md:mt-0 py-2 md:py-3 px-4 md:px-6 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center gap-2 text-sm md:text-base"
                        >
                            <Plus size={18} className="hidden md:block" />
                            <span>Add User</span>
                        </button>
                    )}
                </div>

                {showForm && isAdmin && (
                    <AddUserForm
                        showForm={showForm}
                        setShowForm={setShowForm}
                        editingUser={editingUser}
                        onClose={handleFormClose}
                        onUserAdded={handleUserAdded}
                        onUserUpdated={handleUserUpdated}
                    />
                )}

                {loading ? (
                    <div className="text-center py-8">Loading users...</div>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-lg shadow">
                            <table
                                {...getTableProps()}
                                className="min-w-full divide-y divide-gray-200"
                            >
                                <thead className="bg-gray-50">
                                    {headerGroups.map((headerGroup) => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map((column) => (
                                                <th
                                                    {...column.getHeaderProps(
                                                        column.getSortByToggleProps()
                                                    )}
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    <div className="flex items-center">
                                                        {column.render("Header")}
                                                        {column.isSorted ? (
                                                            column.isSortedDesc ? (
                                                                <ChevronDown
                                                                    size={16}
                                                                    className="ml-1"
                                                                />
                                                            ) : (
                                                                <ChevronUp
                                                                    size={16}
                                                                    className="ml-1"
                                                                />
                                                            )
                                                        ) : null}
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody
                                    {...getTableBodyProps()}
                                    className="bg-white divide-y divide-gray-200"
                                >
                                    {page.length > 0 ? (
                                        page.map((row) => {
                                            prepareRow(row);
                                            return (
                                                <tr
                                                    {...row.getRowProps()}
                                                    className="hover:bg-gray-50"
                                                >
                                                    {row.cells.map((cell) => (
                                                        <td
                                                            {...cell.getCellProps()}
                                                            className="px-6 py-4 whitespace-nowrap"
                                                        >
                                                            {cell.render("Cell")}
                                                        </td>
                                                    ))}
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={columns.length}
                                                className="px-6 py-4 text-center text-gray-500"
                                            >
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center">
                                <span className="text-sm text-gray-700 mr-2">
                                    Show
                                </span>
                                <select
                                    value={pageSize}
                                    onChange={(e) => setPageSize(Number(e.target.value))}
                                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                                >
                                    {[5, 10, 20].map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                                <span className="text-sm text-gray-700 ml-2">
                                    entries
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => gotoPage(0)}
                                    disabled={!canPreviousPage}
                                    className={`p-1 rounded ${
                                        !canPreviousPage
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-gray-200"
                                    }`}
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() => previousPage()}
                                    disabled={!canPreviousPage}
                                    className={`px-3 py-1 rounded ${
                                        !canPreviousPage
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-gray-200"
                                    }`}
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-700">
                                    Page <strong>{pageIndex + 1}</strong> of{" "}
                                    <strong>{pageOptions.length}</strong>
                                </span>
                                <button
                                    onClick={() => nextPage()}
                                    disabled={!canNextPage}
                                    className={`px-3 py-1 rounded ${
                                        !canNextPage
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-gray-200"
                                    }`}
                                >
                                    Next
                                </button>
                                <button
                                    onClick={() => gotoPage(pageCount - 1)}
                                    disabled={!canNextPage}
                                    className={`p-1 rounded ${
                                        !canNextPage
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-gray-200"
                                    }`}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminWrapper>
    );
};

export default UserManagement;