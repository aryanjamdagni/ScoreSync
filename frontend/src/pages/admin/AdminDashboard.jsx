import { useEffect, useState } from "react";
import { Users, Store, Star } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "../../components/StatCard";
import SectionHeader from "../../components/SectionHeader";
import Skeleton from "../../components/Skeleton";
import { AdminService } from "../../api/services";
import { normalizeApiError } from "../../utils/apiError";
import { useToast } from "../../components/ToastProvider";

function IconBadge({ children }) {
  return (
    <div className="h-11 w-11 rounded-2xl bg-white/8 border border-white/12 grid place-items-center">
      {children}
    </div>
  );
}

export default function AdminDashboard() {
  const toast = useToast();
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const s = await AdminService.stats();
        if (alive) setStats(s);
      } catch (e) {
        toast.push(normalizeApiError(e).message, "error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => (alive = false);
  }, [toast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <SectionHeader
        title="Admin Dashboard"
        subtitle="Platform overview — users, stores, and submitted ratings."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Users"
          value={loading ? "…" : stats.totalUsers}
          hint="Normal + Admin + Owners"
          rightSlot={<IconBadge><Users size={18} className="text-cyan-200" /></IconBadge>}
        />
        <StatCard
          label="Total Stores"
          value={loading ? "…" : stats.totalStores}
          hint="Stores registered on platform"
          rightSlot={<IconBadge><Store size={18} className="text-cyan-200" /></IconBadge>}
        />
        <StatCard
          label="Total Ratings"
          value={loading ? "…" : stats.totalRatings}
          hint="All ratings submitted"
          rightSlot={<IconBadge><Star size={18} className="text-amber-300" /></IconBadge>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-6 lg:col-span-2">
          <div className="text-lg font-semibold">What you can do</div>
          <div className="mt-2 text-sm text-white/65">
            Add stores & users, view listings, apply filters, and inspect roles.
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="font-semibold">Store management</div>
              <div className="mt-1 text-sm text-white/65">
                Add stores, see rating averages, and monitor activity.
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="font-semibold">User management</div>
              <div className="mt-1 text-sm text-white/65">
                Create ADMIN/USER/OWNER accounts and filter quickly.
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="text-lg font-semibold">System Health</div>
          <div className="mt-2 text-sm text-white/65">
            RBAC is enabled + validations are applied.
          </div>

          <div className="mt-4 space-y-3">
            {loading ? (
              <>
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </>
            ) : (
              <>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-sm">
                  ✅ Role-based routing enabled
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-sm">
                  ✅ Validations as per requirement
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-sm">
                  ✅ Sorting & filtering support
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
