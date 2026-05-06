import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { LogIn, Lock, User } from "lucide-react";
import api from '../api';


export function Login({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit =  async (e) => {
    e.preventDefault();
    try {
        const res = await api.post("/api/token/", {
            username: formData.username,
            password: formData.password,
        }, { headers: {
            "Content-Type": "application/json"
        }});

        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        const token = res.data.access;
        const userRes = await api.get('me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(userRes.data);
        navigate('/dashboard');
    } catch (err) {
        console.error("Failed at login: ", err.response?.data || err.message);
    } 
  };

  const handleForgotPass = async () => {
    const res = await api.post('forgotPass', {
      "username": formData.username
    })
    console.log("RES: ", res.data?.message);
    return;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-xl border-0 ring-1 ring-gray-200">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-full">
                <LogIn className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder=""
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="!pl-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a
                    onClick={handleForgotPass}
                    className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="!pl-12"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Sign In
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Create one
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

    </div>
  );
}

export default Login;