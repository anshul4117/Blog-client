import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AuthLayout from "../Components/AuthLayout.jsx";
import { useNavigate, Link } from "react-router-dom";
import API from "../../../lib/secureApi.js";

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

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/users/create", data);
      // alert("Registration successful ✅");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed ❌");
    }
  };

  return (
    <AuthLayout title="Create Account 📝" subtitle="Join our community of writers today">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label className="text-base">Full Name</Label>
          <Input
            type="text"
            {...register("name")}
            placeholder="John Doe"
            className="h-12 bg-muted/30 border-border/60 focus:ring-primary/20 transition-all rounded-xl"
          />
          {errors.name && (
            <p className="text-red-500 text-sm font-medium">{errors.name.message}</p>
          )}
        </div>

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
          <Label className="text-base" >Password</Label>
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
          className="w-full h-12 text-base font-bold rounded-xl shadow-lg hover:shadow-primary/25 transition-all bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
        >
          Get Started
        </Button>

        <p className="text-center text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-bold hover:underline transition-all">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
