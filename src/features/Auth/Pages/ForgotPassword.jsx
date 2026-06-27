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
import API from "../../../lib/secureApi.js";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Key, ArrowRight, ArrowLeft, Sparkles, CheckCircle, ShieldAlert } from "lucide-react";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Request, 2 = Reset
  const [targetEmail, setTargetEmail] = useState("");
  const [simulatedToken, setSimulatedToken] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Step 1: Request Form
  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors, isSubmitting: isForgotSubmitting },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  // Step 2: Reset Form
  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    setValue: setResetValue,
    formState: { errors: resetErrors, isSubmitting: isResetSubmitting },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onForgotSubmit = async (data) => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await API.post("/users/forgot-password", data);
      if (res.data?.success) {
        setTargetEmail(data.email);
        setSimulatedToken(res.data?.resetToken || "RESET-123456");
        setSuccessMsg("Reset code simulated successfully! 📨");
        setTimeout(() => {
          setStep(2);
        }, 800);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "No account found with this email ❌");
    }
  };

  const onResetSubmit = async (data) => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const payload = {
        email: targetEmail,
        token: data.token,
        password: data.password,
      };
      const res = await API.post("/users/reset-password", payload);
      if (res.data?.success) {
        setSuccessMsg("Password updated successfully! Redirecting to login... 🔑");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Password reset failed. Please check the token ❌");
    }
  };

  const handleAutofillToken = () => {
    setResetValue("token", simulatedToken, { shouldValidate: true });
  };

  return (
    <AuthLayout 
      title={step === 1 ? "Reset Password 🔑" : "New Credentials 🔒"} 
      subtitle={step === 1 ? "Recover your account credentials" : `Set a new password for ${targetEmail}`}
    >
      <div className="space-y-6">
        {/* Error / Success Notifications */}
        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-bold flex items-center gap-2"
            >
              <ShieldAlert size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-xs font-bold flex items-center gap-2"
            >
              <CheckCircle size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="forgot-step-1"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleForgotSubmit(onForgotSubmit)}
              className="space-y-6"
            >
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-xs text-muted-foreground space-y-1.5 font-medium leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-primary text-[10px] uppercase tracking-wider mb-1">
                  <Sparkles size={12} className="animate-pulse" /> Password Recovery Emulation
                </div>
                Enter your registered email address (e.g. <span className="font-bold text-primary">demo@example.com</span>). The mock server will immediately verify it and generate a local reset token.
              </div>

              {/* Email Address */}
              <div className="relative group">
                <Label htmlFor="email" className="absolute -top-2.5 left-4 px-2 bg-background text-[10px] font-black uppercase tracking-[0.2em] text-primary z-10">Email Address</Label>
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  {...registerForgot("email")}
                  placeholder="name@example.com"
                  className="h-13 pl-11 bg-muted/20 border-primary/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all rounded-xl text-foreground font-medium"
                />
                {forgotErrors.email && (
                  <p className="text-red-500 text-xs font-semibold mt-1 ml-2">{forgotErrors.email.message}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={isForgotSubmitting}
                  className="w-full h-13 text-sm font-black uppercase tracking-widest rounded-xl shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer bg-primary text-white"
                >
                  {isForgotSubmitting ? "Verifying..." : "Send Reset Token"}
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Link to="/login" className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-all py-1.5">
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="forgot-step-2"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleResetSubmit(onResetSubmit)}
              className="space-y-6"
            >
              {/* Sandbox Helper Alert */}
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-xs text-muted-foreground space-y-2.5 font-medium leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-primary text-[10px] uppercase tracking-wider">
                  <Sparkles size={12} className="animate-pulse" /> Sandbox Token Generated
                </div>
                <p>We simulated sending the token <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-black text-sm">{simulatedToken}</code> to your email address.</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAutofillToken}
                  className="w-full h-9 rounded-lg border-primary/25 hover:bg-primary/10 text-[11px] font-black uppercase tracking-wider text-primary gap-1.5 cursor-pointer"
                >
                  <Key size={12} /> Auto-fill Security Token
                </Button>
              </div>

              {/* Reset Token Input */}
              <div className="relative group">
                <Label htmlFor="token" className="absolute -top-2.5 left-4 px-2 bg-background text-[10px] font-black uppercase tracking-[0.2em] text-primary z-10">Security Token</Label>
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                <Input
                  id="token"
                  type="text"
                  {...registerReset("token")}
                  placeholder="RESET-XXXXXX"
                  className="h-13 pl-11 bg-muted/20 border-primary/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all rounded-xl text-foreground font-medium uppercase"
                />
                {resetErrors.token && (
                  <p className="text-red-500 text-xs font-semibold mt-1 ml-2">{resetErrors.token.message}</p>
                )}
              </div>

              {/* New Password */}
              <div className="relative group">
                <Label htmlFor="password" className="absolute -top-2.5 left-4 px-2 bg-background text-[10px] font-black uppercase tracking-[0.2em] text-primary z-10">New Password</Label>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors z-10" />
                <PasswordInput
                  id="password"
                  {...registerReset("password")}
                  placeholder="••••••••"
                  className="h-13 pl-11 bg-muted/20 border-primary/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all rounded-xl text-foreground font-medium"
                />
                {resetErrors.password && (
                  <p className="text-red-500 text-xs font-semibold mt-1 ml-2">{resetErrors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative group">
                <Label htmlFor="confirmPassword" className="absolute -top-2.5 left-4 px-2 bg-background text-[10px] font-black uppercase tracking-[0.2em] text-primary z-10">Confirm Password</Label>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors z-10" />
                <PasswordInput
                  id="confirmPassword"
                  {...registerReset("confirmPassword")}
                  placeholder="••••••••"
                  className="h-13 pl-11 bg-muted/20 border-primary/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all rounded-xl text-foreground font-medium"
                />
                {resetErrors.confirmPassword && (
                  <p className="text-red-500 text-xs font-semibold mt-1 ml-2">{resetErrors.confirmPassword.message}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={isResetSubmitting}
                  className="w-full h-13 text-sm font-black uppercase tracking-widest rounded-xl shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer bg-primary text-white"
                >
                  {isResetSubmitting ? "Resetting..." : "Reset Password"}
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    setSuccessMsg("");
                    setStep(1);
                  }}
                  className="w-full flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-all py-1.5 cursor-pointer"
                >
                  <ArrowLeft size={14} /> Request New Token
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
}
