// import React, { useState, useMemo, useEffect } from "react";
// import { useTable, useSortBy, usePagination } from "react-table";
// import axios from "axios";
// import {
//     Plus,
//     ChevronUp,
//     ChevronDown,
//     Edit,
//     Trash2,
//     ChevronLeft,
//     ChevronRight,
// } from "lucide-react";
// import AdminWrapper from "@/AdminComponents/AdminWrapper";


// const TrekkingSubCategory = () => {
//     const [showAddForm, setShowAddForm] = useState(false);   
//     const [allTrekkingSubCategory, setAllTrekkingSubCategory] = useState([]);
//     const [allTrekkingCategory, setAllTrekkingCategory] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingTrekkingSubCategory, setEditingTrekkingSubCategory] = useState(null);
//     const [showEditForm, setShowEditForm] = useState(false);
//     const [loading, setLoading] = useState(true);
    
//     const categoryMap = useMemo(
//         () => Object.fromEntries(allTrekkingCategory.map(cat => [cat.id, cat.category])),
//         [allTrekkingCategory]
//     );

//     const columns = useMemo(
//         () => [
//             {
//                 Header: "ID",
//                 accessor: "id",
//                 width: 60,
//             },
//             {
//                 Header: "Trekking Category",
//                 Cell: ({ row }) => {
//                     const categoryId = row.original.category_id; 
//                     const categoryName = categoryMap[categoryId];
//                     return (
//                         <p className={`text-gray-700 ${categoryName ? '' : 'text-red-500 italic'}`}>
//                             {categoryName}
//                         </p>
//                     );
//                 },
//             },
//             {
//                 Header: "Trekking Sub Category",
//                 accessor: "sub_category",
//             },
//             {
//                 Header: "Actions",
//                 accessor: "actions",
//                 Cell: ({ row }) => (
//                     <div className="flex space-x-2">
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             className="text-blue-600 hover:text-blue-900 transition-colors"
//                         >
//                             <Edit size={18} />
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             className="text-red-600 hover:text-red-900 transition-colors"
//                         >
//                             <Trash2 size={18} />
//                         </button>
//                     </div>
//                 ),
//             },
//         ],
//         [categoryMap] 
//     );

//     useEffect(() => {
//         const fetchTrekkingSubCategory = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(route("trekkingsubcategory.index"));
//                 setAllTrekkingSubCategory(response.data.data || []);
//             } catch (error) {
//                 console.error("Error fetching trekking subcategory:", error);
//                 setAllTrekkingSubCategory([]);
//             } finally {
//                 setLoading(false);
//             }
//         };
        
//         const fetchTrekkingCategory = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(route("trekkingcategory.index"));
//                 setAllTrekkingCategory(response.data.data || []);
//                 console.log("Fetched categories:", response.data.data); // 🔍 Debug: Check structure here
//             } catch (error) {
//                 console.error("Error fetching trekking category:", error); 
//                 setAllTrekkingCategory([]);
//             } finally {
//                 setLoading(false);
//             }
//         };
        
//         fetchTrekkingSubCategory();
//         fetchTrekkingCategory();
//     }, [reloadTrigger]);

//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this trekking subcategory?"))
//             return;
//         try {
//             await axios.delete(route("trekkingsubcategory.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.error("Delete error:", error);
//             alert("Error deleting trekking subcategory. Please try again.");
//         }
//     };

//     const handleEdit = (trekkingsubcategory) => {
//         setEditingTrekkingSubCategory(trekkingsubcategory);
//         setShowEditForm(true);
//     };

//     const {
//         getTableProps,
//         getTableBodyProps,
//         headerGroups,
//         page,
//         prepareRow,
//         canPreviousPage,
//         canNextPage,
//         pageOptions,
//         pageCount,
//         gotoPage,
//         nextPage,
//         previousPage,
//         setPageSize,
//         state: { pageIndex, pageSize },
//     } = useTable(
//         {
//             columns,
//             data: allTrekkingSubCategory,
//             initialState: { pageIndex: 0, pageSize: 5 },
//         },
//         useSortBy,
//         usePagination
//     );

//     // Optional debug log — remove in production
//     console.log("Subcategories:", allTrekkingSubCategory);
//     console.log("Categories:", allTrekkingCategory);

//     return (
//         <AdminWrapper>
//             <div className="min-h-screen bg-gray-50 p-6">
//                 <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
//                     <div className="flex flex-wrap items-center justify-between mb-6 md:mb-8">
//                         <div className="flex items-center">
//                             <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//                                 Trekking Sub Category Management
//                             </h1>
//                         </div>
//                         <button
//                             onClick={() => setShowAddForm(true)}
//                             className="mt-2 md:mt-0 py-2 md:py-3 px-4 md:px-6 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center gap-2 text-sm md:text-base"
//                         >
//                             <Plus size={18} className="hidden md:block" />
//                             <span>Add Trekking Sub Category</span>
//                         </button>
//                     </div>

//                     {showAddForm && (
//                         <AddTrekkingSubCategoryForm
//                             showForm={showAddForm}
//                             setShowForm={setShowAddForm}
//                             allTrekkingCategory={allTrekkingCategory}
//                             setReloadTrigger={setReloadTrigger}
//                         />
//                     )}
                    
//                     {showEditForm && (
//                         <AddTrekkingSubCategoryForm
//                             showForm={showEditForm}
//                             setShowForm={setShowEditForm}
//                             allTrekkingCategory={allTrekkingCategory}
//                             setReloadTrigger={setReloadTrigger}
//                             editingTrekkingSubCategory={editingTrekkingSubCategory}
//                             setEditingTrekkingSubCategory={setEditingTrekkingSubCategory}
//                         />
//                     )}
                    
