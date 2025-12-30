'use client';

import { useState, useEffect } from 'react';
import {
  Building,
  Search,
  MoreHorizontal,
  Users,
  Activity,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trash2,
  Settings,
  CreditCard,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface OrgWithStats {
  id: string;
  name: string;
  slug: string;
  plan: string;
  created_at: string;
  memberCount?: number;
  totalRequests?: number;
}

const planColors: Record<string, string> = {
  free: 'bg-midnight-100 text-midnight-700 border-midnight-200',
  starter: 'bg-accent-50 text-accent-700 border-accent-200',
  pro: 'bg-accent-50 text-accent-700 border-accent-200',
  business: 'bg-secure-50 text-secure-700 border-secure-200',
  enterprise: 'bg-midnight-800 text-white border-midnight-700',
};

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState<OrgWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
      });

      const res = await fetch(`/api/admin/organizations?${params}`);
      const data = await res.json();

      setOrganizations(data.organizations || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [page, search]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-midnight-950">Organizations</h1>
        <p className="text-sm text-midnight-500 mt-0.5">
          {total.toLocaleString()} total organizations
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded border border-midnight-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-midnight-400" />
          <input
            placeholder="Search by name or slug..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-sm rounded border border-midnight-200 bg-midnight-50 text-midnight-900 placeholder:text-midnight-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
          />
        </div>
      </div>

      {/* Organizations Table */}
      <div className="bg-white rounded border border-midnight-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-6 w-6 animate-spin text-midnight-400" />
          </div>
        ) : organizations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-midnight-500">
            <Building className="h-10 w-10 mb-4 opacity-50" />
            <p className="text-sm">No organizations found</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-midnight-200 bg-midnight-50">
                  <th className="text-left p-4 text-xs font-medium text-midnight-500 uppercase tracking-wide">Organization</th>
                  <th className="text-left p-4 text-xs font-medium text-midnight-500 uppercase tracking-wide">Plan</th>
                  <th className="text-left p-4 text-xs font-medium text-midnight-500 uppercase tracking-wide">Members</th>
                  <th className="text-left p-4 text-xs font-medium text-midnight-500 uppercase tracking-wide">Requests</th>
                  <th className="text-left p-4 text-xs font-medium text-midnight-500 uppercase tracking-wide">Created</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-midnight-100">
                {organizations.map((org) => (
                  <tr key={org.id} className="hover:bg-midnight-50 transition-colors">
                    <td className="p-4">
                      <div>
                        <div className="text-sm font-medium text-midnight-900">{org.name}</div>
                        <div className="text-xs text-midnight-500">/{org.slug}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded border capitalize ${planColors[org.plan] || planColors.free}`}>
                        {org.plan}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-sm text-midnight-600">
                        <Users className="h-3.5 w-3.5 text-midnight-400" />
                        {org.memberCount || 0}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-sm text-midnight-600 tabular-nums">
                        <Activity className="h-3.5 w-3.5 text-midnight-400" />
                        {(org.totalRequests || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4 text-midnight-500 text-sm">
                      {formatDate(org.created_at)}
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 rounded text-midnight-500 hover:text-midnight-900 hover:bg-midnight-100 transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border-midnight-200">
                          <DropdownMenuItem className="text-midnight-600 focus:text-midnight-900 focus:bg-midnight-50 text-sm">
                            <Settings className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-midnight-600 focus:text-midnight-900 focus:bg-midnight-50 text-sm">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Manage Billing
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-midnight-100" />
                          <DropdownMenuItem className="text-critical-700 focus:text-critical-800 focus:bg-critical-50 text-sm">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Org
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-midnight-100">
              <p className="text-xs text-midnight-500">
                {(page - 1) * 20 + 1} - {Math.min(page * 20, total)} of {total}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded border border-midnight-200 text-midnight-600 hover:bg-midnight-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs text-midnight-600 tabular-nums">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded border border-midnight-200 text-midnight-600 hover:bg-midnight-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
