import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
    Plus,
    Edit,
    Trash2,
} from "lucide-react";
import AdminWrapper from "@/AdminComponents/AdminWrapper";
import AddTourForm from "@/AddComponents/AddTourForm";
import EditTourForm from "@/EditComponents/EditTourForm";
import MyTable from "@/MyTable/MyTable";


const Tour = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [allTour, setAllTour] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingTour, setEditingTour] = useState(null);
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
                Header: "Title",
                accessor: "title",
            },
            {
                Header: "Tour Type",
                accessor: "tour_type",
            },
            {
                Header: "Duration",
                accessor: "duration",
            },
            {
                Header: "Season",
                accessor: "season",
            },
            {
                Header: "Category",
                Cell: ({ row }) => <p>{row.original?.category?.category}</p>,
            },
            {
                Header: "Sub Category",
                Cell: ({ row }) => (
                    <p>{row?.original?.sub_category?.sub_category}</p>
                ),
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
        const fetchTours = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourtour.index"));
                const ourtour = Array.isArray(response.data)
                    ? response.data
                    : response.data.data || [];
                setAllTour(
                    ourtour.map((tour) => ({
                        ...tour,
                        images: tour.images || [],
                    }))
                );
            } catch (error) {
                console.error("Fetching error", error);
                setAllTour([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTours();

        const fetchCategory = async () => {
            try {
                const response = await axios.get(
                    route("categorywithsubcategory.indexWithSubCategory")
                );
                setAllCategory(response.data.data || []);
            } catch (error) {
                console.error("Error fetching category:", error);
                setAllCategory([]);
            }
        };
        fetchCategory();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this tour?"))
            return;
        try {
            await axios.delete(route("ourtour.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting tour. Please try again.");
        }
    };

    const handleEdit = (tour) => {
        setEditingTour(tour);
        setShowEditForm(true);
    };

    const handleAddSuccess = () => {
        setShowAddForm(false);
        setReloadTrigger((prev) => !prev);
    };

    const handleEditSuccess = () => {
        setShowEditForm(false);
        setEditingTour(null);
        setReloadTrigger((prev) => !prev);
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setShowEditForm(false);
        setEditingTour(null);
    };

    return (
        <>
            <AdminWrapper>
                <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between mb-6 md:mb-8">
                        <div className="flex items-center">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                Tour Management
                            </h1>
                        </div>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="mt-2 md:mt-0 py-2 md:py-3 px-4 md:px-6 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center gap-2 text-sm md:text-base"
                        >
                            <Plus size={18} className="hidden md:block" />
                            <span>Add Tour</span>
                        </button>
                    </div>

                    {showAddForm && (
                        <AddTourForm
                            showForm={showAddForm}
                            onCancel={handleCancel}
                            allCategory={allCategory}
                            onSuccess={handleAddSuccess}
                        />
                    )}

                    {showEditForm && (
                        <EditTourForm
                            showForm={showEditForm}
                            onCancel={handleCancel}
                            allCategory={allCategory}
                            onSuccess={handleEditSuccess}
                            editingTour={editingTour}
                        />
                    )}

                    {loading ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : (
                        <MyTable 
                            columns={columns} 
                            data={allTour} 
                        />
                    )}
                </div>
            </AdminWrapper>
        </>
    );
};

export default Tour;