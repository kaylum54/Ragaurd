'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  MoreHorizontal,
  Shield,
  Trash2,
  Mail,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Building,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserWithOrg {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  organizations?: { name: string; plan: string }[];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserWithOrg[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
      });

      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();

      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="dash-page-title">Users</h1>
        <p className="dash-page-subtitle">
          {total.toLocaleString()} total users
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded border border-midnight-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-midnight-400" />
          <input
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-sm rounded border border-midnight-200 bg-midnight-50 text-midnight-900 placeholder:text-midnight-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded border border-midnight-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-6 w-6 animate-spin text-midnight-400" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-midnight-500">
            <Users className="h-10 w-10 mb-4 opacity-50" />
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-midnight-200 bg-midnight-50">
                  <th className="text-left p-4 text-xs font-medium text-midnight-500 uppercase tracking-wide">User</th>
                  <th className="text-left p-4 text-xs font-medium text-midnight-500 uppercase tracking-wide">Organizations</th>
                  <th className="text-left p-4 text-xs font-medium text-midnight-500 uppercase tracking-wide">Role</th>
                  <th className="text-left p-4 text-xs font-medium text-midnight-500 uppercase tracking-wide">Joined</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-midnight-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-midnight-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-midnight-200">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback className="bg-midnight-100 text-midnight-700 text-xs font-medium">
                            {getInitials(user.name, user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium text-midnight-900">{user.name || 'No name'}</div>
                          <div className="text-xs text-midnight-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {user.organizations && user.organizations.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {user.organizations.slice(0, 2).map((org, i) => (
                            <span key={i} className="inline-flex items-center text-xs px-1.5 py-0.5 bg-midnight-100 text-midnight-600 border border-midnight-200 rounded">
                              <Building className="h-3 w-3 mr-1" />
                              {org.name}
                            </span>
                          ))}
                          {user.organizations.length > 2 && (
                            <span className="text-xs px-1.5 py-0.5 bg-midnight-100 text-midnight-500 border border-midnight-200 rounded">
                              +{user.organizations.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-midnight-400 text-xs">No organizations</span>
                      )}
                    </td>
                    <td className="p-4">
                      {user.is_admin ? (
                        <span className="text-xs font-medium px-1.5 py-0.5 bg-critical-50 text-critical-700 border border-critical-200 rounded">Admin</span>
                      ) : (
                        <span className="text-xs font-medium px-1.5 py-0.5 bg-midnight-100 text-midnight-600 border border-midnight-200 rounded">User</span>
                      )}
                    </td>
                    <td className="p-4 text-midnight-500 text-sm">
                      {formatDate(user.created_at)}
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
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-midnight-600 focus:text-midnight-900 focus:bg-midnight-50 text-sm">
                            <Shield className="mr-2 h-4 w-4" />
                            {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-midnight-100" />
                          <DropdownMenuItem className="text-critical-700 focus:text-critical-800 focus:bg-critical-50 text-sm">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
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
