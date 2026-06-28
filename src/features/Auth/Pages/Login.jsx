import { useState } from "react";
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
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Github, Chrome, Twitter, Sparkles, ShieldAlert, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

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
    formState: { errors, isSubmitting },
  } = useForm({ 
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const [errorMsg, setErrorMsg] = useState("");

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
      toast.success("Welcome back! ✨");
      navigate("/feed");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed ❌";
      setErrorMsg(message);
      toast.error(message);
      setTimeout(() => setErrorMsg(""), 4000);
    }
  };

  const handleAutofillDemo = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isSubmitting) return;
    setValue("email", "demo@example.com", { shouldValidate: true });
    setValue("password", "password123", { shouldValidate: true });
    setTimeout(() => {
      handleSubmit(onSubmit)();
    }, 100);
  };

  const handleSocialLogin = (platform) => {
    toast.success(`${platform} authentication simulated in Sandbox mode. Prefilling credentials... ✨`);
    setTimeout(() => {
      handleAutofillDemo();
    }, 600);
  };

  return (
    <AuthLayout title="Welcome Back 👋" subtitle="Enter your credentials to access your account">
      <motion.form 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-6"
      >
        {errorMsg && (
          <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-bold flex items-center gap-2">
            <ShieldAlert size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
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
            disabled={isSubmitting}
            className="w-full h-9 rounded-lg border-primary/25 hover:bg-primary/10 text-[11px] font-black uppercase tracking-wider text-primary gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Autofill & Sign In
          </Button>
        </div>

        {/* Email */}
        <div className="relative group">
          <Label htmlFor="email" className="absolute -top-2.5 left-4 px-2 bg-background text-[10px] font-black uppercase tracking-[0.2em] text-primary z-10">Email Address</Label>
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
          <Input
            id="email"
            type="email"
            autoFocus
            disabled={isSubmitting}
            {...register("email")}
            placeholder="name@example.com"
            className="h-13 pl-11 bg-muted/20 border-primary/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all rounded-xl text-foreground font-medium disabled:opacity-50"
          />
          {errors.email && (
            <p className="text-red-500 text-xs font-semibold mt-1 ml-2">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative group">
          <Label htmlFor="password" className="absolute -top-2.5 left-4 px-2 bg-background text-[10px] font-black uppercase tracking-[0.2em] text-primary z-10">Password</Label>
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors z-10" />
          <PasswordInput
            id="password"
            disabled={isSubmitting}
            {...register("password")}
            placeholder="••••••••"
            className="h-13 pl-11 bg-muted/20 border-primary/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all rounded-xl text-foreground font-medium disabled:opacity-50"
          />
          {errors.password && (
            <p className="text-red-500 text-xs font-semibold mt-1 ml-2">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-end text-xs">
          <Link to="/forgot-password" style={{ color: "var(--color-primary)" }} className="font-semibold hover:underline">
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-13 text-sm font-black uppercase tracking-widest rounded-xl shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background/60 backdrop-blur-sm px-3 text-muted-foreground/60 font-semibold tracking-wider">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button 
            type="button" 
            disabled={isSubmitting}
            onClick={() => handleSocialLogin("Google")}
            className="flex items-center justify-center h-11 rounded-xl border border-primary/10 bg-muted/10 hover:bg-muted/30 transition-all group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Chrome className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
          <button 
            type="button" 
            disabled={isSubmitting}
            onClick={() => handleSocialLogin("GitHub")}
            className="flex items-center justify-center h-11 rounded-xl border border-primary/10 bg-muted/10 hover:bg-muted/30 transition-all group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Github className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
          <button 
            type="button" 
            disabled={isSubmitting}
            onClick={() => handleSocialLogin("Twitter")}
            className="flex items-center justify-center h-11 rounded-xl border border-primary/10 bg-muted/10 hover:bg-muted/30 transition-all group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Twitter className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-muted-foreground font-semibold">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-primary font-black hover:underline transition-all">
            Create an account
          </Link>
        </p>
      </motion.form>
    </AuthLayout>
  );
}
