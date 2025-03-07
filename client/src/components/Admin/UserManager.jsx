import React, { useEffect, useState } from "react";
import {
    getUsers,
    addUser,
    updateUser,
    deleteUser,
} from "../../api/userApi"; // Import API

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
        role: "user",
    });
    const [editUser, setEditUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await getUsers();
            setUsers(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách người dùng:", error);
        }
    };

    const handleAddUser = async () => {
        try {
            await addUser(newUser);
            fetchUsers();
            setNewUser({ username: "", email: "", password: "", role: "user" });
        } catch (error) {
            console.error("Lỗi khi thêm người dùng:", error);
        }
    };

    const handleEditUser = async () => {
        try {
            await updateUser(editUser._id, editUser);
            fetchUsers();
            setEditUser(null);
        } catch (error) {
            console.error("Lỗi khi cập nhật người dùng:", error);
        }
    };

    const handleDeleteUser = async () => {
        try {
            await deleteUser(userToDelete._id);
            fetchUsers();
            setUserToDelete(null);
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h2>Quản lý người dùng</h2>
                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addUserModal">
                    Thêm người dùng
                </button>
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button
                                    className="btn btn-warning me-2"
                                    data-bs-toggle="modal"
                                    data-bs-target="#editUserModal"
                                    onClick={() => setEditUser(user)}
                                >
                                    Sửa
                                </button>
                                <button
                                    className="btn btn-danger"
                                    data-bs-toggle="modal"
                                    data-bs-target="#deleteUserModal"
                                    onClick={() => setUserToDelete(user)}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal Thêm Người Dùng */}
            <div className="modal fade" id="addUserModal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Thêm người dùng</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            {["username", "email", "password"].map((field) => (
                                <div className="mb-2" key={field}>
                                    <label className="form-label">{field.toUpperCase()}</label>
                                    <input
                                        type={field === "password" ? "password" : "text"}
                                        className="form-control"
                                        value={newUser[field]}
                                        onChange={(e) => setNewUser({ ...newUser, [field]: e.target.value })}
                                    />
                                </div>
                            ))}
                            <div className="mb-2">
                                <label className="form-label">Vai trò</label>
                                <select
                                    className="form-control"
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary" onClick={handleAddUser} data-bs-dismiss="modal">
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Sửa Người Dùng */}
            <div className="modal fade" id="editUserModal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Chỉnh sửa người dùng</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            {editUser &&
                                ["username", "email"].map((field) => (
                                    <div className="mb-2" key={field}>
                                        <label className="form-label">{field.toUpperCase()}</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editUser[field]}
                                            onChange={(e) =>
                                                setEditUser({ ...editUser, [field]: e.target.value })
                                            }
                                        />
                                    </div>
                                ))}
                            <div className="mb-2">
                                <label className="form-label">Vai trò</label>
                                <select
                                    className="form-control"
                                    value={editUser?.role || "user"}
                                    onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary" onClick={handleEditUser} data-bs-dismiss="modal">
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Xóa Người Dùng */}
            <div className="modal fade" id="deleteUserModal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Xác nhận xóa</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">Bạn có chắc chắn muốn xóa người dùng này không?</div>
                        <div className="modal-footer">
                            <button className="btn btn-danger" onClick={handleDeleteUser} data-bs-dismiss="modal">
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManager;
