import { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Github, Chrome, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your Ragaurd account and start protecting your Voice AI',
};

const benefits = [
  '500 free text defense requests/month',
  'Real-time threat detection',
  'Dashboard analytics',
  'API access in seconds',
];

export default function SignupPage() {
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>

          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Logo href={undefined} />
              </div>
              <CardTitle className="text-2xl">Create your account</CardTitle>
              <CardDescription>Get started with 500 free requests/month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* OAuth Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  <Chrome className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Email Form */}
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Min. 8 characters" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company (optional)</Label>
                  <Input id="company" placeholder="Acme Inc." />
                </div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-600 hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-8">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Right side - Benefits (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-primary-900 items-center justify-center p-8">
        <div className="max-w-md text-white">
          <h2 className="text-3xl font-bold mb-6">
            Start protecting your Voice AI today
          </h2>
          <p className="text-primary-100 mb-8">
            Join thousands of developers securing their AI agents with Ragaurd.
            No credit card required.
          </p>
          <ul className="space-y-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-success flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-primary-100">{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 p-6 bg-white/10 rounded-lg">
            <p className="text-sm text-primary-100 italic">
              &quot;Ragaurd blocked over 50,000 attack attempts in our first month.
              The setup took 10 minutes.&quot;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary-700" />
              <div>
                <div className="font-medium">Sarah Chen</div>
                <div className="text-sm text-primary-200">CTO, VoiceAI Labs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
