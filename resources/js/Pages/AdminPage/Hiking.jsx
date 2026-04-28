import React, { useState, useMemo, useEffect } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import axios from "axios";
import {
    Plus,
    ChevronUp,
    ChevronDown,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import AdminWrapper from "@/AdminComponents/AdminWrapper";
import AddHikingForm from "@/AddComponents/AddHikingForm";
import EditHikingForm from "@/EditComponents/EditHikingForm";

const Hiking = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [allHiking, setAllHiking] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingHiking, setEditingHiking] = useState(null);
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
                Header: "Duration",
                accessor: "duration",
            },
            {
                Header: "Highest Elevation",
                accessor: "elevation",
            },
            {
                Header: "Best Season",
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
                Cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
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
        const fetchHiking = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourhiking.index"));
                const hikingData = Array.isArray(response.data)
                    ? response.data
                    : response.data.data || [];
                setAllHiking(
                    hikingData.map((hiking) => ({
                        ...hiking,
                        images: hiking.images || [],
                    }))
                );
            } catch (error) {
                console.error("Fetching error", error);
                setAllHiking([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHiking();

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
        if (!window.confirm("Are you sure you want to delete this hiking trip?"))
            return;
        try {
            await axios.delete(route("ourhiking.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting hiking trip. Please try again.");
        }
    };

    const handleEdit = (hiking) => {
        setEditingHiking(hiking);
        setShowEditForm(true);
    };

    const handleAddSuccess = () => {
        setShowAddForm(false);
        setReloadTrigger((prev) => !prev);
    };

    const handleEditSuccess = () => {
        setShowEditForm(false);
        setEditingHiking(null);
        setReloadTrigger((prev) => !prev);
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setShowEditForm(false);
        setEditingHiking(null);
    };

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
            data: allHiking,
            initialState: { pageIndex: 0, pageSize: 5 },
        },
        useSortBy,
        usePagination
    );

    return (
        <>
            <AdminWrapper>
                <div className=" bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-wrap items-center justify-between mb-6 md:mb-8">
                        <div className="flex items-center">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                Hiking Management
                            </h1>
                        </div>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="mt-2 md:mt-0 py-2 md:py-3 px-4 md:px-6 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center gap-2 text-sm md:text-base"
                        >
                            <Plus size={18} className="hidden md:block" />
                            <span>Add Hiking</span>
                        </button>
                    </div>

                    {showAddForm && (
                        <AddHikingForm
                            showForm={showAddForm}
                            onCancel={handleCancel}
                            allCategory={allCategory}
                            onSuccess={handleAddSuccess}
                        />
                    )}

                    {showEditForm && (
                        <EditHikingForm
                            showForm={showEditForm}
                            onCancel={handleCancel}
                            allCategory={allCategory}
                            onSuccess={handleEditSuccess}
                            editingHiking={editingHiking}
                        />
                    )}

                    {loading ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : (
                        <>
                            <div className="overflow-x-auto rounded-lg shadow">
                                <table
                                    {...getTableProps()}
                                    className="min-w-full divide-y divide-gray-200"
                                >
                                    <thead className="bg-gray-50">
                                        {headerGroups.map((headerGroup) => (
                                            <tr
                                                {...headerGroup.getHeaderGroupProps()}
                                            >
                                                {headerGroup.headers.map(
                                                    (column) => (
                                                        <th
                                                            {...column.getHeaderProps(
                                                                column.getSortByToggleProps()
                                                            )}
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            <div className="flex items-center">
                                                                {column.render(
                                                                    "Header"
                                                                )}
                                                                {column.isSorted ? (
                                                                    column.isSortedDesc ? (
                                                                        <ChevronDown
                                                                            size={
                                                                                16
                                                                            }
                                                                            className="ml-1"
                                                                        />
                                                                    ) : (
                                                                        <ChevronUp
                                                                            size={
                                                                                16
                                                                            }
                                                                            className="ml-1"
                                                                        />
                                                                    )
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </div>
                                                        </th>
                                                    )
                                                )}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody
                                        {...getTableBodyProps()}
                                        className="bg-white divide-y divide-gray-200"
                                    >
                                        {page.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={8}
                                                    className="px-6 py-4 text-center text-sm text-gray-500"
                                                >
                                                    No hiking trips found.
                                                </td>
                                            </tr>
                                        ) : (
                                            page.map((row) => {
                                                prepareRow(row);
                                                return (
                                                    <tr
                                                        {...row.getRowProps()}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        {row.cells.map(
                                                            (cell) => (
                                                                <td
                                                                    {...cell.getCellProps()}
                                                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                                                >
                                                                    {cell.render(
                                                                        "Cell"
                                                                    )}
                                                                </td>
                                                            )
                                                        )}
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex items-center justify-between flex-col md:flex-row mt-4">
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-700 mr-2">
                                        Show
                                    </span>
                                    <select
                                        value={pageSize}
                                        onChange={(e) =>
                                            setPageSize(Number(e.target.value))
                                        }
                                        className="border border-gray-300 rounded-md px-2 py-1 text-xs md:text-sm"
                                    >
                                        {[5, 10, 20].map((size) => (
                                            <option key={size} value={size}>
                                                {size}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="text-xs md:text-sm text-gray-700 ml-2">
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
                                    <span className="text-xs md:text-sm text-gray-700">
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
        </>
    );
};

export default Hiking;