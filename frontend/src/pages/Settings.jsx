import "../styles/Settings.css"
import React, { useState } from 'react';
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";

function Settings() {

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const navigate = useNavigate();
    const handleDelete = () => {
        
            
        const token = localStorage.getItem(ACCESS_TOKEN);
        axios.delete("http://localhost:8000/auth/delete", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log("Deleted", res.data);
            navigate('/register');
        })
        .catch((err) => console.error(err));
       
        setIsPopupOpen(false);
    };

    const handleReset = () => {
        if (newPassword != confirm) {
            alert("Passwords do not match");
            return;
        }

        const token = localStorage.getItem(ACCESS_TOKEN)
        try {

        
            const res = axios.post("http://localhost:8000/auth/reset", {
                oldPassword,
                newPassword,
                confirm
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        
            console.log("RESET", res.data);
            navigate('/dashboard');
        } catch(err) {
            console.error("Reset Failed", err);
        }
       
        setIsResetOpen(false);
    }

    return (
        <>
            <div className="deleteAcc">
                <a href="#" onClick={(e) => { e.preventDefault(); setIsPopupOpen(true); }}>
                    Delete Acc
                </a>
            </div>
            <div className="resetPass">
                <a href="#" onClick={(e) => {e.preventDefault(); setIsResetOpen(true); }}>Reset Password</a>
            </div>

       
            {isPopupOpen && (
                <div className="modal show fade d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Account Deletion</h5>
                                <button type="button" className="btn-close" onClick={() => setIsPopupOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>This action will permanently delete your account. Are you sure?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={handleDelete}>Yes, delete</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsPopupOpen(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isResetOpen && (
                <div className="modal show fade d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Reset Password</h5>
                                <button type="button" className="btn-close" onClick={() => setIsResetOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label">Old Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">New Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={confirm}
                                            onChange={(e) => setConfirm(e.target.value)}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleReset}
                                >
                                    Reset Password
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setIsResetOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}

export default Settings;