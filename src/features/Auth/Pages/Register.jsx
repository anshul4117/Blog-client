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
import { User, Mail, Lock, ArrowRight } from "lucide-react";

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
      await API.post("/users/create", data);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed ❌");
    }
  };

  return (
    <AuthLayout title="Create Account 📝" subtitle="Join our community of writers today">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col items-center gap-1.5">
            <div className="h-1 w-10 rounded-full bg-primary shadow-sm shadow-primary/40" />
            <span className="text-[10px] font-semibold tracking-wider text-primary uppercase">Identity</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="h-1 w-10 rounded-full bg-border/30" />
            <span className="text-[10px] font-semibold tracking-wider text-muted-foreground/50 uppercase">Security</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="h-1 w-10 rounded-full bg-border/30" />
            <span className="text-[10px] font-semibold tracking-wider text-muted-foreground/50 uppercase">Verify</span>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</Label>
          <div className="relative group">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              {...register("name")}
              placeholder="John Doe"
              className="h-12 pl-11 bg-muted/20 border-border/40 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs font-medium">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
            <Input
              type="email"
              {...register("email")}
              placeholder="name@example.com"
              className="h-12 pl-11 bg-muted/20 border-border/40 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</Label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors z-10" />
            <PasswordInput
              {...register("password")}
              placeholder="••••••••"
              className="h-12 pl-11 bg-muted/20 border-border/40 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full h-12 text-sm font-bold rounded-xl shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2 mt-2"
        >
          Get Started
          <ArrowRight className="h-4 w-4" />
        </Button>

        {/* Footer link */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-bold hover:underline transition-all">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
