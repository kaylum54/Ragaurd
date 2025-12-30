'use client';

import { useState } from 'react';
import { Key, Plus, Copy, Check, Trash2, Clock, Shield, AlertTriangle } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
}

// Mock data
const mockKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production API Key',
    prefix: 'rg_live_abc123...',
    scopes: ['defense:text', 'defense:audio'],
    createdAt: '2024-12-01T00:00:00Z',
    lastUsedAt: '2024-12-30T12:00:00Z',
    expiresAt: null,
    isActive: true,
  },
  {
    id: '2',
    name: 'Development Key',
    prefix: 'rg_live_def456...',
    scopes: ['defense:text'],
    createdAt: '2024-12-15T00:00:00Z',
    lastUsedAt: '2024-12-29T18:00:00Z',
    expiresAt: '2025-03-15T00:00:00Z',
    isActive: true,
  },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(mockKeys);
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [keyExpiry, setKeyExpiry] = useState('never');

  const createKey = () => {
    // Simulate key creation
    const generatedKey = `rg_live_${Array(64).fill(0).map(() => Math.random().toString(36)[2]).join('')}`;
    setNewKey(generatedKey);

    // Add to list with prefix only
    const newApiKey: ApiKey = {
      id: String(keys.length + 1),
      name: keyName || 'Unnamed Key',
      prefix: generatedKey.substring(0, 15) + '...',
      scopes: ['defense:text'],
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
      expiresAt: keyExpiry !== 'never' ? new Date(Date.now() + getDaysFromExpiry(keyExpiry) * 24 * 60 * 60 * 1000).toISOString() : null,
      isActive: true,
    };
    setKeys([...keys, newApiKey]);
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
    if (newKey) {
      navigator.clipboard.writeText(newKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const revokeKey = (id: string) => {
    setKeys(keys.map(k => k.id === id ? { ...k, isActive: false } : k));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

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
        <Dialog open={showNewKey} onOpenChange={setShowNewKey}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            {!newKey ? (
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
                  <Button onClick={createKey}>Create Key</Button>
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
                  <code className="block p-4 bg-slate-100 rounded-lg text-sm break-all">
                    {newKey}
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
                  <Button
                    onClick={() => {
                      setShowNewKey(false);
                      setNewKey(null);
                      setKeyName('');
                      setKeyExpiry('never');
                    }}
                  >
                    Done
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Keys Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            {keys.filter(k => k.isActive).length} active key(s) · {keys.length} total
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                <TableRow key={key.id} className={cn(!key.isActive && 'opacity-50')}>
                  <TableCell className="font-medium">{key.name}</TableCell>
                  <TableCell>
                    <code className="text-sm bg-slate-100 px-2 py-1 rounded">
                      {key.prefix}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {key.scopes.map((scope) => (
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
                    {key.isActive ? (
                      <Badge variant="success" className="bg-success text-white">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Revoked</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {key.isActive && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-danger hover:text-danger"
                        onClick={() => revokeKey(key.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
    </div>
  );
}
