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
          <h1 className="text-2xl font-semibold text-steel-100">Users</h1>
          <p className="text-sm text-steel-500 mt-1">
            {total.toLocaleString()} total users on the platform
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="dashboard-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-steel-500" />
          <Input
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 bg-base border-[rgba(59,130,246,0.2)] text-steel-100 placeholder:text-steel-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="dashboard-card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-electric-500" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-steel-500">
            <Users className="h-12 w-12 mb-4 opacity-50" />
            <p>No users found</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(59,130,246,0.1)]">
                  <th className="text-left p-4 text-xs font-medium text-steel-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left p-4 text-xs font-medium text-steel-500 uppercase tracking-wider">
                    Organizations
                  </th>
                  <th className="text-left p-4 text-xs font-medium text-steel-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left p-4 text-xs font-medium text-steel-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(59,130,246,0.1)]">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-[rgba(59,130,246,0.02)] transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-[rgba(59,130,246,0.2)]">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback className="bg-[rgba(59,130,246,0.1)] text-electric-400 text-sm">
                            {getInitials(user.name, user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-steel-100">
                            {user.name || 'No name'}
                          </div>
                          <div className="text-sm text-steel-500">{user.email}</div>
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
                              className="text-xs border-[rgba(59,130,246,0.3)] text-steel-300"
                            >
                              <Building className="h-3 w-3 mr-1" />
                              {org.name}
                            </Badge>
                          ))}
                          {user.organizations.length > 2 && (
                            <Badge variant="outline" className="text-xs border-steel-700 text-steel-500">
                              +{user.organizations.length - 2}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-steel-500 text-sm">No organizations</span>
                      )}
                    </td>
                    <td className="p-4">
                      {user.is_admin ? (
                        <Badge className="bg-danger text-white">Admin</Badge>
                      ) : (
                        <Badge variant="outline" className="border-steel-700 text-steel-400">
                          User
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-steel-400 text-sm">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-steel-500 hover:text-steel-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-sidebar border-[rgba(59,130,246,0.2)]">
                          <DropdownMenuItem className="text-steel-300 focus:text-steel-100 focus:bg-[rgba(59,130,246,0.1)]">
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-steel-300 focus:text-steel-100 focus:bg-[rgba(59,130,246,0.1)]">
                            <Shield className="mr-2 h-4 w-4" />
                            {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[rgba(59,130,246,0.1)]" />
                          <DropdownMenuItem className="text-danger focus:text-danger focus:bg-[rgba(239,68,68,0.1)]">
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
            <div className="flex items-center justify-between p-4 border-t border-[rgba(59,130,246,0.1)]">
              <p className="text-sm text-steel-500">
                Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total} users
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="border-[rgba(59,130,246,0.2)] text-steel-300 hover:bg-[rgba(59,130,246,0.1)]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-steel-400">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="border-[rgba(59,130,246,0.2)] text-steel-300 hover:bg-[rgba(59,130,246,0.1)]"
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
