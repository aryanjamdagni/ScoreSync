import { useEffect, useMemo, useState } from "react";
import { Plus, Filter, Store as StoreIcon, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import SectionHeader from "../../components/SectionHeader";
import EmptyState from "../../components/EmptyState";
import Skeleton from "../../components/Skeleton";
import StarRating from "../../components/StarRating";
import useDebounce from "../../hooks/useDebounce";
import { AdminService } from "../../api/services";
import { normalizeApiError } from "../../utils/apiError";
import { useToast } from "../../components/ToastProvider";
import { isValidEmail, isValidAddress } from "../../utils/validators";

function Input({ icon, className = "", inputClassName = "", ...props }) {
  return (
    <div
      className={[
        "relative min-w-0",
        "rounded-3xl border border-white/14 bg-[#0b1623]/90",
        "shadow-[0_12px_30px_rgba(0,0,0,0.35)]",
        "backdrop-blur",
        className,
      ].join(" ")}
    >
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/55">
        {icon}
      </div>
      <input
        {...props}
        className={[
          "w-full bg-transparent outline-none",
          "text-white placeholder:text-white/45",
          "px-11 pr-4 py-3 rounded-3xl",
          inputClassName,
        ].join(" ")}
      />
    </div>
  );
}

export default function AdminStores() {
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const dName = useDebounce(filters.name, 250);
  const dEmail = useDebounce(filters.email, 250);
  const dAddress = useDebounce(filters.address, 250);

  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [formErr, setFormErr] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const data = await AdminService.listStores();
        if (alive) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        toast.push(normalizeApiError(e).message, "error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => (alive = false);
  }, [toast]);

  const onSort = (key) => {
    if (sortBy === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    const n = dName.trim().toLowerCase();
    const e = dEmail.trim().toLowerCase();
    const a = dAddress.trim().toLowerCase();

    const f = rows.filter((r) => {
      if (n && !String(r.name).toLowerCase().includes(n)) return false;
      if (e && !String(r.email).toLowerCase().includes(e)) return false;
      if (a && !String(r.address).toLowerCase().includes(a)) return false;
      return true;
    });

    const dir = sortDir === "asc" ? 1 : -1;
    return [...f].sort(
      (x, y) =>
        String(x?.[sortBy] ?? "").localeCompare(String(y?.[sortBy] ?? "")) * dir
    );
  }, [rows, dName, dEmail, dAddress, sortBy, sortDir]);

  const columns = [
    {
      key: "name",
      label: "Store Name",
      sortable: true,
      render: (r) => (
        <div className="min-w-60">
          <div className="font-semibold text-white/90">{r.name}</div>
          <div className="text-xs text-white/55 mt-1">{r.email}</div>
        </div>
      ),
    },
    {
      key: "address",
      label: "Address",
      sortable: true,
      render: (r) => <span className="whitespace-normal">{r.address}</span>,
    },
    {
      key: "avgRating",
      label: "Overall Rating",
      sortable: true,
      render: (r) => (
        <div className="min-w-55">
          <StarRating value={r.avgRating || 0} />
          <div className="text-xs text-white/55 mt-1">
            {(r.avgRating || 0).toFixed?.(1)
              ? (r.avgRating || 0).toFixed(1)
              : r.avgRating || 0}{" "}
            ({r.totalRatings || 0} ratings)
          </div>
        </div>
      ),
    },
  ];

  const resetForm = () => {
    setForm({ name: "", email: "", address: "" });
    setFormErr({});
  };

  const validateStore = () => {
    const e = {};
    const name = form.name.trim();
    const email = form.email.trim();
    const address = form.address.trim();

    if (!name) e.name = "Store name is required.";
    if (!email || !isValidEmail(email))
      e.email = "Valid store email is required.";
    if (!address) e.address = "Address is required.";
    else if (!isValidAddress(address))
      e.address = "Address must be max 400 characters.";

    setFormErr(e);
    return Object.keys(e).length === 0;
  };

  const addStore = async () => {
    if (!validateStore()) {
      toast.push("Please fix validation errors.", "error");
      return;
    }
    setSaving(true);
    try {
      const created = await AdminService.addStore({
        name: form.name.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        ownerUserId: null,
      });
      setRows((p) => [...p, created]);
      toast.push("Store added successfully.", "success");
      resetForm();
      setOpen(false);
    } catch (e) {
      toast.push(normalizeApiError(e).message, "error");
    } finally {
      setSaving(false);
    }
  };

  const FieldError = ({ msg }) =>
    msg ? <div className="mt-1 text-xs text-red-300">{msg}</div> : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <SectionHeader
        title="Manage Stores"
        subtitle="Add stores, view their average ratings, and filter/sort the listings."
        right={
          <button
            onClick={() => setOpen(true)}
            className="ss-btn ss-btn-primary px-5 py-3 rounded-2xl"
          >
            <Plus size={18} /> Add Store
          </button>
        }
      />

      <div className="card p-5">
        <div className="flex items-center gap-2 text-white/85 font-semibold">
          <Filter size={18} className="text-cyan-200" />
          Filters
        </div>

        <div className="mt-4 flex flex-col lg:flex-row flex-wrap gap-6">
          <Input
            className="flex-1 min-w-65"
            value={filters.name}
            onChange={(e) => setFilters((p) => ({ ...p, name: e.target.value }))}
            placeholder="Search by store name..."
            icon={<StoreIcon size={16} />}
          />
          <Input
            className="flex-1 min-w-65"
            value={filters.email}
            onChange={(e) =>
              setFilters((p) => ({ ...p, email: e.target.value }))
            }
            placeholder="Search by email..."
            icon={<Mail size={16} />}
          />
          <Input
            className="flex-1 min-w-65"
            value={filters.address}
            onChange={(e) =>
              setFilters((p) => ({ ...p, address: e.target.value }))
            }
            placeholder="Search by address..."
            icon={<MapPin size={16} />}
          />
        </div>
      </div>

      {loading ? (
        <div className="card p-6">
          <div className="text-white/70">Loading stores…</div>
          <div className="mt-4 space-y-3">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No stores found"
          subtitle="Try changing filters or add a new store."
        />
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={onSort}
          emptyText="No stores found"
        />
      )}

      <Modal
        open={open}
        title="Add New Store"
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              className="ss-btn px-4 py-2 rounded-2xl"
            >
              Cancel
            </button>
            <button
              disabled={saving}
              onClick={addStore}
              className="ss-btn ss-btn-primary px-5 py-2 rounded-2xl disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Store"}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/70">Store Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="mt-2 ss-input px-4 py-3"
              placeholder="e.g. GreenMart Superstore"
            />
            <FieldError msg={formErr.name} />
          </div>

          <div>
            <label className="text-sm text-white/70">Store Email</label>
            <input
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              className="mt-2 ss-input px-4 py-3"
              placeholder="e.g. store@email.com"
            />
            <FieldError msg={formErr.email} />
          </div>

          <div>
            <label className="text-sm text-white/70">Address</label>
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) =>
                setForm((p) => ({ ...p, address: e.target.value }))
              }
              placeholder="Store address (max 400 chars)"
              className="mt-2 ss-input px-4 py-3"
            />
            <FieldError msg={formErr.address} />
          </div>

          <div className="text-xs text-white/50">
            Tip: Later in backend, you can map store owners to stores.
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
