import { useEffect, useMemo, useState } from "react";
import { Plus, Filter, User, Mail, MapPin, Shield } from "lucide-react";
import { motion } from "framer-motion";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import SectionHeader from "../../components/SectionHeader";
import EmptyState from "../../components/EmptyState";
import Skeleton from "../../components/Skeleton";
import useDebounce from "../../hooks/useDebounce";
import { AdminService } from "../../api/services";
import { normalizeApiError } from "../../utils/apiError";
import { useToast } from "../../components/ToastProvider";
import { validateSignup } from "../../utils/validators";

function Input({ icon, ...props }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
        {icon}
      </div>
      <input {...props} className="ss-input pl-11 pr-4 py-3" />
    </div>
  );
}

function RolePill({ role }) {
  const cls =
    role === "ADMIN"
      ? "border-cyan-300/40 bg-cyan-400/10 text-cyan-200"
      : role === "OWNER"
      ? "border-amber-300/35 bg-amber-400/10 text-amber-200"
      : "border-white/10 bg-white/5 text-white/80";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>
      {role}
    </span>
  );
}

export default function AdminUsers() {
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({ name: "", email: "", address: "", role: "" });
  const dName = useDebounce(filters.name, 250);
  const dEmail = useDebounce(filters.email, 250);
  const dAddress = useDebounce(filters.address, 250);
  const dRole = useDebounce(filters.role, 120);

  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "USER",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const data = await AdminService.listUsers();
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
    const r = dRole.trim().toUpperCase();

    const f = rows.filter((x) => {
      if (n && !String(x.name).toLowerCase().includes(n)) return false;
      if (e && !String(x.email).toLowerCase().includes(e)) return false;
      if (a && !String(x.address).toLowerCase().includes(a)) return false;
      if (r && String(x.role).toUpperCase() !== r) return false;
      return true;
    });

    const dir = sortDir === "asc" ? 1 : -1;
    return [...f].sort((x, y) =>
      String(x?.[sortBy] ?? "").localeCompare(String(y?.[sortBy] ?? "")) * dir
    );
  }, [rows, dName, dEmail, dAddress, dRole, sortBy, sortDir]);

  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (r) => (
        <div className="min-w-65">
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
      key: "role",
      label: "Role",
      sortable: true,
      render: (r) => <RolePill role={r.role} />,
    },
  ];

  const resetForm = () => {
    setForm({ name: "", email: "", address: "", password: "", role: "USER" });
    setFormErrors({});
  };

  const addUser = async () => {
    const eMap = validateSignup(form);
    if (!form.role) eMap.role = "Role is required.";
    setFormErrors(eMap);

    if (Object.keys(eMap).length) {
      toast.push("Fix validation errors before saving.", "error");
      return;
    }

    setSaving(true);
    try {
      const created = await AdminService.addUser({
        name: form.name.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        password: form.password,
        role: form.role,
      });
      setRows((p) => [...p, created]);
      toast.push("User added successfully.", "success");
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
        title="Manage Users"
        subtitle="Add users (ADMIN/USER/OWNER) and filter/sort by key fields."
        right={
          <button
            onClick={() => setOpen(true)}
            className="ss-btn ss-btn-primary px-5 py-3 rounded-2xl"
          >
            <Plus size={18} /> Add User
          </button>
        }
      />

      <div className="card p-5">
        <div className="flex items-center gap-2 text-white/85 font-semibold">
          <Filter size={18} className="text-cyan-200" />
          Filters
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            value={filters.name}
            onChange={(e) => setFilters((p) => ({ ...p, name: e.target.value }))}
            placeholder="Filter by name..."
            icon={<User size={16} />}
          />
          <Input
            value={filters.email}
            onChange={(e) => setFilters((p) => ({ ...p, email: e.target.value }))}
            placeholder="Filter by email..."
            icon={<Mail size={16} />}
          />
          <Input
            value={filters.address}
            onChange={(e) => setFilters((p) => ({ ...p, address: e.target.value }))}
            placeholder="Filter by address..."
            icon={<MapPin size={16} />}
          />
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
              <Shield size={16} />
            </div>
            <select
              value={filters.role}
              onChange={(e) => setFilters((p) => ({ ...p, role: e.target.value }))}
              className="ss-input pl-11 pr-4 py-3"
            >
              <option value="">All Roles</option>
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
              <option value="OWNER">OWNER</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card p-6">
          <div className="text-white/70">Loading users…</div>
          <div className="mt-4 space-y-3">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No users found" subtitle="Try changing filters or add a new user." />
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={onSort}
          emptyText="No users found"
        />
      )}

      <Modal
        open={open}
        title="Add New User"
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
              onClick={addUser}
              className="ss-btn ss-btn-primary px-5 py-2 rounded-2xl disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save User"}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/70">Name (3–60 chars)</label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="mt-2 ss-input px-4 py-3"
              placeholder="Enter full name"
            />
            <FieldError msg={formErrors.name} />
          </div>

          <div>
            <label className="text-sm text-white/70">Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="mt-2 ss-input px-4 py-3"
              placeholder="user@email.com"
            />
            <FieldError msg={formErrors.email} />
          </div>

          <div>
            <label className="text-sm text-white/70">Address (max 400)</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              rows={3}
              className="mt-2 ss-input px-4 py-3"
              placeholder="Enter address"
            />
            <FieldError msg={formErrors.address} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="mt-2 ss-input px-4 py-3"
                placeholder="Hello@123"
              />
              <FieldError msg={formErrors.password} />
              <div className="mt-1 text-xs text-white/55">
                8–16 chars, 1 uppercase, 1 special
              </div>
            </div>

            <div>
              <label className="text-sm text-white/70">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                className="mt-2 ss-input px-4 py-3"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="OWNER">OWNER</option>
              </select>
              <FieldError msg={formErrors.role} />
              <div className="mt-1 text-xs text-white/55">
                Role controls dashboard access
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
