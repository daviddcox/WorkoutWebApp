import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import CreateUser from "./CreateUser";
import ManageUsers from "./ManageUsers";
import CreateGroup from "./CreateGroup";
import ManageGroups from "./ManageGroups";
import ViewReport from "./LocationReport";

import "./index.css";

const Main = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/manage-user" element={<ManageUsers />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/manage-group" element={<ManageGroups />} />
        <Route path="/view-report" element={<ViewReport />} />
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<Main />);
