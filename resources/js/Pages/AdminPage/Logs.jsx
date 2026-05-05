import AdminWrapper from "@/AdminComponents/AdminWrapper";
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import MyTable from "@/MyTable/MyTable";


const Logs = () => {
    const [activityLogs, setActivityLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                const response = await axios.get(route("ourlogs.index"));

                // Access the data property of the response
                const responseData = response.data;

                // Check if the response has the expected structure
                if (responseData.success && Array.isArray(responseData.data)) {
                    setActivityLogs(responseData.data);
                } else {
                    console.error(
                        "Unexpected response structure:",
                        responseData
                    );
                    setActivityLogs([]);
                    setError("Unexpected data format received from server.");
                }
            } catch (error) {
                console.error("Error fetching logs:", error);
                setError("Failed to fetch logs. Please try again later.");
                setActivityLogs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

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
                Header: "IP Address",
                accessor: "ip_address",
            },
            {
                Header: "Title",
                accessor: "title",
            },
            {
                Header: "Date",
                accessor: "created_at",
                Cell: ({ value }) => {
                    return new Date(value).toLocaleString();
                },
            },
        ],
        []
    );

    return (
        <AdminWrapper>
            <div className=" p-6">
                <div className="flex flex-wrap items-center justify-between mb-6 md:mb-8">
                    <div className="flex items-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Activity Logs
                        </h1>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">{error}</div>
                ) : (
                    <MyTable
                        columns={columns} 
                        data={activityLogs} 
                    />
                )}
            </div>
        </AdminWrapper>
    );
};

export default Logs;
