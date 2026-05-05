import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
    Plus,
    Edit,
    Trash2,
} from "lucide-react";
import AdminWrapper from "@/AdminComponents/AdminWrapper";
import AddSubCategoryForm from "@/AddComponents/AddSubCategoryForm";
import EditSubCategoryForm from "@/EditComponents/EditSubCategoryForm";
import MyTable from "@/MyTable/MyTable";


const SubCategory = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [allSubCategory, setAllSubCategory] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingSubCategory, setEditingSubCategory] = useState(null);
    const [loading, setLoading] = useState(true);

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
                Cell: ({ row }) => <p>{row?.original?.category?.category}</p>,
            },
            {
                Header: "Sub Category",
                accessor: "sub_category",
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

    useEffect(() => {
        const fetchSubCategory = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("subcategory.index"));
                setAllSubCategory(response.data.data || []);
            } catch (error) {
                console.error("Error fetching subcategory:", error);
                setAllSubCategory([]);
            } finally {
                setLoading(false);
            }
        };

        const fetchCategory = async () => {
            try {
                const response = await axios.get(route("ourcategory.index"));
                setAllCategory(response.data.data || []);
            } catch (error) {
                console.error("Error fetching category:", error);
                setAllCategory([]);
            }
        };

        fetchSubCategory();
        fetchCategory();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (
            !window.confirm("Are you sure you want to delete this subcategory?")
        )
            return;
        try {
            await axios.delete(route("subcategory.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting subcategory. Please try again.");
        }
    };

    const handleEdit = (subcategory) => {
        setEditingSubCategory(subcategory);
        setShowEditForm(true);
    };

    return (
        <>
            <AdminWrapper>
                <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between mb-6 md:mb-8">
                        <div className="flex items-center">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                Sub Category Management
                            </h1>
                        </div>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="mt-2 md:mt-0 py-2 md:py-3 px-4 md:px-6 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center gap-2 text-sm md:text-base"
                        >
                            <Plus size={18} className="hidden md:block" />
                            <span>Add Sub Category</span>
                        </button>
                    </div>

                    {/* Add Form */}
                    {showAddForm && (
                        <AddSubCategoryForm
                            showForm={showAddForm}
                            setShowForm={setShowAddForm}
                            allCategory={allCategory}
                            setReloadTrigger={setReloadTrigger}
                        />
                    )}

                    {/* Edit Form */}
                    {showEditForm && (
                        <EditSubCategoryForm
                            showForm={showEditForm}
                            setShowForm={setShowEditForm}
                            allCategory={allCategory}
                            setReloadTrigger={setReloadTrigger}
                            editingSubCategory={editingSubCategory}
                            setEditingSubCategory={setEditingSubCategory}
                        />
                    )}

                    {loading ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : (
                        <MyTable
                            columns={columns} 
                            data={allSubCategory} 
                        />
                    )}
                </div>
            </AdminWrapper>
        </>
    );
};

export default SubCategory;
