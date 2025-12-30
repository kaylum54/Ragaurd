import { Metadata } from 'next';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Monitor your Voice AI security in real-time',
};

export default function DashboardPage() {
  return <DashboardContent />;
}
