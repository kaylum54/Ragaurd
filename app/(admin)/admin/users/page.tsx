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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-sm text-slate-500 mt-1">
            {total.toLocaleString()} total users on the platform
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500">
            <Users className="h-12 w-12 mb-4 opacity-50" />
            <p>No users found</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Organizations
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-slate-200">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback className="bg-violet-100 text-violet-700 text-sm">
                            {getInitials(user.name, user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-slate-900">
                            {user.name || 'No name'}
                          </div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {user.organizations && user.organizations.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {user.organizations.slice(0, 2).map((org, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs border-slate-200 text-slate-600"
                            >
                              <Building className="h-3 w-3 mr-1" />
                              {org.name}
                            </Badge>
                          ))}
                          {user.organizations.length > 2 && (
                            <Badge variant="outline" className="text-xs border-slate-200 text-slate-500">
                              +{user.organizations.length - 2}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">No organizations</span>
                      )}
                    </td>
                    <td className="p-4">
                      {user.is_admin ? (
                        <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">Admin</Badge>
                      ) : (
                        <Badge variant="outline" className="border-slate-200 text-slate-600">
                          User
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-slate-500 text-sm">
                      {formatDate(user.created_at)}
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
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-slate-600 focus:text-slate-900 focus:bg-slate-100">
                            <Shield className="mr-2 h-4 w-4" />
                            {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-100" />
                          <DropdownMenuItem className="text-rose-600 focus:text-rose-700 focus:bg-rose-50">
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
            <div className="flex items-center justify-between p-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total} users
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
