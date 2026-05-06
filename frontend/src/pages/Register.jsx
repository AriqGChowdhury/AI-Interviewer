import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { UserPlus, Mail, Lock, User, Asterisk } from "lucide-react";
import api from '../api.js';

export function Register() {

  const { handleSubmit, register, formState: {errors}, watch, setError, clearErrors } = useForm({mode: 'onChange'});

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");
  const email = watch("email", "");
  const username = watch("username", "");

  const isValidPassword = password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  const isValidPass2 = confirmPassword === password;
  const isValidEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
  const isValidUser = username.length > 0;

  const navigate = useNavigate();
  const getErrorMap = (err) => {
    const data = err.response?.data;
  
    return data?.error || data?.message || data || {};
  };

  const handleSubmit1 = async (data) => {
    console.log("DATA: ", data);
    if (data.password !== data.confirmPassword) {
      return;
    }
    try {
      const res = await api.post('register', {
        username: data.username,
        password: data.password,
        pass2: data.confirmPassword,
        email: data.email
      });
      console.log("RES: ", res);
      
      navigate("/login");
    } catch (err) {
      console.log("RAW ERROR:", err.response?.data);
      const errors = getErrorMap(err);    
      if (errors.message) {
        setError("email", {
          type: "server",
          message: errors.message[0],
        });
       
      } else if (errors.username) {
        setError("username", {
          type: "server",
          message: errors.username[0],
        });
      }
      return;
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-xl border-0 ring-1 ring-gray-200">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-full">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              Enter your information to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(handleSubmit1)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username<Asterisk size={16} color="#ff0000" strokeWidth={1.75} /></Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register("username", {
                      required: true,
                      minLength: 1
                    })}
                    id="username"
                    type="text"
                    placeholder="johndoe"                    
                    className="pl-10"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">
                      {errors.username.message}
                    </p>
                  )}
                </div>
                
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email<Asterisk size={16} color="#ff0000" strokeWidth={1.75} /></Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register("email", {
                      pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                      required: true
                    })}
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <p className={email.length === 0 ? "text-sm text-gray-400" : /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email) ? "text-sm text-green-500" : "text-sm text-red-500"}>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password<Asterisk size={16} color="#ff0000" strokeWidth={1.75} /></Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register("password", {
                      required: true,
                      minLength: 8,
                      pattern: /^(?=.*[A-Z])(?=.*[0-9]).*$/
                    })}
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
                  <p className={password.length === 0 ? "text-sm text-gray-400" : password.length >= 8 ? "text-sm text-green-500" : "text-sm text-red-500"}>
                    • At least 8 characters
                  </p>
                  <p className={password.length === 0 ? "text-sm text-gray-400" : /[A-Z]/.test(password) ? "text-sm text-green-500" : "text-sm text-red-500"}>
                    • One uppercase letter
                  </p>
                  <p className={password.length === 0 ? "text-sm text-gray-400" : /[0-9]/.test(password) ? "text-sm text-green-500" : "text-sm text-red-500"}>
                    • One number
                  </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password<Asterisk size={16} color="#ff0000" strokeWidth={1.75} /></Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register("confirmPassword", { 
                      required: true,
                      minLength: 8,
                      pattern: /^(?=.*[A-Z])(?=.*[0-9]).*$/
                    })}
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
                  
                  <p className={confirmPassword.length === 0 ? "text-sm text-gray-400" : password === confirmPassword? "text-sm text-green-500" : "text-sm text-red-500"}>
                    • Passwords match
                  </p>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" disabled={!isValidEmail || !isValidPassword || !isValidPass2 || !isValidUser}>
                Create Account
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      
    </div>
  );
}

export default Register;