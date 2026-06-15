import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AuthLayout from "../Components/AuthLayout.jsx";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import API from "../../../lib/secureApi.js";
import { Mail, Lock, ArrowRight, Github, Chrome, Twitter, Sparkles } from "lucide-react";

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
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/users/login", data);
      const userData = res.data;
      if (userData?.user) {
        login({
          ...userData.user,
          token: userData.accessToken,
          refreshToken: userData.refreshToken,
        });
      } else {
        login(userData);
      }
      navigate("/feed");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed ❌");
    }
  };

  const handleAutofillDemo = () => {
    setValue("email", "demo@example.com", { shouldValidate: true });
    setValue("password", "password123", { shouldValidate: true });
    setTimeout(() => {
      handleSubmit(onSubmit)();
    }, 100);
  };

  return (
    <AuthLayout title="Welcome Back 👋" subtitle="Enter your credentials to access your account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Sandbox Indicator */}
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-xs text-muted-foreground space-y-2 relative overflow-hidden font-medium">
          <div className="flex items-center gap-1.5 font-bold text-primary text-[10px] uppercase tracking-wider">
            <Sparkles size={12} className="animate-pulse" /> Sandbox Mode Active
          </div>
          <p className="leading-normal text-[11px]">
            No running backend required. Click below to prefill demo credentials and sign in instantly.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={handleAutofillDemo}
            className="w-full h-9 rounded-lg border-primary/25 hover:bg-primary/10 text-[11px] font-black uppercase tracking-wider text-primary gap-1 cursor-pointer"
          >
            Autofill & Sign In
          </Button>
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
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</Label>
            <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
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
          className="w-full h-12 text-sm font-bold rounded-xl shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2"
        >
          Sign In
          <ArrowRight className="h-4 w-4" />
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background/60 backdrop-blur-sm px-3 text-muted-foreground/60 font-medium tracking-wider">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button type="button" className="flex items-center justify-center h-11 rounded-xl border border-border/40 bg-muted/10 hover:bg-muted/30 transition-all group">
            <Chrome className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
          <button type="button" className="flex items-center justify-center h-11 rounded-xl border border-border/40 bg-muted/10 hover:bg-muted/30 transition-all group">
            <Github className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
          <button type="button" className="flex items-center justify-center h-11 rounded-xl border border-border/40 bg-muted/10 hover:bg-muted/30 transition-all group">
            <Twitter className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-primary font-bold hover:underline transition-all">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
