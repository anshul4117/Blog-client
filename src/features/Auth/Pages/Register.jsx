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
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, ArrowRight, ArrowLeft, Check, ShieldCheck, ShieldAlert } from "lucide-react";

const INTEREST_OPTIONS = ["Tech", "Design", "Writing", "Coding", "Lifestyle", "Crypto", "Gaming", "Marketing"];

const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  interests: z.array(z.string()).optional().default([]),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the Terms of Service"
  })
});

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    x: direction < 0 ? 40 : -40,
    opacity: 0
  })
};

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      interests: [],
      agreeTerms: false
    }
  });

  const selectedInterests = watch("interests") || [];

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setValue("interests", selectedInterests.filter(i => i !== interest));
    } else {
      setValue("interests", [...selectedInterests, interest]);
    }
  };

  const handleNext = async () => {
    let fields = [];
    if (step === 1) fields = ["name", "username"];
    if (step === 2) fields = ["email", "password"];
    
    const isValid = await trigger(fields);
    if (isValid) {
      setDirection(1);
      setStep(s => s + 1);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        interests: data.interests
      };
      await API.post("/users/create", formattedData);
      navigate("/login");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Registration failed ❌");
      setTimeout(() => setErrorMsg(""), 4000);
    }
  };

  return (
    <AuthLayout title="Create Account 📝" subtitle="Join our community of writers today">
      {errorMsg && (
        <div className="mb-6 p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-bold flex items-center gap-2">
          <ShieldAlert size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {/* Step Progress Timeline */}
      <div className="relative flex items-center justify-between mb-8 px-2">
        {/* Background connection bar */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-border/20 z-0" />
        {/* Active filled progress bar */}
        <div 
          className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-primary z-0 transition-all duration-300"
          style={{ width: `${(step - 1) * 50}%` }} 
        />
        
        {[
          { id: 1, label: "Identity", icon: User },
          { id: 2, label: "Security", icon: Lock },
          { id: 3, label: "Preferences", icon: ShieldCheck }
        ].map((s) => {
          const Icon = s.icon;
          const isCompleted = step > s.id;
          const isActive = step === s.id;
          return (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-1.5">
              <div 
                className={`h-8 w-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  isCompleted 
                    ? "bg-primary border-primary text-white scale-100" 
                    : isActive 
                      ? "bg-background border-primary text-primary ring-4 ring-primary/10 scale-110" 
                      : "bg-background border-border/40 text-muted-foreground/40"
                }`}
              >
                {isCompleted ? <Check className="h-4.5 w-4.5 stroke-[3]" /> : <Icon className="h-4 w-4" />}
              </div>
              <span className={`text-[10px] font-bold tracking-wider uppercase transition-colors duration-300 ${
                isActive || isCompleted ? "text-primary font-black" : "text-muted-foreground/40"
              }`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="space-y-6 py-2"
          >
            {step === 1 && (
              <>
                {/* Name */}
                <div className="relative group">
                  <Label htmlFor="name" className="absolute -top-2.5 left-4 px-2 bg-background text-[10px] font-black uppercase tracking-[0.2em] text-primary z-10">Full Name</Label>
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="name"
                    type="text"
                    {...register("name")}
                    placeholder="John Doe"
                    className="h-13 pl-11 bg-muted/20 border-primary/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all rounded-xl text-foreground font-medium"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs font-semibold mt-1 ml-2">{errors.name.message}</p>
                  )}
                </div>

                {/* Username */}
                <div className="relative group">
                  <Label htmlFor="username" className="absolute -top-2.5 left-4 px-2 bg-background text-[10px] font-black uppercase tracking-[0.2em] text-primary z-10">Username / Handle</Label>
                  <span className="absolute left-4.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground/60 group-focus-within:text-primary transition-colors">@</span>
                  <Input
                    id="username"
                    type="text"
                    {...register("username")}
                    placeholder="johndoe"
                    className="h-13 pl-8 bg-muted/20 border-primary/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all rounded-xl text-foreground font-medium"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs font-semibold mt-1 ml-2">{errors.username.message}</p>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full h-13 text-sm font-black uppercase tracking-widest rounded-xl shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                {/* Email */}
                <div className="relative group">
                  <Label htmlFor="email" className="absolute -top-2.5 left-4 px-2 bg-background text-[10px] font-black uppercase tracking-[0.2em] text-primary z-10">Email Address</Label>
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="name@example.com"
                    className="h-13 pl-11 bg-muted/20 border-primary/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all rounded-xl text-foreground font-medium"
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
                    {...register("password")}
                    placeholder="••••••••"
                    className="h-13 pl-11 bg-muted/20 border-primary/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all rounded-xl text-foreground font-medium"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs font-semibold mt-1 ml-2">{errors.password.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-5 gap-3 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="col-span-2 h-13 rounded-xl border-border/40 hover:bg-muted/10 font-bold cursor-pointer"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="col-span-3 h-13 text-sm font-black uppercase tracking-widest rounded-xl shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                {/* Interests */}
                <div className="space-y-3">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Your Interests (Optional)</Label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {INTEREST_OPTIONS.map((interest) => {
                      const isSelected = selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                            isSelected 
                              ? "bg-primary border-primary text-white shadow-md shadow-primary/25 scale-105" 
                              : "bg-muted/10 border-border/40 text-muted-foreground hover:bg-muted/20"
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      {...register("agreeTerms")}
                      className="h-4.5 w-4.5 rounded border-border/50 text-primary focus:ring-primary/30 mt-0.5 cursor-pointer accent-primary"
                    />
                    <Label htmlFor="agreeTerms" className="text-xs font-medium text-muted-foreground leading-normal cursor-pointer">
                      I agree to the <Link to="/terms" className="text-primary hover:underline font-bold">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline font-bold">Privacy Policy</Link>.
                    </Label>
                  </div>
                  {errors.agreeTerms && (
                    <p className="text-red-500 text-xs font-semibold mt-1 ml-2">{errors.agreeTerms.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-5 gap-3 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="col-span-2 h-13 rounded-xl border-border/40 hover:bg-muted/10 font-bold cursor-pointer"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="col-span-3 h-13 text-sm font-black uppercase tracking-widest rounded-xl shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? "Registering..." : (
                      <>
                        Complete
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer link */}
        <p className="text-center text-sm text-muted-foreground mt-6 font-semibold">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-black hover:underline transition-all">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
