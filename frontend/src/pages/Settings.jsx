import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { KeyRound, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import React, { useState } from 'react';
import { ACCESS_TOKEN } from "../constants";
import api from "../api.js";

export function Settings({ user, setUser }) {
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleReset = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("New passwords do not match!");
        return;
    }

        const token = localStorage.getItem(ACCESS_TOKEN)
        try {
            const res = api.post("http://localhost:8000/reset", {
                oldPassword,
                newPassword,
                confirm
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        
            toast.success("Password reset successfully!");
            setShowResetPassword(false);
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            navigate('/dashboard');
        } catch(err) {
            console.error("Reset Failed", err);
        }
       
        setIsResetOpen(false);
    
  };

  const handleDelete = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    api.delete("http://localhost:8000/delete", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then((res) => {
        navigate('/register');
    })
    .catch((err) => console.error(err));
    setIsPopupOpen(false);
    toast.success("Account deletion request submitted");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <Toaster />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Profile Information
              </CardTitle>
              <CardDescription>View your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Username</Label>
                  <p className="text-gray-900 font-medium mt-1">{user?.username}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Email</Label>
                  <p className="text-gray-900 font-medium mt-1">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-purple-600" />
                Password & Security
              </CardTitle>
              <CardDescription>Keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              {!showResetPassword ? (
                <Button
                  onClick={() => setShowResetPassword(true)}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <KeyRound className="w-4 h-4 mr-2" />
                  Reset Password
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="••••••••"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleReset}>Update Password</Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowResetPassword(false);
                        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <Trash2 className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions that permanently affect your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto" style={{ backgroundColor: "#dc2626", color: "white" }}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent style={{backgroundColor:"white"}}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and
                      remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default Settings;