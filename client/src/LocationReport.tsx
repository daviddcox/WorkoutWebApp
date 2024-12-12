import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart } from "react-minimal-pie-chart";
import { FaSquare } from "react-icons/fa6";

interface Location {
  location_id: number;
  location_name: string;
  address: string;
  indoor: boolean;
  max_capacity: number;
}

interface ReportVal {
  title: string;
  value: number;
  color: string;
}

const ViewReport = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [location, setLocation] = useState("");
  const [reportData, setReportData] = useState<ReportVal[]>([]);

  const fetchLocations = async () => {
    try {
      const response = await axios.get<Location[]>(
        "http://localhost:5000/locations"
      );
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchReport = async () => {
    if (location === "") {
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/report/${location}`
      );
      console.log("API response:", response.data);

      // Convert the dictionary to an array format
      const reportDataTemp = Object.entries(response.data).map(
        ([title, value], index) => ({
          title,
          value: Number(value), // Ensure the value is a number
          color: generateColor(index),
        })
      );

      setReportData(reportDataTemp);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [location]);

  // Generate random color for each report item
  const generateColor = (index: number) => {
    const colors = ["#E38627", "#C13C37", "#6A2135", "#8e44ad", "#3498db"];
    return colors[index % colors.length];
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-purple-100">
      <div className="flex flex-col items-center justify-center mt-4">
        <h1 className="text-2xl font-bold mb-4">Location Report</h1>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 rounded w-full"
          required
        >
          <option value="" disabled>
            Select Location
          </option>
          {locations.map((location) => (
            <option key={location.location_id} value={location.location_id}>
              {location.location_name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-row items-start justify-center mt-4 space-x-4">
        <PieChart data={reportData} />
        <div className="flex flex-col items-center justify-center mt-4">
          <h2 className="text-2xl font-bold mb-4">Key</h2>
          <ul>
            {reportData.map((item) => (
              <li key={item.title}>
                <div className="flex flex-row items-center justify-start">
                  <FaSquare style={{ color: item.color }} /> {item.title}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ViewReport;
