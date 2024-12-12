import React, { useState, useEffect } from "react";
import axios from "axios";

interface User {
  ID: number;
  Email: string;
  FirstName: string;
  LastName: string;
  Purdue_ID: string;
}

interface Location {
    location_id: number;
    location_name: string;
    address: string;
    indoor: boolean;
    max_capacity: number;
}

const CreateGroup = () => {
    const [group_name, set_group_name] = useState("");
    const [group_leader_id, set_group_leader_id] = useState("");
    const [workout_type, set_workout_type] = useState("");
    const [location, set_location] = useState("");
    const [scheduled_time, set_scheduled_time] = useState("");
    const [duration, set_duration] = useState("");

    const [users, setUsers] = useState<User[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get<User[]>("http://localhost:5000/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchLocations = async () => {
        try {
            const response = await axios.get<Location[]>("http://localhost:5000/locations");
            setLocations(response.data);
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchLocations();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/group", {
                group_name,
                group_leader_id,
                workout_type,
                location,
                scheduled_time,
                duration,
            });
            console.log("Group created:", response.data);
            set_group_name("");
            set_group_leader_id("");
            set_workout_type("");
            set_location("");
            set_scheduled_time("");
            set_duration("");
        } catch (error) {
            console.error("Error creating group:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100">
            <h1 className="text-2xl font-bold mb-4">Create New Group</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Group Name"
                    value={group_name}
                    onChange={(e) => set_group_name(e.target.value)}
                    className="border p-2 rounded w-full"
                    required
                />
                <select
                    value={group_leader_id}
                    onChange={(e) => set_group_leader_id(e.target.value)}
                    className="border p-2 rounded w-full"
                    required
                >
                    <option value="" disabled>Select Group Leader</option>
                    {users.map((user) => (
                        <option key={user.ID} value={user.ID}>
                            {user.FirstName} {user.LastName} ({user.Email})
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Workout Type"
                    value={workout_type}
                    onChange={(e) => set_workout_type(e.target.value)}
                    className="border p-2 rounded w-full"
                    required
                />
                <select
                    value={location}
                    onChange={(e) => set_location(e.target.value)}
                    className="border p-2 rounded w-full"
                    required
                >
                    <option value="" disabled>Select Location</option>
                    {locations.map((location) => (
                        <option key={location.location_id} value={location.location_id}>
                            {location.location_name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Scheduled Time"
                    value={scheduled_time}
                    onChange={(e) => set_scheduled_time(e.target.value)}
                    className="border p-2 rounded w-full"
                    required
                />
                <input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={duration}
                    onChange={(e) => set_duration(e.target.value)}
                    className="border p-2 rounded w-full"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                    Create Group
                </button>
            </form>
        </div>
    );
};

export default CreateGroup;
