import { useEffect, useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import RatingSelect from "../../components/RatingSelect";
import StarRating from "../../components/StarRating";
import SectionHeader from "../../components/SectionHeader";
import EmptyState from "../../components/EmptyState";
import Skeleton from "../../components/Skeleton";
import { useAuth } from "../../context/AuthContext";
import { UserService } from "../../api/services";
import { normalizeApiError } from "../../utils/apiError";
import { useToast } from "../../components/ToastProvider";
import useDebounce from "../../hooks/useDebounce";
import { isValidRating } from "../../utils/validators";

export default function UserStores() {
  const { user } = useAuth();
  const toast = useToast();

  const [q, setQ] = useState("");
  const dq = useDebounce(q, 250);

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const list = await UserService.listStores(user.id);
        if (alive) setStores(Array.isArray(list) ? list : []);
      } catch (e) {
        toast.push(normalizeApiError(e).message, "error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [toast, user.id]);

  const filtered = useMemo(() => {
    const s = dq.trim().toLowerCase();
    if (!s) return stores;
    return stores.filter(
      (x) =>
        String(x.name).toLowerCase().includes(s) ||
        String(x.address).toLowerCase().includes(s)
    );
  }, [dq, stores]);

  const submitRating = async (storeId, rating) => {
    if (!isValidRating(rating)) {
      toast.push("Rating must be between 1 and 5.", "error");
      return;
    }

    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, myRating: rating } : s))
    );

    setSubmittingId(storeId);
    try {
      await UserService.rateStore(storeId, rating);
      toast.push("Rating saved.", "success");
      const refreshed = await UserService.listStores(user.id);
      setStores(Array.isArray(refreshed) ? refreshed : []);
    } catch (e) {
      toast.push(normalizeApiError(e).message, "error");
    } finally {
      setSubmittingId("");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <SectionHeader
        title="Browse Stores"
        subtitle="Search stores and submit/modify ratings (1 to 5)."
        right={
          <div className="relative w-full md:w-105">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by store name or address..."
              className="ss-input pl-11 pr-4 py-3"
            />
          </div>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          <div className="card p-5"><Skeleton className="h-6 w-64" /><Skeleton className="h-4 w-96 mt-3" /><Skeleton className="h-20 mt-5" /></div>
          <div className="card p-5"><Skeleton className="h-6 w-64" /><Skeleton className="h-4 w-96 mt-3" /><Skeleton className="h-20 mt-5" /></div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No stores found" subtitle="Try changing your search text." />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((s) => (
            <div key={s.id} className="card p-5">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-semibold truncate">{s.name}</div>
                    <Sparkles size={16} className="text-cyan-200" />
                  </div>
                  <div className="text-sm text-white/65 mt-1">{s.address}</div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                      <div className="text-xs text-white/60">Overall</div>
                      <div className="mt-1 flex items-center gap-3">
                        <StarRating value={s.avgRating || 0} />
                        <div className="text-sm text-white/75">
                          {s.avgRating || 0} ({s.totalRatings || 0})
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                      <div className="text-xs text-white/60">Your rating</div>
                      <div className="mt-1 flex items-center gap-3">
                        <StarRating value={s.myRating || 0} />
                        <div className="text-sm text-white/75">{s.myRating || 0}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <RatingSelect value={s.myRating || 0} onChange={(val) => submitRating(s.id, val)} />
                  <button
                    disabled={submittingId === s.id}
                    onClick={() => submitRating(s.id, s.myRating || 5)}
                    className="ss-btn ss-btn-primary px-5 py-3 rounded-2xl disabled:opacity-60"
                  >
                    {submittingId === s.id ? "Saving..." : s.myRating ? "Update" : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
