import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import AdminLayout from '../layouts/AdminLayout';
import Loading from '../components/Loading';
import { adminAnalytics } from '../services/complaintService';

const PRIORITY_COLORS = { LOW: '#10B981', MEDIUM: '#F59E0B', HIGH: '#F97316', CRITICAL: '#EF4444' };
const STATUS_COLORS = ['#0B2545', '#4F46E5', '#0EA5E9', '#F59E0B', '#12967A'];

export default function AdminAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    adminAnalytics().then(setData);
  }, []);

  if (!data) return <AdminLayout><Loading label="Crunching the numbers..." /></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <p className="text-sm text-ink-500 mt-1">Real-time insight into civic issue patterns across the city.</p>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <ChartCard title="Complaints by Category">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.byCategory} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E3E9E6" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="category" width={160} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#12967A" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Priority Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.byPriority} dataKey="count" nameKey="priority" cx="50%" cy="50%" outerRadius={100} label>
                {data.byPriority.map((entry) => (
                  <Cell key={entry.priority} fill={PRIORITY_COLORS[entry.priority] || '#94A3B8'} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Complaints by Status">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.byStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100} label>
                {data.byStatus.map((entry, i) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Areas With Most Complaints">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.byLocation} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E9E6" />
              <XAxis dataKey="location" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" interval={0} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#0B2545" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="card mt-6 p-6">
        <h3 className="font-semibold text-navy-800 mb-4">Most Reported Civic Issues</h3>
        <div className="flex flex-col gap-2">
          {data.mostReported.map((item) => (
            <div key={item.complaint_id} className="flex items-center justify-between text-sm py-2 border-b border-line last:border-0">
              <div>
                <p className="font-medium text-navy-800">{item.title}</p>
                <p className="text-xs text-ink-400">{item.complaint_id} &middot; {item.category}</p>
              </div>
              <span className="text-teal-700 font-semibold">{item.community_count} citizens</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="card p-6">
      <h3 className="font-semibold text-navy-800 mb-2">{title}</h3>
      {children}
    </div>
  );
}
