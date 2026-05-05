import AdminWrapper from "@/AdminComponents/AdminWrapper";
import {
    Plus,
    Edit,
    Trash2,
} from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import AddCategoryForm from "@/AddComponents/AddCategoryForm";
import EditCategoryForm from "@/EditComponents/EditCategoryForm";
import MyTable from "@/MyTable/MyTable";

const Category = () => {
    const [allCategory, setAllCategory] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourcategory.index"));
                setAllCategory(response.data.data || []);
            } catch (error) {
                console.error("Error fetching category:", error);
                setAllCategory([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?"))
            return;
        try {
            await axios.delete(route("ourcategory.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting category. Please try again.");
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
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
        setEditingCategory(null);
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
                Header: "Category",
                accessor: "category",
            },
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
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    return (
        <>
            <AdminWrapper>
                <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between mb-6 md:mb-8">
                        <div className="flex items-center">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                Category Management
                            </h1>
                        </div>
                        <button
                            onClick={handleAdd}
                            className="mt-2 md:mt-0 py-2 md:py-3 px-4 md:px-6 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center gap-2 text-sm md:text-base"
                        >
                            <Plus size={18} className="hidden md:block" />
                            <span>Add Category</span>
                        </button>
                    </div>

                    {showAddForm && (
                        <AddCategoryForm
                            showForm={showAddForm}
                            setShowForm={setShowAddForm}
                            setReloadTrigger={setReloadTrigger}
                            onClose={handleAddFormClose}
                        />
                    )}

                    {showEditForm && (
                        <EditCategoryForm
                            showForm={showEditForm}
                            setShowForm={setShowEditForm}
                            setReloadTrigger={setReloadTrigger}
                            editingCategory={editingCategory}
                            onClose={handleEditFormClose}
                        />
                    )}

                    {loading ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : (
                        <MyTable
                            columns={columns} 
                            data={allCategory} 
                        />
                    )}
                </div>
            </AdminWrapper>
        </>
    );
};

export default Category;
