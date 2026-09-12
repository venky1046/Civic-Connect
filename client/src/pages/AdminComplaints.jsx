import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import AdminLayout from "../layouts/AdminLayout";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import Loading from "../components/Loading";
import {
  adminListComplaints,
  getCategories,
} from "../services/complaintService";

const STATUSES = [
  "SUBMITTED",
  "UNDER REVIEW",
  "ASSIGNED",
  "IN PROGRESS",
  "RESOLVED",
];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export default function AdminComplaints() {
  const [params, setParams] = useSearchParams();
  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const filters = {
    category: params.get("category") || "",
    priority: params.get("priority") || "",
    status: params.get("status") || "",
    search: params.get("search") || "",
  };

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    adminListComplaints(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v)),
    )
      .then(setComplaints)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">All Complaints</h1>
          <p className="text-sm text-ink-500 mt-1">
            {complaints.length} results
          </p>
        </div>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <input
            className="input-field pl-9 w-64"
            placeholder="Search by ID or title"
            defaultValue={filters.search}
            onKeyDown={(e) =>
              e.key === "Enter" && updateFilter("search", e.target.value)
            }
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        <select
          className="input-field w-auto"
          value={filters.category}
          onChange={(e) => updateFilter("category", e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.key} value={c.label}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          className="input-field w-auto"
          value={filters.priority}
          onChange={(e) => updateFilter("priority", e.target.value)}
        >
          <option value="">All Priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          className="input-field w-auto"
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value)}
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {(filters.category ||
          filters.priority ||
          filters.status ||
          filters.search) && (
          <button className="btn-ghost" onClick={() => setParams({})}>
            Clear filters
          </button>
        )}
      </div>

      <div className="card mt-6">
        {loading ? (
          <Loading label="Loading complaints..." />
        ) : (
          <DataTable
            rowKey="complaintId"
            onRowClick={(row) =>
              navigate(`/admin/complaints/${row.complaintId}`)
            }
            emptyMessage="No complaints match these filters."
            columns={[
              { key: "complaintId", header: "ID" },
              { key: "title", header: "Title" },
              { key: "category", header: "Category" },
              { key: "location", header: "Location" },
              { key: "communityCount", header: "Citizens" },
              {
                key: "priority",
                header: "Priority",
                render: (r) => <PriorityBadge priority={r.priority} />,
              },
              {
                key: "status",
                header: "Status",
                render: (r) => <StatusBadge status={r.status} />,
              },
            ]}
            rows={complaints}
          />
        )}
      </div>
    </AdminLayout>
  );
}
