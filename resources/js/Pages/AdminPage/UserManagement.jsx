import React, { useState, useMemo, useEffect } from "react";
import {
    Plus,
    Edit,
    Trash2,
} from "lucide-react";
import AdminWrapper from "@/AdminComponents/AdminWrapper";
import axios from "axios";
import AddUserForm from "@/AddComponents/AddUserForm";
import { usePage } from "@inertiajs/react";
import EditUserForm from "@/EditComponents/EditUserForm";
import MyTable from "@/MyTable/MyTable";


const UserManagement = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const imgurl = import.meta.env.VITE_IMAGE_PATH;
    const user = usePage().props.auth.user;

    const isAdmin = user?.role === "admin" || user?.role === "Administrator";
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
        if (!isAdmin) return;
        if (
            !window.confirm(
                "Are you sure you want to delete this team member? Deleting user means they won't be able to log in."
            )
        )
            return;
        try {
            await axios.delete(route("ouruser.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting user. Please try again.");
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setShowEditForm(true);
    };

    const handleAdd = () => {
        setShowAddForm(true);
    };

    const handleAddFormClose = () => {
        setShowAddForm(false);
    };

    const handleEditFormClose = () => {
        setShowEditForm(false);
        setEditingUser(null);
    };

    const handleUserAdded = () => {
        setReloadTrigger((prev) => !prev);
        setShowAddForm(false);
    };

    const handleUserUpdated = () => {
        setReloadTrigger((prev) => !prev);
        setShowEditForm(false);
        setEditingUser(null);
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
                disableSortBy: true,
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
            ...(isAdmin
                ? [
                      {
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
                                      onClick={() =>
                                          handleDelete(row.original.id)
                                      }
                                      className="text-red-600 hover:text-red-900 transition-colors"
                                      title="Delete"
                                  >
                                      <Trash2 size={18} />
                                  </button>
                              </div>
                          ),
                      },
                  ]
                : []),
        ],
        [isAdmin, imgurl]
    );

    return (
        <AdminWrapper>
            <div className="p-6">
                <div className="flex flex-wrap items-center justify-between mb-6 md:mb-8">
                    <div className="flex items-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            User Management
                        </h1>
                    </div>
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

                {showAddForm && isAdmin && (
                    <AddUserForm
                        showForm={showAddForm}
                        setShowForm={setShowAddForm}
                        onClose={handleAddFormClose}
                        onUserAdded={handleUserAdded}
                    />
                )}

                {showEditForm && isAdmin && editingUser && (
                    <EditUserForm
                        showForm={showEditForm}
                        setShowForm={setShowEditForm}
                        editingUser={editingUser}
                        onClose={handleEditFormClose}
                        onUserUpdated={handleUserUpdated}
                    />
                )}

                {loading ? (
                    <div className="text-center py-8">Loading users...</div>
                ) : (
                    <MyTable 
                        columns={columns} 
                        data={allUsers} 
                    />
                )}
            </div>
        </AdminWrapper>
    );
};

export default UserManagement;