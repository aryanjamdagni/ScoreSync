import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "../../components/SectionHeader";
import { useToast } from "../../components/ToastProvider";
import { normalizeApiError } from "../../utils/apiError";
import { OwnerService } from "../../api/services";

export default function OwnerProfile() {
  const toast = useToast();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.push("Please enter both passwords.", "error");
      return;
    }

    setSaving(true);
    try {
      await OwnerService.changePassword(oldPassword, newPassword);
      toast.push("Password updated.", "success");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      toast.push(normalizeApiError(err).message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <SectionHeader title="My Profile" subtitle="Update your password securely." />

      <div className="flex justify-center">
        <div className="card p-6 w-full max-w-180">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm text-white/70">Old Password</label>
              <input className="mt-2 ss-input px-4 py-3" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} type="password" />
            </div>

            <div>
              <label className="text-sm text-white/70">New Password</label>
              <input className="mt-2 ss-input px-4 py-3" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" />
              <div className="mt-2 text-xs text-white/55">
                Use 8–16 chars, 1 uppercase, 1 special character.
              </div>
            </div>

            <button disabled={saving} className="ss-btn ss-btn-primary w-full py-3 rounded-2xl disabled:opacity-60">
              {saving ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
