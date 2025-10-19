import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AuthLayout from "../Components/AuthLayout.jsx";
import { useNavigate, Link } from "react-router-dom";
import API from "../../../lib/api.js";

const registerSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 chars"),
});

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async(data) => {
    try {
    const res = await API.post("/users/create", data);
    alert("Registration successful ✅");
    navigate("/login");
  } catch (err) {
    alert(err.response?.data?.message || "Registration failed ❌");
  }
  };

  return (
    <AuthLayout title="Create Account 📝" subtitle="Join our blogging community">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label className="mb-2">Full Name</Label>
          <Input type="text" {...register("name")} placeholder="Anshul Kumar" />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label className="mb-2">Email</Label>
          <Input type="email" {...register("email")} placeholder="you@example.com" />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label className="mb-2" >Password</Label>
          <Input type="password" {...register("password")} placeholder="••••••••" />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full border-black hover:bg-black hover:text-white">
          Register
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
