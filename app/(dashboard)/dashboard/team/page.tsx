'use client';

import { useState } from 'react';
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  MoreHorizontal,
  Trash2,
  Crown,
  Loader2,
  Check,
  Copy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LockedFeature } from '@/components/dashboard/LockedFeature';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar: string | null;
  joinedAt: string;
  lastActiveAt: string;
  status: 'active' | 'pending';
}

// Demo team data
const demoTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'owner',
    avatar: null,
    joinedAt: '2024-01-15T00:00:00Z',
    lastActiveAt: '2024-12-30T10:30:00Z',
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
    avatar: null,
    joinedAt: '2024-03-20T00:00:00Z',
    lastActiveAt: '2024-12-29T15:45:00Z',
    status: 'active',
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'member',
    avatar: null,
    joinedAt: '2024-06-10T00:00:00Z',
    lastActiveAt: '2024-12-28T09:00:00Z',
    status: 'active',
  },
  {
    id: '4',
    name: 'Pending Invite',
    email: 'newuser@example.com',
    role: 'member',
    avatar: null,
    joinedAt: '2024-12-28T00:00:00Z',
    lastActiveAt: '2024-12-28T00:00:00Z',
    status: 'pending',
  },
];

const roleColors: Record<TeamMember['role'], string> = {
  owner: 'dash-badge-warning',
  admin: 'dash-badge-accent',
  member: 'dash-badge-info',
  viewer: 'dash-badge-info',
};

