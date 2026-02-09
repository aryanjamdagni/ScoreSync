import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "../../components/SectionHeader";
import DataTable from "../../components/DataTable";
import StatCard from "../../components/StatCard";
import StarRating from "../../components/StarRating";
import EmptyState from "../../components/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { OwnerService } from "../../api/services";
import { normalizeApiError } from "../../utils/apiError";
import { useToast } from "../../components/ToastProvider";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const toast = useToast();

  const [data, setData] = useState({ store: null, avgRating: 0, totalRatings: 0, raters: [] });
  const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const d = await OwnerService.dashboard(user.id);
        if (alive) setData(d);
      } catch (e) {
        toast.push(normalizeApiError(e).message, "error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [toast, user.id]);

  const onSort = (key) => {
    if (sortBy === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(key); setSortDir("asc"); }
  };

  const rows = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    return [...(data.raters || [])].sort(
      (a, b) => String(a?.[sortBy] ?? "").localeCompare(String(b?.[sortBy] ?? "")) * dir
    );
  }, [data.raters, sortBy, sortDir]);

  const columns = [
    { key: "name", label: "User Name", sortable: true, render: (r) => <span className="whitespace-normal">{r.name}</span> },
    { key: "email", label: "Email", sortable: true },
    { key: "rating", label: "Rating", sortable: true, render: (r) => <StarRating value={r.rating} /> },
    { key: "updatedAt", label: "Updated", sortable: true },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <SectionHeader title="Store Dashboard" subtitle="View your store performance and who rated your store." />

      {loading ? (
        <div className="card p-6 text-white/70">Loading store dashboard…</div>
      ) : !data.store ? (
        <EmptyState title="No store mapped" subtitle="Ask the Admin to assign your owner account to a store." />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard label="Your Store" value={data.store.name} hint={data.store.address} />

            <div className="card p-5">
              <div className="text-sm text-white/65">Average Rating</div>
              <div className="mt-2 flex items-center gap-3">
                <div className="text-3xl font-semibold">{data.avgRating}</div>
                <StarRating value={data.avgRating} showNumber={false} />
              </div>
              <div className="mt-2 text-xs text-white/55">Calculated from all ratings</div>
            </div>

            <StatCard label="Total Ratings" value={data.totalRatings} hint="Unique users who rated" />
          </div>

          <div className="card p-5">
            <div className="text-lg font-semibold">Users who submitted ratings</div>
            <div className="mt-3">
              <DataTable columns={columns} rows={rows} sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
