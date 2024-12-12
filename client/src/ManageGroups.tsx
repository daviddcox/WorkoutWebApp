import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  ID: number;
  Email: string;
  FirstName: string;
  LastName: string;
  Purdue_ID: string;
}

interface Group {
  groupId: number;
  groupName: string;
  groupLeaderId: number;
  workoutType: string;
  location: number;
  scheduledTime: string;
  duration: number;
}

interface Location {
  location_id: number;
  location_name: string;
  address: string;
  indoor: boolean;
  max_capacity: number;
}

const ManageGroups: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groupName, setGroupName] = useState("");
  const [groupLeaderId, setGroupLeaderId] = useState<number | "">("");
  const [workoutType, setWorkoutType] = useState("");
  const [location, setLocation] = useState<number | "">("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [duration, setDuration] = useState<number | "">("");
  const [locations, setLocations] = useState<Location[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>("http://localhost:5000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get<Group[]>("http://localhost:5000/groups");
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
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
    fetchGroups();
    fetchLocations();
  }, []);

  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const groupId = Number(event.target.value);
    const group = groups.find((g) => g.groupId === groupId) || null;
    setSelectedGroup(group);
    if (group) {
      setGroupName(group.groupName);
      setGroupLeaderId(group.groupLeaderId);
      setWorkoutType(group.workoutType);
      setLocation(group.location);
      setScheduledTime(group.scheduledTime);
      setDuration(group.duration);
    } else {
      setGroupName("");
      setGroupLeaderId("");
      setWorkoutType("");
      setLocation("");
      setScheduledTime("");
      setDuration("");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedGroup) {
      try {
        await axios.put(`http://localhost:5000/groups/${selectedGroup.groupId}`, {
          groupName,
          groupLeaderId,
          workoutType,
          location,
          scheduledTime,
          duration,
        });
        fetchGroups();
        setSelectedGroup(null);
        setGroupName("");
        setGroupLeaderId("");
        setWorkoutType("");
        setLocation("");
        setScheduledTime("");
        setDuration("");
      } catch (error) {
        console.error("Error updating group:", error);
      }
    }
  };

  const handleDeleteGroup = async () => {
    if (selectedGroup) {
      try {
        await axios.delete(`http://localhost:5000/groups/${selectedGroup.groupId}`);
        fetchGroups();
        setSelectedGroup(null);
        setGroupName("");
        setGroupLeaderId("");
        setWorkoutType("");
        setLocation("");
        setScheduledTime("");
        setDuration("");
      } catch (error) {
        console.error("Error deleting group:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100">
      <h1 className="text-2xl font-bold mb-4">Manage Existing Groups</h1>
      <select
        value={selectedGroup ? selectedGroup.groupId : ""}
        onChange={handleGroupChange}
        className="p-2 border rounded mb-4"
      >
        <option value="" disabled>
          Select a group to edit/view
        </option>
        {groups.map((group) => (
          <option key={group.groupId} value={group.groupId}>
            {group.groupName}
          </option>
        ))}
      </select>

      {selectedGroup && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <select
            value={groupLeaderId}
            onChange={(e) => setGroupLeaderId(Number(e.target.value))}
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
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <select
            value={location}
            onChange={(e) => setLocation(Number(e.target.value))}
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
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="border p-2 rounded w-full"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
            Update Group
          </button>
          <button
            type="button"
            onClick={handleDeleteGroup}
            className="bg-red-500 text-white px-4 py-2 rounded w-full"
          >
            Delete Group
          </button>
        </form>
      )}
    </div>
  );
};

export default ManageGroups;
