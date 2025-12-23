import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import AuthLayout from "../Components/AuthLayout.jsx";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import API from "../../../lib/secureApi.js"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 chars"),
});


export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/users/login", data);
      const userData = res.data;
      console.log(userData)
      login(userData); // context function
      // alert("Login successful ✅"); // Removed alert for smoother flow
      navigate("/feed");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed ❌")
    }
  };

  return (
    <AuthLayout title="Welcome Back 👋" subtitle="Enter your credentials to access your account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label className="text-base">Email</Label>
          <Input
            type="email"
            {...register("email")}
            placeholder="name@example.com"
            className="h-12 bg-muted/30 border-border/60 focus:ring-primary/20 transition-all rounded-xl"
          />
          {errors.email && (
            <p className="text-red-500 text-sm font-medium">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base">Password</Label>
            <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            {...register("password")}
            placeholder="••••••••"
            className="h-12 bg-muted/30 border-border/60 focus:ring-primary/20 transition-all rounded-xl"
          />
          {errors.password && (
            <p className="text-red-500 text-sm font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-base font-bold rounded-xl shadow-lg hover:shadow-primary/25 transition-all"
        >
          Sign In
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <p className="text-center text-muted-foreground">
          Don’t have an account?{" "}
          <Link to="/register" className="text-primary font-bold hover:underline transition-all">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
