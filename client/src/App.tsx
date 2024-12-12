import { Link } from "react-router-dom";

const App = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100">
      <h1 className="text-4xl font-bold mb-6">User Management</h1>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row items-center justify-center my-2 space-x-2">
          <Link to="/create-user" className="bg-blue-500 text-white px-4 py-2 rounded">
            Create New User
          </Link>
          <Link to="/manage-user" className="bg-green-500 text-white px-4 py-2 rounded">
            Manage/View Existing Users
          </Link>
        </div>
        <div className="flex flex-row items-center justify-center space-x-2">
          <Link to="/create-group" className="bg-blue-500 text-white px-4 py-2 rounded">
            Create New Group
          </Link>
          <Link to="/manage-group" className="bg-green-500 text-white px-4 py-2 rounded">
            Manage/View Existing Group
          </Link>
          </div>
        <div className="flex flex-row items-center justify-center my-2 space-x-2">
          <Link to="/view-report" className="bg-blue-500 text-white px-4 py-2 rounded">
            View Location Report
          </Link>
          </div>
      </div>
    </div>
  );
};

export default App;