//                     {loading ? (
//                         <div className="text-center py-8">Loading...</div>
//                     ) : (
//                         <>
//                             <div className="overflow-x-auto rounded-lg shadow">
//                                 <table
//                                     {...getTableProps()}
//                                     className="min-w-full divide-y divide-gray-200"
//                                 >
//                                     <thead className="bg-gray-50">
//                                         {headerGroups.map((headerGroup) => {
//                                             const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
//                                             return (
//                                                 <tr key={key} {...headerGroupProps}>
//                                                     {headerGroup.headers.map((column) => {
//                                                         const { key: columnKey, ...columnProps } = column.getHeaderProps(
//                                                             column.getSortByToggleProps()
//                                                         );
//                                                         return (
//                                                             <th
//                                                                 key={columnKey}
//                                                                 {...columnProps}
//                                                                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                                                             >
//                                                                 <div className="flex items-center">
//                                                                     {column.render("Header")}
//                                                                     {column.isSorted ? (
//                                                                         column.isSortedDesc ? (
//                                                                             <ChevronDown
//                                                                                 size={16}
//                                                                                 className="ml-1"
//                                                                             />
//                                                                         ) : (
//                                                                             <ChevronUp
//                                                                                 size={16}
//                                                                                 className="ml-1"
//                                                                             />
//                                                                         )
//                                                                     ) : (
//                                                                         ""
//                                                                     )}
//                                                                 </div>
//                                                             </th>
//                                                         );
//                                                     })}
//                                                 </tr>
//                                             );
//                                         })}
//                                     </thead>
//                                     <tbody
//                                         {...getTableBodyProps()}
//                                         className="bg-white divide-y divide-gray-200"
//                                     >
//                                         {page.map((row) => {
//                                             prepareRow(row);
//                                             const { key, ...rowProps } = row.getRowProps();
//                                             return (
//                                                 <tr
//                                                     key={key}
//                                                     {...rowProps}
//                                                     className="hover:bg-gray-50"
//                                                 >
//                                                     {row.cells.map((cell) => {
//                                                         const { key: cellKey, ...cellProps } = cell.getCellProps();
//                                                         return (
//                                                             <td
//                                                                 key={cellKey}
//                                                                 {...cellProps}
//                                                                 className="px-6 py-4 whitespace-nowrap"
//                                                             >
//                                                                 {cell.render("Cell")}
//                                                             </td>
//                                                         );
//                                                     })}
//                                                 </tr>
//                                             );
//                                         })}
//                                     </tbody>
//                                 </table>
//                             </div>
//                             <div className="flex items-center justify-between mt-4">
//                                 <div className="flex items-center">
//                                     <span className="text-sm text-gray-700 mr-2">
//                                         Show
//                                     </span>
//                                     <select
//                                         value={pageSize}
//                                         onChange={(e) =>
//                                             setPageSize(Number(e.target.value))
//                                         }
//                                         className="border border-gray-300 rounded-md px-2 py-1 text-sm"
//                                     >
//                                         {[5, 10, 20].map((size) => (
//                                             <option key={size} value={size}>
//                                                 {size}
//                                             </option>
//                                         ))}
//                                     </select>
//                                     <span className="text-sm text-gray-700 ml-2">
//                                         entries
//                                     </span>
//                                 </div>
//                                 <div className="flex items-center space-x-2">
//                                     <button
//                                         onClick={() => gotoPage(0)}
//                                         disabled={!canPreviousPage}
//                                         className={`p-1 rounded ${
//                                             !canPreviousPage
//                                                 ? "opacity-50 cursor-not-allowed"
//                                                 : "hover:bg-gray-200"
//                                         }`}
//                                     >
//                                         <ChevronLeft size={20} />
//                                     </button>
//                                     <button
//                                         onClick={() => previousPage()}
//                                         disabled={!canPreviousPage}
//                                         className={`px-3 py-1 rounded ${
//                                             !canPreviousPage
//                                                 ? "opacity-50 cursor-not-allowed"
//                                                 : "hover:bg-gray-200"
//                                         }`}
//                                     >
//                                         Previous
//                                     </button>
//                                     <span className="text-sm text-gray-700">
//                                         Page <strong>{pageIndex + 1}</strong> of{" "}
//                                         <strong>{pageOptions.length}</strong>
//                                     </span>
//                                     <button
//                                         onClick={() => nextPage()}
//                                         disabled={!canNextPage}
//                                         className={`px-3 py-1 rounded ${
//                                             !canNextPage
//                                                 ? "opacity-50 cursor-not-allowed"
//                                                 : "hover:bg-gray-200"
//                                         }`}
//                                     >
//                                         Next
//                                     </button>
//                                     <button
//                                         onClick={() => gotoPage(pageCount - 1)}
//                                         disabled={!canNextPage}
//                                         className={`p-1 rounded ${
//                                             !canNextPage
//                                                 ? "opacity-50 cursor-not-allowed"
//                                                 : "hover:bg-gray-200"
//                                         }`}
//                                     >
//                                         <ChevronRight size={20} />
//                                     </button>
//                                 </div>
//                             </div>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </AdminWrapper>
//     );
// };

// export default TrekkingSubCategory;

import React from 'react'

const TrekkingSubCategory = () => {
  return (
    <div>
      <h2>Trekking Sub Categories</h2>
    </div>
  )
}

export default TrekkingSubCategory