const roleDescriptions: Record<TeamMember['role'], string> = {
  owner: 'Full access to all features and billing',
  admin: 'Can manage team and API keys',
  member: 'Can use defense features',
  viewer: 'Read-only access to dashboards',
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(demoTeamMembers);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('member');
  const [inviting, setInviting] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);
  const [removing, setRemoving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const inviteLink = 'https://ragaurd.com/invite/abc123xyz';

  const handleInvite = async () => {
    if (!inviteEmail) return;

    setInviting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newMember: TeamMember = {
      id: `pending-${Date.now()}`,
      name: 'Pending Invite',
      email: inviteEmail,
      role: inviteRole,
      avatar: null,
      joinedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      status: 'pending',
    };

    setMembers([...members, newMember]);
    setInviteEmail('');
    setInviteRole('member');
    setShowInviteDialog(false);
    setInviting(false);
  };

  const handleRemove = async () => {
    if (!memberToRemove) return;

    setRemoving(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setMembers(members.filter(m => m.id !== memberToRemove.id));
    setMemberToRemove(null);
    setRemoving(false);
  };

  const handleRoleChange = (memberId: string, newRole: TeamMember['role']) => {
    setMembers(members.map(m =>
      m.id === memberId ? { ...m, role: newRole } : m
    ));
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const activeMembers = members.filter(m => m.status === 'active');
  const pendingMembers = members.filter(m => m.status === 'pending');

  return (
    <LockedFeature
      feature="team"
      title="Team Management"
      description="Manage your organization's team members and permissions"
      requiredPlan="Starter"
    >
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="dash-page-title">Team Management</h1>
          <p className="dash-page-subtitle">
            Manage your organization&apos;s team members and permissions
          </p>
        </div>
        <button
          className="dash-btn dash-btn-primary"
          onClick={() => setShowInviteDialog(true)}
        >
          <UserPlus className="h-4 w-4" />
          Invite Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="dash-card">
          <div className="dash-card-body">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-dash-accent/20 border-2 border-dash-accent/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-dash-accent" />
              </div>
              <div>
                <div className="dash-stats-value">{activeMembers.length}</div>
                <div className="text-xs font-semibold text-dash-text-muted uppercase tracking-wider">Active Members</div>
              </div>
            </div>
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-body">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-dash-warning/20 border-2 border-dash-warning/30 flex items-center justify-center">
                <Mail className="h-6 w-6 text-dash-warning" />
              </div>
              <div>
                <div className="dash-stats-value">{pendingMembers.length}</div>
                <div className="text-xs font-semibold text-dash-text-muted uppercase tracking-wider">Pending Invites</div>
              </div>
            </div>
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-body">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-dash-success/20 border-2 border-dash-success/30 flex items-center justify-center">
                <Shield className="h-6 w-6 text-dash-success" />
              </div>
              <div>
                <div className="dash-stats-value">
                  {members.filter(m => m.role === 'admin' || m.role === 'owner').length}
                </div>
                <div className="text-xs font-semibold text-dash-text-muted uppercase tracking-wider">Admins</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Link */}
      <div className="dash-card">
        <div className="dash-card-header">
          <span className="dash-card-title">Invite Link</span>
        </div>
        <div className="dash-card-body">
          <p className="text-sm text-dash-text-muted mb-3">Share this link to invite people to your organization</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 p-3 bg-dash-bg-secondary border-2 border-dash-border text-sm font-mono text-dash-text-secondary truncate">
              {inviteLink}
            </code>
            <button className="dash-btn dash-btn-secondary" onClick={copyInviteLink}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="dash-card">
        <div className="dash-card-header">
          <span className="dash-card-title">Team Members</span>
          <span className="text-sm text-dash-text-muted">{members.length} member(s)</span>
        </div>
        <div className="dash-card-body p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-dash-border">
                  <th className="text-left py-3 px-4 text-xs font-bold text-dash-text-muted uppercase tracking-wider">Member</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-dash-text-muted uppercase tracking-wider">Role</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-dash-text-muted uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-dash-text-muted uppercase tracking-wider">Joined</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-dash-text-muted uppercase tracking-wider">Last Active</th>
                  <th className="w-[50px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dash-border">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-dash-bg-hover transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-dash-accent/20 border-2 border-dash-accent/30 flex items-center justify-center text-xs font-bold text-dash-accent">
                          {getInitials(member.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-dash-text-primary flex items-center gap-2">
                            {member.name}
                            {member.role === 'owner' && (
                              <Crown className="h-3 w-3 text-dash-warning" />
                            )}
                          </div>
                          <div className="text-sm text-dash-text-muted">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {member.role === 'owner' ? (
                        <span className={cn('dash-badge', roleColors[member.role])}>
                          {member.role}
                        </span>
                      ) : (
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value as TeamMember['role'])}
                          className="dash-input py-1 px-2 text-xs w-24"
                        >
                          <option value="admin">Admin</option>
                          <option value="member">Member</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {member.status === 'active' ? (
                        <span className="dash-badge dash-badge-success">Active</span>
                      ) : (
                        <span className="dash-badge dash-badge-warning">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-dash-text-muted">
                      {formatDate(member.joinedAt)}
                    </td>
                    <td className="py-3 px-4 text-sm text-dash-text-muted">
                      {member.status === 'active' ? formatDate(member.lastActiveAt) : '-'}
                    </td>
                    <td className="py-3 px-4">
                      {member.role !== 'owner' && (
                        <div className="relative">
                          <button
                            className="p-1.5 text-dash-text-muted hover:text-dash-text-primary hover:bg-dash-bg-hover transition-colors"
                            onClick={() => setOpenDropdown(openDropdown === member.id ? null : member.id)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          {openDropdown === member.id && (
                            <div className="absolute right-0 top-8 z-10 w-40 bg-dash-bg-primary border-2 border-dash-border shadow-lg">
                              {member.status === 'pending' && (
                                <button className="w-full px-3 py-2 text-left text-sm text-dash-text-secondary hover:bg-dash-bg-hover flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  Resend Invite
                                </button>
                              )}
                              <button
                                className="w-full px-3 py-2 text-left text-sm text-dash-danger hover:bg-dash-bg-hover flex items-center gap-2"
                                onClick={() => {
                                  setMemberToRemove(member);
                                  setOpenDropdown(null);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Roles Info */}
      <div className="dash-card">
        <div className="dash-card-header">
          <span className="dash-card-title">Role Permissions</span>
        </div>
        <div className="dash-card-body">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(roleDescriptions) as TeamMember['role'][]).map((role) => (
              <div key={role} className="p-4 bg-dash-bg-secondary border-2 border-dash-border">
                <span className={cn('dash-badge mb-2', roleColors[role])}>
                  {role}
                </span>
                <p className="text-sm text-dash-text-muted">
                  {roleDescriptions[role]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Dialog */}
      {showInviteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="dash-card max-w-md w-full mx-4">
            <div className="dash-card-header">
              <span className="dash-card-title">Invite Team Member</span>
            </div>
            <div className="dash-card-body space-y-4">
              <p className="text-sm text-dash-text-muted">
                Send an invitation to join your organization
              </p>
              <div>
                <label className="text-xs font-bold text-dash-text-secondary uppercase tracking-wider block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="dash-input"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-dash-text-secondary uppercase tracking-wider block mb-2">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as TeamMember['role'])}
                  className="dash-input"
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                  <option value="viewer">Viewer</option>
                </select>
                <p className="text-xs text-dash-text-muted mt-1">
                  {roleDescriptions[inviteRole]}
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t-2 border-dash-border">
                <button
                  className="dash-btn dash-btn-secondary"
                  onClick={() => setShowInviteDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="dash-btn dash-btn-primary"
                  onClick={handleInvite}
                  disabled={!inviteEmail || inviting}
                >
                  {inviting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Confirmation Dialog */}
      {memberToRemove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="dash-card max-w-md w-full mx-4">
            <div className="dash-card-header">
              <span className="dash-card-title">Remove Team Member</span>
            </div>
            <div className="dash-card-body space-y-4">
              <p className="text-sm text-dash-text-secondary">
                Are you sure you want to remove {memberToRemove.name} ({memberToRemove.email}) from your organization?
                They will lose access to all resources.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="dash-btn dash-btn-secondary"
                  onClick={() => setMemberToRemove(null)}
                >
                  Cancel
                </button>
                <button
                  className="dash-btn bg-dash-danger text-white border-dash-danger hover:bg-dash-danger/90"
                  onClick={handleRemove}
                  disabled={removing}
                >
                  {removing && <Loader2 className="h-4 w-4 animate-spin" />}
                  Remove Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </LockedFeature>
  );
}
