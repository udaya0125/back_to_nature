import React from "react";
import { useTable, useSortBy, usePagination } from "react-table";

const IconChevronDoubleLeft = () => (
    <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
        />
    </svg>
);

const IconChevronLeft = () => (
    <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
        />
    </svg>
);

const IconChevronRight = () => (
    <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
        />
    </svg>
);

const IconChevronDoubleRight = () => (
    <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
        />
    </svg>
);

const IconChevronUp = () => (
    <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
        />
    </svg>
);

const IconChevronDown = () => (
    <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
        />
    </svg>
);

const MyTable = ({ columns, data }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
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
            data,
            initialState: { pageIndex: 0 },
        },
        useSortBy,
        usePagination,
    );

    // Remove key from table props
    const { key: tableKey, ...tableProps } = getTableProps();

    return (
        <div className="w-full bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden mt-6 text-neutral">
            {/* Table Container */}
            <div className="overflow-x-auto">
                <table {...tableProps} className="w-full">
                    <thead className="bg-blue-50/40">
                        {headerGroups.map((headerGroup) => {
                            const { key: headerGroupKey, ...headerGroupProps } =
                                headerGroup.getHeaderGroupProps();
                            return (
                                <tr key={headerGroupKey} {...headerGroupProps}>
                                    {headerGroup.headers.map((column) => {
                                        const {
                                            key: headerKey,
                                            ...headerProps
                                        } = {
                                            ...column.getHeaderProps(
                                                column.getSortByToggleProps(),
                                            ),
                                        };
                                        return (
                                            <th
                                                key={headerKey}
                                                {...headerProps}
                                                className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase border-b border-blue-100 bg-blue-100 backdrop-blur-sm"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium">
                                                        {column.render(
                                                            "Header",
                                                        )}
                                                    </span>
                                                    <span className="ml-2">
                                                        {column.isSorted ? (
                                                            column.isSortedDesc ? (
                                                                <IconChevronDown className="w-4 h-4" />
                                                            ) : (
                                                                <IconChevronUp className="w-4 h-4" />
                                                            )
                                                        ) : (
                                                            <span className="w-4 h-4" />
                                                        )}
                                                    </span>
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </thead>

                    <tbody
                        {...getTableBodyProps()}
                        className="divide-y divide-blue-100/50"
                    >
                        {page.map((row, rowIndex) => {
                            prepareRow(row);
                            const { key: rowKey, ...rowProps } =
                                row.getRowProps();
                            return (
                                <tr
                                    key={row.original.id || rowKey}
                                    {...rowProps}
                                    className={`transition-colors duration-150 ${
                                        rowIndex % 2 === 0
                                            ? "bg-gray-100"
                                            : "bg-gray-50"
                                    } hover:bg-gray-200`}
                                >
                                    {row.cells.map((cell) => {
                                        const { key: cellKey, ...cellProps } =
                                            cell.getCellProps();
                                        return (
                                            <td
                                                key={cellKey}
                                                {...cellProps}
                                                className="px-6 py-4 whitespace-nowrap text-sm"
                                            >
                                                {cell.render("Cell")}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-3 border-t border-gray-300 ">
                <div className=" flex items-center justify-between w-full">
                    <div className="flex items-center sm:gap-2 gap-0.5">
                        <button
                            onClick={() => gotoPage(0)}
                            disabled={!canPreviousPage}
                            className="sm:px-3 px-1.5 py-1.5 border-2 border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100 transition"
                        >
                            {"<<"}
                        </button>
                        <button
                            onClick={() => previousPage()}
                            disabled={!canPreviousPage}
                            className="sm:px-3 px-1.5 py-1.5 border-2 border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100 transition"
                        >
                            {"<"}
                        </button>
                        <button
                            onClick={() => nextPage()}
                            disabled={!canNextPage}
                            className="sm:px-3 px-1.5 py-1.5 border-2 border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100 transition"
                        >
                            {">"}
                        </button>
                        <button
                            onClick={() => gotoPage(pageOptions.length - 1)}
                            disabled={!canNextPage}
                            className="sm:px-3 px-1.5 py-1.5 border-2 border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100 transition"
                        >
                            {">>"}
                        </button>
                    </div>

                    <span className="">
                        Page <strong>{pageIndex + 1}</strong> of{" "}
                        <strong>{pageOptions.length}</strong>
                    </span>

                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="border rounded-full p-1 pr-8 pl-4 bg-gray-200 text-sm"
                    >
                        {[10, 20, 30, 40, 50].map((size) => (
                            <option key={size} value={size}>
                                Show {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default MyTable;


// import React from "react";
// import { useTable, useSortBy, usePagination } from "react-table";

// const IconChevronUp = () => (
//     <svg
//         className="w-4 h-4"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//     >
//         <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M5 15l7-7 7 7"
//         />
//     </svg>
// );

// const IconChevronDown = () => (
//     <svg
//         className="w-4 h-4"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//     >
//         <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M19 9l-7 7-7-7"
//         />
//     </svg>
// );

// const MyTable = ({ columns, data }) => {
//     const {
//         getTableProps,
//         getTableBodyProps,
//         headerGroups,
//         prepareRow,
//         page,
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
//             data,
//             initialState: { pageIndex: 0, pageSize: 10 },
//         },
//         useSortBy,
//         usePagination,
//     );

//     return (
//         <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//             {/* Table Container */}
//             <div className="overflow-x-auto">
//                 <table {...getTableProps()} className="w-full">
//                     <thead className="bg-gray-50">
//                         {headerGroups.map((headerGroup) => (
//                             <tr {...headerGroup.getHeaderGroupProps()}>
//                                 {headerGroup.headers.map((column) => (
//                                     <th
//                                         {...column.getHeaderProps(
//                                             column.getSortByToggleProps(),
//                                         )}
//                                         className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase border-b border-gray-200 bg-gray-50"
//                                     >
//                                         <div className="flex items-center justify-between gap-2">
//                                             <span className="font-medium text-gray-700">
//                                                 {column.render("Header")}
//                                             </span>
//                                             <span className="text-gray-400">
//                                                 {column.isSorted ? (
//                                                     column.isSortedDesc ? (
//                                                         <IconChevronDown />
//                                                     ) : (
//                                                         <IconChevronUp />
//                                                     )
//                                                 ) : null}
//                                             </span>
//                                         </div>
//                                     </th>
//                                 ))}
//                             </tr>
//                         ))}
//                     </thead>

//                     <tbody
//                         {...getTableBodyProps()}
//                         className="divide-y divide-gray-200 bg-white"
//                     >
//                         {page.map((row, rowIndex) => {
//                             prepareRow(row);
//                             return (
//                                 <tr
//                                     {...row.getRowProps()}
//                                     className={`transition-colors duration-150 ${
//                                         rowIndex % 2 === 0
//                                             ? "bg-white"
//                                             : "bg-gray-50"
//                                     } hover:bg-gray-100`}
//                                 >
//                                     {row.cells.map((cell) => (
//                                         <td
//                                             {...cell.getCellProps()}
//                                             className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
//                                         >
//                                             {cell.render("Cell")}
//                                         </td>
//                                     ))}
//                                 </tr>
//                             );
//                         })}
//                         {page.length === 0 && (
//                             <tr>
//                                 <td
//                                     colSpan={columns.length}
//                                     className="px-6 py-8 text-center text-gray-500"
//                                 >
//                                     No records found
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Pagination */}
//             <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
//                 <div className="flex items-center justify-between w-full gap-4">
//                     <div className="flex items-center gap-2">
//                         <span className="text-sm text-gray-700">Show</span>
//                         <select
//                             value={pageSize}
//                             onChange={(e) => setPageSize(Number(e.target.value))}
//                             className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         >
//                             {[5, 10, 20, 30, 50].map((size) => (
//                                 <option key={size} value={size}>
//                                     {size}
//                                 </option>
//                             ))}
//                         </select>
//                         <span className="text-sm text-gray-700">entries</span>
//                         <span className="text-sm text-gray-700 ml-2">
//                             Total: {data.length} records
//                         </span>
//                     </div>

//                     <div className="flex items-center gap-2">
//                         <button
//                             onClick={() => gotoPage(0)}
//                             disabled={!canPreviousPage}
//                             className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                         >
//                             {"<<"}
//                         </button>
//                         <button
//                             onClick={() => previousPage()}
//                             disabled={!canPreviousPage}
//                             className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                         >
//                             {"<"}
//                         </button>
//                         <span className="text-sm text-gray-700">
//                             Page <strong>{pageIndex + 1}</strong> of{" "}
//                             <strong>{pageOptions.length}</strong>
//                         </span>
//                         <button
//                             onClick={() => nextPage()}
//                             disabled={!canNextPage}
//                             className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                         >
//                             {">"}
//                         </button>
//                         <button
//                             onClick={() => gotoPage(pageCount - 1)}
//                             disabled={!canNextPage}
//                             className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                         >
//                             {">>"}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MyTable;