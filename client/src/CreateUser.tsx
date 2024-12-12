import React, { useState } from "react";
import axios from "axios";

const CreateUser = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [purdueID, setPurdueID] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/users", {
                "first_name": firstName,
                "last_name": lastName,
                "email": email,
                "purdue_id": purdueID,
            });
            console.log("User created:", response.data);
            setFirstName("");
            setEmail("");
            setPurdueID("");
            setLastName("");
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100">
            <h1 className="text-2xl font-bold mb-4">Create New User</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="lastName"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="purdueID"
                    placeholder="purdueID"
                    value={purdueID}
                    onChange={(e) => setPurdueID(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Create User
                </button>
            </form>
        </div>
    );
};

export default CreateUser;
