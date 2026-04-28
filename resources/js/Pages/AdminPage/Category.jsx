import AdminWrapper from "@/AdminComponents/AdminWrapper";
import {
    Plus,
    ChevronUp,
    ChevronDown,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import axios from "axios";
import AddCategoryForm from "@/AddComponents/AddCategoryForm";
import EditCategoryForm from "@/EditComponents/EditCategoryForm";

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
                // Header: "ID",
                // accessor: "id",
                // width: 60,
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
            data: allCategory,
            initialState: { pageIndex: 0, pageSize: 5 },
        },
        useSortBy,
        usePagination
    );

    return (
        <>
            <AdminWrapper>
                <div className="bg-white rounded-lg shadow-md p-6">
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
                        <>
                            <div className="overflow-x-auto rounded-lg shadow">
                                <table
                                    {...getTableProps()}
                                    className="w-full divide-y divide-gray-200"
                                >
                                    <thead className="bg-gray-50">
                                        {headerGroups.map(
                                            (headerGroup, hgIndex) => (
                                                <tr
                                                    {...headerGroup.getHeaderGroupProps()}
                                                    key={hgIndex}
                                                >
                                                    {headerGroup.headers.map(
                                                        (column, colIndex) => (
                                                            <th
                                                                {...column.getHeaderProps(
                                                                    column.getSortByToggleProps()
                                                                )}
                                                                key={colIndex}
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                            >
                                                                <div className="flex items-center">
                                                                    {column.render(
                                                                        "Header"
                                                                    )}
                                                                    {column.isSorted &&
                                                                        (column.isSortedDesc ? (
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
                                                                        ))}
                                                                </div>
                                                            </th>
                                                        )
                                                    )}
                                                </tr>
                                            )
                                        )}
                                    </thead>
                                    <tbody
                                        {...getTableBodyProps()}
                                        className="bg-white divide-y divide-gray-200"
                                    >
                                        {page.length > 0 ? (
                                            page.map((row, rowIndex) => {
                                                prepareRow(row);
                                                return (
                                                    <tr
                                                        {...row.getRowProps()}
                                                        key={rowIndex}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        {row.cells.map(
                                                            (
                                                                cell,
                                                                cellIndex
                                                            ) => (
                                                                <td
                                                                    {...cell.getCellProps()}
                                                                    key={
                                                                        cellIndex
                                                                    }
                                                                    className="px-6 py-4 whitespace-nowrap"
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
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={
                                                        columns?.length || 1
                                                    }
                                                    className="px-6 py-4 text-center text-gray-500"
                                                >
                                                    No categories found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex items-center justify-between flex-col md:flex-row  mt-4">
                                <div className="flex md:items-center">
                                    <span className="text-sm text-gray-700 mr-2">
                                        Show
                                    </span>
                                    <select
                                        value={pageSize}
                                        onChange={(e) =>
                                            setPageSize(Number(e.target.value))
                                        }
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
                                <div className="flex lg:items-center gap-2">
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
        </>
    );
};

export default Category;
