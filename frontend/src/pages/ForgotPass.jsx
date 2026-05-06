import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Lock } from "lucide-react";
import { useForm } from 'react-hook-form';
import api from '../api';


export function ForgotPass() {
  const navigate = useNavigate();
  

  const { handleSubmit, register, formState: {errors}, watch } = useForm({mode: 'onChange'});

  const newPassword = watch("newPassword", "");
  const confirmPassword = watch("confirmPassword", "");
  const isValidPassword = newPassword.length >= 8 && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword);
  const isValidPass2 = confirmPassword === newPassword;
  const path = window.location.pathname;
  const parts = path.split('/');

  const uidb64 = parts[2];
  const token = parts[3];


  const handleSubmit1 =  async (data) => {
    try {
        const res = await api.post("/set-new-pass", {
            newPassword: data.newPassword,
            uidb64: uidb64,
            token: token
        }, { headers: {
            "Content-Type": "application/json"
        }});
        navigate('/login');
    } catch (err) {
        console.error("Failed at forgot pass: ", err.response?.data || err.message);
    } 
  };

  

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-xl border-0 ring-1 ring-gray-200">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-full">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Password reset</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(handleSubmit1)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register("newPassword", {
                        required: true,
                        minLength: 8,
                        pattern: /^(?=.*[A-Z])(?=.*[0-9]).*$/
                    })}
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    className="!pl-12"
                  />
                </div>
                <p className={newPassword.length === 0 ? "text-sm text-gray-400" : newPassword.length >= 8 ? "text-sm text-green-500" : "text-sm text-red-500"}>
                    • At least 8 characters
                  </p>
                  <p className={newPassword.length === 0 ? "text-sm text-gray-400" : /[A-Z]/.test(newPassword) ? "text-sm text-green-500" : "text-sm text-red-500"}>
                    • One uppercase letter
                  </p>
                  <p className={newPassword.length === 0 ? "text-sm text-gray-400" : /[0-9]/.test(newPassword) ? "text-sm text-green-500" : "text-sm text-red-500"}>
                    • One number
                  </p>
              </div>

              <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
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
                    className="!pl-12"
                  />
                </div>
                <p className={confirmPassword.length === 0 ? "text-sm text-gray-400" : newPassword === confirmPassword? "text-sm text-green-500" : "text-sm text-red-500"}>
                    • Passwords match
                  </p>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" disabled={!isValidPassword || !isValidPass2}>
                Change
              </Button>
            </form>
          </CardContent>

          
        </Card>
      </div>

    </div>
  );
}

export default ForgotPass;