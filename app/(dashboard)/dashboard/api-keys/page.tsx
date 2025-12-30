'use client';

import { useState } from 'react';
import { Plus, Copy, Check, Trash2, Shield, Loader2, RotateCw, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { useApiKeys, type ApiKey } from '@/hooks/useApiKeys';

export default function ApiKeysPage() {
  const { keys, loading, createKey, revokeKey, deleteKey, refetch } = useApiKeys();
  const [showNewKey, setShowNewKey] = useState(false);
  const [newSecretKey, setNewSecretKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [keyExpiry, setKeyExpiry] = useState('never');
  const [creating, setCreating] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKey | null>(null);
  const [revoking, setRevoking] = useState(false);

  const handleCreateKey = async () => {
    setCreating(true);
    try {
      const expiresInDays = getDaysFromExpiry(keyExpiry);
      const result = await createKey({
        name: keyName || 'Unnamed Key',
        scopes: ['defense:text', 'defense:audio'],
        expiresInDays: expiresInDays > 0 ? expiresInDays : undefined,
      });

      if (result) {
        setNewSecretKey(result.secretKey);
      }
    } finally {
      setCreating(false);
    }
  };

  const getDaysFromExpiry = (expiry: string): number => {
    switch (expiry) {
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
      default: return 0;
    }
  };

  const copyKey = () => {
    if (newSecretKey) {
      navigator.clipboard.writeText(newSecretKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRevokeKey = async () => {
    if (!keyToRevoke) return;
    setRevoking(true);
    try {
      await revokeKey(keyToRevoke.id);
      setKeyToRevoke(null);
    } finally {
      setRevoking(false);
    }
  };

  const resetDialog = () => {
    setShowNewKey(false);
    setNewSecretKey(null);
    setKeyName('');
    setKeyExpiry('never');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const activeKeys = keys.filter(k => k.isActive !== false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">API Keys</h1>
          <p className="text-muted-foreground">
            Manage your API keys for authentication
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RotateCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={showNewKey} onOpenChange={(open) => {
            if (!open) resetDialog();
            else setShowNewKey(true);
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              {!newSecretKey ? (
                <>
                  <DialogHeader>
                    <DialogTitle>Create New API Key</DialogTitle>
                    <DialogDescription>
                      Generate a new API key for your application
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="key-name">Key Name</Label>
                      <Input
                        id="key-name"
                        placeholder="e.g., Production API Key"
                        value={keyName}
                        onChange={(e) => setKeyName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="key-expiry">Expiration</Label>
                      <Select value={keyExpiry} onValueChange={setKeyExpiry}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30d">30 days</SelectItem>
                          <SelectItem value="90d">90 days</SelectItem>
                          <SelectItem value="1y">1 year</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowNewKey(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateKey} disabled={creating}>
                      {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Key
                    </Button>
                  </DialogFooter>
                </>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle>API Key Created</DialogTitle>
                    <DialogDescription>
                      Copy your new API key now. You won&apos;t be able to see it again!
                    </DialogDescription>
                  </DialogHeader>
                  <Alert variant="warning" className="my-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      This is the only time you&apos;ll see this key. Store it securely.
                    </AlertDescription>
                  </Alert>
                  <div className="relative">
                    <code className="block p-4 bg-slate-100 rounded-lg text-sm break-all font-mono">
                      {newSecretKey}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={copyKey}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <DialogFooter>
                    <Button onClick={resetDialog}>
                      Done
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Keys Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            {activeKeys.length} active key(s) · {keys.length} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : keys.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No API keys yet. Create one to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Scopes</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((key) => (
                  <TableRow key={key.id} className={cn(key.isActive === false && 'opacity-50')}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell>
                      <code className="text-sm bg-slate-100 px-2 py-1 rounded font-mono">
                        {key.prefix}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(key.scopes || []).map((scope) => (
                          <Badge key={scope} variant="outline" className="text-xs">
                            {scope.replace(':', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {key.lastUsedAt ? formatDate(key.lastUsedAt) : 'Never'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {key.expiresAt ? formatDate(key.expiresAt) : 'Never'}
                    </TableCell>
                    <TableCell>
                      {key.isActive !== false ? (
                        <Badge variant="success" className="bg-success text-white">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Revoked</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {key.isActive !== false && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-danger hover:text-danger"
                          onClick={() => setKeyToRevoke(key)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Revoke Confirmation Dialog */}
      <AlertDialog open={!!keyToRevoke} onOpenChange={(open) => !open && setKeyToRevoke(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke &quot;{keyToRevoke?.name}&quot;? This action cannot be undone
              and will immediately stop all requests using this key.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevokeKey}
              className="bg-danger text-white hover:bg-danger/90"
              disabled={revoking}
            >
              {revoking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Revoke Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-success mt-0.5" />
              Never share your API keys or commit them to version control
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-success mt-0.5" />
              Use environment variables to store your keys securely
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-success mt-0.5" />
              Rotate your keys regularly and revoke unused ones
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-success mt-0.5" />
              Use different keys for development and production
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Start</CardTitle>
          <CardDescription>Use your API key to make requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-slate-100 font-mono">
              <code>{`curl -X POST https://api.ragaurd.com/v1/defend \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"input": "Your text to analyze"}'`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
