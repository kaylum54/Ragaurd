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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  free: 'bg-slate-100 text-slate-700',
  starter: 'bg-violet-100 text-violet-700',
  pro: 'bg-sky-100 text-sky-700',
  business: 'bg-emerald-100 text-emerald-700',
  enterprise: 'bg-amber-100 text-amber-700',
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Organizations</h1>
          <p className="text-sm text-slate-500 mt-1">
            {total.toLocaleString()} total organizations
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name or slug..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Organizations Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
          </div>
        ) : organizations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500">
            <Building className="h-12 w-12 mb-4 opacity-50" />
            <p>No organizations found</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Members
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Requests
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {organizations.map((org) => (
                  <tr
                    key={org.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-slate-900">{org.name}</div>
                        <div className="text-sm text-slate-500">/{org.slug}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={`${planColors[org.plan] || planColors.free} hover:${planColors[org.plan] || planColors.free}`}>
                        {org.plan.charAt(0).toUpperCase() + org.plan.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Users className="h-4 w-4 text-slate-400" />
                        {org.memberCount || 0}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Activity className="h-4 w-4 text-slate-400" />
                        {(org.totalRequests || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 text-sm">
                      {formatDate(org.created_at)}
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border-slate-200">
                          <DropdownMenuItem className="text-slate-600 focus:text-slate-900 focus:bg-slate-100">
                            <Settings className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-slate-600 focus:text-slate-900 focus:bg-slate-100">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Manage Billing
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-100" />
                          <DropdownMenuItem className="text-rose-600 focus:text-rose-700 focus:bg-rose-50">
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
            <div className="flex items-center justify-between p-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="border-slate-200 text-slate-600 hover:bg-slate-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-slate-600">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="border-slate-200 text-slate-600 hover:bg-slate-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
