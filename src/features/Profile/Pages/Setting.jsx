import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import API from "@/lib/secureApi.js";
import { useAuth } from "@/context/AuthContext";
import PageTransition from "@/components/layout/PageTransition";
import { User, Mail, Link as LinkIcon, ArrowLeft, Compass, Briefcase, Heart, Calendar, Github, Twitter, Linkedin, Globe, Sparkles, Bookmark, HelpCircle, LogOut, ChevronRight, LayoutGrid } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Settings() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    profession: "",
    gender: "",
    dob: "",
    profilePicture: "",
    github: "",
    twitter: "",
    website: "",
    linkedin: "",
    interests: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/profile");
        if (mounted) {
          const profileData = res.data?.getProfile || res.data?.data?.getProfile || {};
          setFormData({
            name: profileData.name || "",
            email: profileData.email || "",
            bio: profileData.bio || "",
            profession: profileData.profession || "",
            gender: profileData.gender || "",
            dob: profileData.dob ? new Date(profileData.dob).toISOString().split('T')[0] : "",
            profilePicture: profileData.profilePicture || "",
            github: profileData.socialLinks?.github || "",
            twitter: profileData.socialLinks?.twitter || "",
            website: profileData.socialLinks?.website || "",
            linkedin: profileData.socialLinks?.linkedin || "",
            interests: profileData.interests ? profileData.interests.join(", ") : "",
          });
        }
      } catch (err) {
        console.error("Error loading profile details:", err);
      } finally {
        if (mounted) setFetching(false);
      }
    };
    fetchProfile();
    return () => { mounted = false; };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        bio: formData.bio,
        profession: formData.profession || undefined,
        gender: formData.gender || undefined,
        dob: formData.dob || undefined,
        profilePicture: formData.profilePicture,
        interests: formData.interests ? formData.interests.split(",").map(i => i.trim()).filter(Boolean) : [],
        socialLinks: {
          github: formData.github,
          twitter: formData.twitter,
          website: formData.website,
          linkedin: formData.linkedin,
        }
      };

      const res = await API.patch("/users/update-user-profile", payload);
      const updatedUser = res.data?.user || res.data?.data?.user;
      
      if (updatedUser) {
        // Update user in context
        login({
          ...user,
          name: updatedUser.name,
          email: updatedUser.email,
          profilePicture: updatedUser.profilePicture,
          username: updatedUser.username || user?.username,
        });
      }
      alert("Profile updated successfully ✅");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed ❌");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <PageTransition className="flex items-center justify-center min-h-[50vh]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-lg shadow-primary/20"></div>
    </PageTransition>
  );

  return (
    <PageTransition className="max-w-4xl mx-auto py-8 px-4">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 pl-0 hover:bg-transparent hover:text-primary">
          <ArrowLeft size={18} /> Back
        </Button>
        <Link to="/feed">
          <Button variant="outline" className="gap-2">
            <Compass size={18} /> Explore
          </Button>
        </Link>
      </div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      {/* Mobile directory hub - (settings contains the rest remaining things) */}
      <Card className="rounded-[32px] glass-panel border-primary/10 overflow-hidden block md:hidden mb-8 shadow-2xl">
        <CardHeader className="bg-primary/5 border-b border-primary/5">
          <CardTitle className="text-xs font-black uppercase tracking-widest text-primary font-mono">Workspace Directory</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-2">
          <Link to="/dashboard" className="flex items-center justify-between p-3 rounded-2xl hover:bg-primary/5 transition-all group font-bold">
            <span className="flex items-center gap-3 text-sm text-foreground"><LayoutGrid size={18} className="text-primary" /> Creator Dashboard</span>
            <ChevronRight size={16} className="text-muted-foreground/60 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/dashboard/saved" className="flex items-center justify-between p-3 rounded-2xl hover:bg-primary/5 transition-all group font-bold">
            <span className="flex items-center gap-3 text-sm text-foreground"><Bookmark size={18} className="text-primary" /> Saved Publications</span>
            <ChevronRight size={16} className="text-muted-foreground/60 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/dashboard/help" className="flex items-center justify-between p-3 rounded-2xl hover:bg-primary/5 transition-all group font-bold">
            <span className="flex items-center gap-3 text-sm text-foreground"><HelpCircle size={18} className="text-primary" /> Support Center</span>
            <ChevronRight size={16} className="text-muted-foreground/60 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button onClick={logout} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-red-500/5 transition-all group font-bold text-left">
            <span className="flex items-center gap-3 text-sm text-red-500"><LogOut size={18} /> Terminate Session</span>
            <ChevronRight size={16} className="text-red-500/60 group-hover:translate-x-1 transition-transform" />
          </button>
        </CardContent>
      </Card>

      <Card className="rounded-[32px] glass-panel border-primary/10 overflow-hidden shadow-2xl">
        <CardHeader className="bg-primary/5 border-b border-primary/5">
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your photo and personal details here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex flex-col md:flex-row gap-6 pb-6 border-b border-border/20">
            <div className="relative h-20 w-20 shrink-0">
              <img
                src={formData.profilePicture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                alt="Avatar preview"
                className="rounded-2xl h-full w-full object-cover border border-primary/20"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="profilePicture">Avatar Image URL</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="profilePicture"
                  name="profilePicture"
                  value={formData.profilePicture}
                  onChange={handleChange}
                  placeholder="https://example.com/image.png"
                  className="pl-9 rounded-xl border-border/40 focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
              <p className="text-[0.8rem] text-muted-foreground">
                Enter a direct link to an image (e.g. Unsplash or GitHub avatar).
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-9 rounded-xl border-border/40 focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                  className="pl-9 rounded-xl bg-muted/50 border-border/40 text-muted-foreground/60"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">Mission Brief (Bio)</Label>
              <textarea
                id="bio"
                name="bio"
                maxLength={100}
                value={formData.bio}
                onChange={handleChange}
                placeholder="A short message describing your vision (max 100 characters)"
                className="w-full min-h-[80px] p-3 rounded-xl bg-muted/20 border border-border/40 focus:border-primary/50 focus:ring-primary/20 transition-all text-sm outline-none text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profession">Profession</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  id="profession"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="pl-9 h-12 w-full bg-muted/20 border border-border/40 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl text-sm outline-none text-foreground"
                >
                  <option value="" disabled>Select your profession</option>
                  <option value="Student">Student</option>
                  <option value="Engineer">Engineer</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Artist">Artist</option>
                  <option value="Actor">Actor</option>
                  <option value="Business">Business</option>
                  <option value="HelthCare">HealthCare</option>
                  <option value="Motivation">Motivation</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <div className="relative">
                <Heart className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="pl-9 h-12 w-full bg-muted/20 border border-border/40 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl text-sm outline-none text-foreground"
                >
                  <option value="" disabled>Select your gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  className="pl-9 rounded-xl border-border/40 focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Interests (comma-separated)</Label>
              <div className="relative">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="Design, Coding, Photography"
                  className="pl-9 rounded-xl border-border/40 focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2 pt-4 border-t border-border/20">
              <h3 className="font-bold text-sm text-foreground mb-4 uppercase tracking-widest text-primary/80">Social Signals</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub Link</Label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="github"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      placeholder="https://github.com/..."
                      className="pl-9 rounded-xl border-border/40 focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter Link</Label>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="twitter"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      placeholder="https://twitter.com/..."
                      className="pl-9 rounded-xl border-border/40 focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn Link</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/..."
                      className="pl-9 rounded-xl border-border/40 focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website Link</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      className="pl-9 rounded-xl border-border/40 focus:border-primary/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border/20">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="min-w-[140px] rounded-xl h-12 shadow-lg shadow-primary/20 font-bold"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageTransition>
  );
}
