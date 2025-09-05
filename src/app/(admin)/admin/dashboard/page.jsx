'use client';

import DashboardStatsCard from '@/components/admin/DashboardStatsCard';
import { Calendar, Briefcase, Users, PieChart } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatsCard 
          title="Total Events" 
          value="142" 
          description="Upcoming & Past Events"
          icon={Calendar}
        />
        <DashboardStatsCard 
          title="Active Vendors" 
          value="89" 
          description="Verified Marketplace Vendors"
          icon={Briefcase}
        />
        <DashboardStatsCard 
          title="New Users This Month" 
          value="1,204" 
          description="+15% from last month"
          icon={Users}
        />
        <DashboardStatsCard 
          title="Revenue (This Month)" 
          value="$25,600" 
          description="From Vendor Subscriptions"
          icon={PieChart}
        />
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Recent Activity</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Activity feed will be displayed here.</p>
      </div>
    </div>
  );
}