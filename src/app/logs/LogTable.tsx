"use client";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

interface Log {
  userId?: string;
  method: string;
  url: string;
  headers: string;
  body: string;
  responseStatus: number;
  responseBody: string;
  responseTime: string;
  ipAddress: string;
  userAgent: string;
  queryParameters: string;
  createdAt: string;
}

const LogTable = () => {
  const [data, setData] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logs`);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setData(data.logs);
      } catch (error: any) {
        setError(error.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const columns = [
    {
      name: "User ID",
      selector: (row: Log) => row.userId || "N/A",
      sortable: true,
    },
    {
      name: "Method",
      selector: (row: Log) => row.method,
      sortable: true,
    },
    {
      name: "URL",
      selector: (row: Log) => row.url,
      sortable: true,
    },
    {
      name: "Headers",
      selector: (row: Log) => row.headers,
      sortable: false,
    },
    {
      name: "Body",
      selector: (row: Log) => row.body,
      sortable: false,
    },
    {
      name: "Response Status",
      selector: (row: Log) => row.responseStatus,
      sortable: true,
    },
    {
      name: "Response Body",
      selector: (row: Log) => row.responseBody,
      sortable: false,
    },
    {
      name: "Response Time",
      selector: (row: Log) => row.responseTime,
      sortable: false,
    },
    {
      name: "IP Address",
      selector: (row: Log) => row.ipAddress,
      sortable: false,
    },
    {
      name: "User Agent",
      selector: (row: Log) => row.userAgent,
      sortable: false,
    },
    {
      name: "Query Parameters",
      selector: (row: Log) => row.queryParameters,
      sortable: false,
    },
    {
      name: "Created At",
      selector: (row: Log) => new Date(row.createdAt).toLocaleString(),
      sortable: true,
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        responsive

      />
    </div>
  );
};

export default LogTable;
