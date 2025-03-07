// UserLayout.jsx
import { Outlet } from "react-router-dom";
import UserNavbar from '../Layout/UserNavbar'
function UserLayout() {
    return (
        <div className="bg-gray-100 min-h-screen">
            <UserNavbar />
            <Outlet />
        </div>
    );
}

export default UserLayout;
