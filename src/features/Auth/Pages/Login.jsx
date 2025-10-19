import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import AuthLayout from "../Components/AuthLayout.jsx";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import API from "../../../lib/api.js"

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

  const onSubmit = async(data) => {
     try {
    const res = await API.post("/users/login", data);
    const userData = res.data;
    console.log(userData)
    login(userData); // context function
    alert("Login successful ✅");
    navigate("/");
  } catch (err) {
    alert(err.response?.data?.message || "Login failed ❌")
  }
  };

  return (
    <AuthLayout title="Welcome Back 👋" subtitle="Login to your account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label>Email</Label>
          <Input type="email" {...register("email")} placeholder="you@example.com" />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label>Password</Label>
          <Input type="password" {...register("password")} placeholder="••••••••" />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full border-black hover:bg-black hover:text-white">
          Login
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Don’t have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
