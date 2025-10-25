import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import API from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function Settings() {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await API.put(`/users/profile/${user.id}`, formData);
      login(res.data.user); // Update user in context
      alert("Profile updated successfully ✅");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardContent className="p-6 space-y-5">
          <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>

          <div>
            <Label>Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled
            />
          </div>

          <div>
            <Label>Avatar URL</Label>
            <Input
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          {formData.avatar && (
            <img
              src={formData.avatar}
              alt="Avatar preview"
              className="w-20 h-20 rounded-full border object-cover"
            />
          )}

          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full mt-4"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
