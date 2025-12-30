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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

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
  owner: 'bg-amber-500 text-white',
  admin: 'bg-primary-600 text-white',
  member: 'bg-slate-500 text-white',
  viewer: 'bg-slate-400 text-white',
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

  const inviteLink = 'https://ragaurd.com/invite/abc123xyz';

  const handleInvite = async () => {
    if (!inviteEmail) return;

    setInviting(true);
    // Simulate API call
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
    // Simulate API call
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team Management</h1>
          <p className="text-muted-foreground">
            Manage your organization&apos;s team members and permissions
          </p>
        </div>
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your organization
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as TeamMember['role'])}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {roleDescriptions[inviteRole]}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleInvite} disabled={!inviteEmail || inviting}>
                {inviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeMembers.length}</div>
                <div className="text-sm text-muted-foreground">Active Members</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-warning/20 flex items-center justify-center">
                <Mail className="h-6 w-6 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold">{pendingMembers.length}</div>
                <div className="text-sm text-muted-foreground">Pending Invites</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-success/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {members.filter(m => m.role === 'admin' || m.role === 'owner').length}
                </div>
                <div className="text-sm text-muted-foreground">Admins</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invite Link */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invite Link</CardTitle>
          <CardDescription>Share this link to invite people to your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <code className="flex-1 p-3 bg-slate-100 rounded-lg text-sm font-mono truncate">
              {inviteLink}
            </code>
            <Button variant="outline" size="sm" onClick={copyInviteLink}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            {members.length} member(s) in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar || undefined} />
                        <AvatarFallback className="text-xs bg-primary-100 text-primary-700">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {member.name}
                          {member.role === 'owner' && (
                            <Crown className="h-3 w-3 text-amber-500" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {member.role === 'owner' ? (
                      <Badge className={roleColors[member.role]}>
                        {member.role}
                      </Badge>
                    ) : (
                      <Select
                        value={member.role}
                        onValueChange={(v) => handleRoleChange(member.id, v as TeamMember['role'])}
                      >
                        <SelectTrigger className="w-[100px] h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell>
                    {member.status === 'active' ? (
                      <Badge className="bg-success text-white">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="text-warning border-warning">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(member.joinedAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.status === 'active' ? formatDate(member.lastActiveAt) : '-'}
                  </TableCell>
                  <TableCell>
                    {member.role !== 'owner' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {member.status === 'pending' && (
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Resend Invite
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-danger focus:text-danger"
                            onClick={() => setMemberToRemove(member)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Roles Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(roleDescriptions) as TeamMember['role'][]).map((role) => (
              <div key={role} className="p-4 bg-slate-50 rounded-lg">
                <Badge className={cn('mb-2', roleColors[role])}>
                  {role}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {roleDescriptions[role]}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={!!memberToRemove} onOpenChange={(open) => !open && setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {memberToRemove?.name} ({memberToRemove?.email}) from your organization?
              They will lose access to all resources.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="bg-danger text-white hover:bg-danger/90"
              disabled={removing}
            >
              {removing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
