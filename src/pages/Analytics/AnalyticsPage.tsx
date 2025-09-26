import React, { useState } from 'react';
import AnalyticsSkeleton from '@/components/ui/skeleton/analytics-skeleton';
import {
  BarChart3,
  Download,
  TrendingUp,
  Calendar,
  Users,
  Building2,
  Building,
  DollarSign,
  CreditCard,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchableSelect from '@/components/ui/searchable-select';
import { Badge } from '@/components/ui/badge';
import CsvExportDialog from '@/components/ui/csv-export-dialog';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Button } from '@/components/ui/button';

// Data sets
const platformStats = {
  total_organizations: 150,
  total_companies: 80,
  total_events: 450,
  total_users: 12500,
  total_revenue: 250000,
  monthly_revenue: 45000,
  active_subscriptions: 145
};

const growthMetrics = {
  organizations_growth: 15.5,
  events_growth: 23.2,
  users_growth: 18.7,
  revenue_growth: 12.3
};

const monthlyData = [
  { month: "2025-08", organizations: 15, events: 85, users: 2500, revenue: 45000 },
  { month: "2025-07", organizations: 12, events: 72, users: 2100, revenue: 38000 },
  { month: "2025-06", organizations: 10, events: 68, users: 1900, revenue: 35000 },
  { month: "2025-05", organizations: 8, events: 55, users: 1700, revenue: 32000 },
  { month: "2025-04", organizations: 7, events: 48, users: 1500, revenue: 28000 },
  { month: "2025-03", organizations: 6, events: 42, users: 1300, revenue: 25000 },
];

const revenueData = {
  total_revenue: 250000,
  monthly_revenue: 45000,
  commission_earned: 12500,
  subscription_revenue: 35000,
  event_fees_revenue: 10000,
  revenue_by_month: [
    { month: "2025-08", subscription_revenue: 35000, event_fees: 10000, total: 45000 },
    { month: "2025-07", subscription_revenue: 30000, event_fees: 8000, total: 38000 },
    { month: "2025-06", subscription_revenue: 28000, event_fees: 7000, total: 35000 },
    { month: "2025-05", subscription_revenue: 25000, event_fees: 7000, total: 32000 },
    { month: "2025-04", subscription_revenue: 22000, event_fees: 6000, total: 28000 },
    { month: "2025-03", subscription_revenue: 20000, event_fees: 5000, total: 25000 },
  ],
  top_revenue_organizations: [
    { _id: "org_123", name: "TechCorp Events", total_revenue: 50000, subscription_fees: 1200, event_commissions: 2500 },
    { _id: "org_124", name: "Innovation Labs", total_revenue: 35000, subscription_fees: 900, event_commissions: 1800 },
    { _id: "org_125", name: "StartupHub", total_revenue: 28000, subscription_fees: 800, event_commissions: 1500 },
  ]
};

const organizationsData = {
  total_organizations: 150,
  active_organizations: 145,
  inactive_organizations: 5,
  organizations_by_plan: [
    { plan_name: "Professional Plan", count: 85, percentage: 56.7 },
    { plan_name: "Starter Plan", count: 60, percentage: 40.0 },
    { plan_name: "Enterprise Plan", count: 5, percentage: 3.3 }
  ],
  organizations_by_status: { active: 145, paid: 135, free: 10 },
  monthly_signups: [
    { month: "2025-08", signups: 15 },
    { month: "2025-07", signups: 12 },
    { month: "2025-06", signups: 10 },
    { month: "2025-05", signups: 8 },
    { month: "2025-04", signups: 7 },
    { month: "2025-03", signups: 6 },
  ]
};

const eventsData = {
  total_events: 450,
  active_events: 85,
  completed_events: 350,
  cancelled_events: 15,
  average_attendees: 278,
  total_attendees: 125000,
  events_by_month: [
    { month: "2025-08", events_created: 85, events_completed: 65, total_attendees: 18000 },
    { month: "2025-07", events_created: 72, events_completed: 58, total_attendees: 16000 },
    { month: "2025-06", events_created: 68, events_completed: 55, total_attendees: 15000 },
    { month: "2025-05", events_created: 55, events_completed: 48, total_attendees: 13000 },
    { month: "2025-04", events_created: 48, events_completed: 42, total_attendees: 12000 },
    { month: "2025-03", events_created: 42, events_completed: 38, total_attendees: 11000 },
  ]
};

const usersData = {
  total_users: 12500,
  active_users: 11800,
  inactive_users: 700,
  users_by_month: [
    { month: "2025-08", new_users: 2500, active_users: 1950 },
    { month: "2025-07", new_users: 2100, active_users: 1800 },
    { month: "2025-06", new_users: 1900, active_users: 1650 },
    { month: "2025-05", new_users: 1700, active_users: 1500 },
    { month: "2025-04", new_users: 1500, active_users: 1350 },
    { month: "2025-03", new_users: 1300, active_users: 1200 },
  ]
};

const subscriptionsData = {
  total_subscriptions: 145,
  active_subscriptions: 140,
  inactive_subscriptions: 5,
  revenue: 45000,
  monthly_subscriptions: [
    { month: "2025-08", active: 140, new: 10, revenue: 45000 },
    { month: "2025-07", active: 130, new: 8, revenue: 38000 },
    { month: "2025-06", active: 122, new: 6, revenue: 35000 },
    { month: "2025-05", active: 116, new: 5, revenue: 32000 },
    { month: "2025-04", active: 111, new: 4, revenue: 28000 },
    { month: "2025-03", active: 107, new: 3, revenue: 25000 },
  ]
};

const COLORS = ['#0077ED', '#4A9AFF', '#8CC0FF', '#B8D4FF', '#E1EFFF'];

const AnalyticsPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('2025-08');
  const [loading, setLoading] = useState(true);

  // CSV Export state
  const [exportDialog, setExportDialog] = useState(false);

  // Format month helper function
  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  // Get available months from the data
  const availableMonths = monthlyData.map(item => item.month).sort().reverse();
  
  // Convert to SearchableSelect format
  const monthOptions = availableMonths.map(month => ({
    value: month,
    label: formatMonth(month)
  }));

  React.useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowUpRight className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowDownRight className="w-4 h-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-500' : 'text-red-500';
  };

  // Filter data by selected month
  const getMonthlyData = (dataArray: any[], month: string) => {
    return dataArray.find(item => item.month === month) || {};
  };

  const selectedMonthData = getMonthlyData(monthlyData, selectedMonth);
  const selectedRevenueData = getMonthlyData(revenueData.revenue_by_month, selectedMonth);
  const selectedEventsData = getMonthlyData(eventsData.events_by_month, selectedMonth);
  const selectedUsersData = getMonthlyData(usersData.users_by_month, selectedMonth);
  const selectedSubscriptionsData = getMonthlyData(subscriptionsData.monthly_subscriptions, selectedMonth);
  const selectedOrganizationsData = getMonthlyData(organizationsData.monthly_signups, selectedMonth);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive insights into your platform performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setExportDialog(true)}
              variant="outline"
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <SearchableSelect
              options={monthOptions}
              value={selectedMonth}
              onChange={setSelectedMonth}
              placeholder="Select month"
              className="w-48"
              search={true}
            />
          </div>
        </div>
      </div>

      {/* Platform Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Organizations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {platformStats.total_organizations}
                </p>
                <div className="flex items-center mt-2">
                  {getGrowthIcon(growthMetrics.organizations_growth)}
                  <span className={`text-sm font-medium ml-1 ${getGrowthColor(growthMetrics.organizations_growth)}`}>
                    {growthMetrics.organizations_growth}%
                  </span>
                </div>
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Total Events</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {platformStats.total_events}
                </p>
                <div className="flex items-center mt-2">
                  {getGrowthIcon(growthMetrics.events_growth)}
                  <span className={`text-sm font-medium ml-1 ${getGrowthColor(growthMetrics.events_growth)}`}>
                    {growthMetrics.events_growth}%
                  </span>
                </div>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {platformStats.total_users.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  {getGrowthIcon(growthMetrics.users_growth)}
                  <span className={`text-sm font-medium ml-1 ${getGrowthColor(growthMetrics.users_growth)}`}>
                    {growthMetrics.users_growth}%
                  </span>
                </div>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(platformStats.total_revenue)}
                </p>
                <div className="flex items-center mt-2">
                  {getGrowthIcon(growthMetrics.revenue_growth)}
                  <span className={`text-sm font-medium ml-1 ${getGrowthColor(growthMetrics.revenue_growth)}`}>
                    {growthMetrics.revenue_growth}%
                  </span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-[#0077ED]" />
                  Monthly Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      tickFormatter={(value) => formatMonth(value).split(' ')[0]}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => formatMonth(value)}
                      formatter={(value: any, name: string) => [
                        name === 'revenue' ? formatCurrency(value) : value.toLocaleString(),
                        name.charAt(0).toUpperCase() + name.slice(1)
                      ]}
                    />
                    <Line type="monotone" dataKey="organizations" stroke="#0077ED" strokeWidth={2} />
                    <Line type="monotone" dataKey="events" stroke="#4A9AFF" strokeWidth={2} />
                    <Line type="monotone" dataKey="users" stroke="#8CC0FF" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Selected Month Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-[#0077ED]" />
                  {formatMonth(selectedMonth)} Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Organizations</span>
                    </div>
                    <span className="font-bold text-blue-600">
                      {selectedMonthData.organizations || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">Events</span>
                    </div>
                    <span className="font-bold text-purple-600">
                      {selectedMonthData.events || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Users</span>
                    </div>
                    <span className="font-bold text-green-600">
                      {selectedMonthData.users?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-orange-600" />
                      <span className="font-medium">Revenue</span>
                    </div>
                    <span className="font-bold text-orange-600">
                      {formatCurrency(selectedMonthData.revenue || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Breakdown */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-[#0077ED]" />
                  Revenue Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData.revenue_by_month}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      tickFormatter={(value) => formatMonth(value).split(' ')[0]}
                    />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip 
                      labelFormatter={(value) => formatMonth(value)}
                      formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                    />
                    <Bar dataKey="subscription_revenue" stackId="a" fill="#0077ED" />
                    <Bar dataKey="event_fees" stackId="a" fill="#4A9AFF" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(selectedRevenueData.subscription_revenue || 0)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Subscription Revenue
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      {formatCurrency(selectedRevenueData.event_fees || 0)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Event Fees
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      {formatCurrency(selectedRevenueData.total || 0)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total Revenue
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Revenue Organizations */}
          <Card>
            <CardHeader>
              <CardTitle>Top Revenue Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {revenueData.top_revenue_organizations.map((org, index) => (
                  <div key={org._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#0077ED] to-[#4A9AFF] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{org.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Subscription: {formatCurrency(org.subscription_fees)} | 
                          Commissions: {formatCurrency(org.event_commissions)}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-green-600">
                      {formatCurrency(org.total_revenue)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organizations Tab */}
        <TabsContent value="organizations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Organizations by Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-[#0077ED]" />
                  Organizations by Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={organizationsData.organizations_by_plan}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ plan_name, percentage }) => `${plan_name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {organizationsData.organizations_by_plan.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [value, 'Organizations']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Signups */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Signups</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={organizationsData.monthly_signups}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      tickFormatter={(value) => formatMonth(value).split(' ')[0]}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => formatMonth(value)}
                      formatter={(value: any) => [value, 'Signups']}
                    />
                    <Bar dataKey="signups" fill="#0077ED" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Organization Stats for Selected Month */}
          <Card>
            <CardHeader>
              <CardTitle>{formatMonth(selectedMonth)} Organization Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedOrganizationsData.signups || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">New Signups</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {organizationsData.active_organizations}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Organizations</div>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {organizationsData.inactive_organizations}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Inactive Organizations</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Events by Month */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-[#0077ED]" />
                  Events by Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={eventsData.events_by_month}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      tickFormatter={(value) => formatMonth(value).split(' ')[0]}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => formatMonth(value)}
                      formatter={(value: any, name: string) => [
                        value.toLocaleString(),
                        name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                      ]}
                    />
                    <Bar dataKey="events_created" fill="#0077ED" />
                    <Bar dataKey="events_completed" fill="#4A9AFF" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Event Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Event Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Activity className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Active Events</span>
                    </div>
                    <span className="font-bold text-green-600">{eventsData.active_events}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Completed Events</span>
                    </div>
                    <span className="font-bold text-blue-600">{eventsData.completed_events}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Activity className="w-5 h-5 text-red-600" />
                      <span className="font-medium">Cancelled Events</span>
                    </div>
                    <span className="font-bold text-red-600">{eventsData.cancelled_events}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">Avg. Attendees</span>
                    </div>
                    <span className="font-bold text-purple-600">{eventsData.average_attendees}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Month Event Stats */}
          <Card>
            <CardHeader>
              <CardTitle>{formatMonth(selectedMonth)} Event Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedEventsData.events_created || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Events Created</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedEventsData.events_completed || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Events Completed</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedEventsData.total_attendees?.toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Attendees</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-[#0077ED]" />
                  User Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={usersData.users_by_month}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      tickFormatter={(value) => formatMonth(value).split(' ')[0]}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => formatMonth(value)}
                      formatter={(value: any, name: string) => [
                        value.toLocaleString(),
                        name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                      ]}
                    />
                    <Line type="monotone" dataKey="new_users" stroke="#0077ED" strokeWidth={2} />
                    <Line type="monotone" dataKey="active_users" stroke="#4A9AFF" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Stats */}
            <Card>
              <CardHeader>
                <CardTitle>User Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Total Users</span>
                    </div>
                    <span className="font-bold text-green-600">
                      {usersData.total_users.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Activity className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Active Users</span>
                    </div>
                    <span className="font-bold text-blue-600">
                      {usersData.active_users.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-red-600" />
                      <span className="font-medium">Inactive Users</span>
                    </div>
                    <span className="font-bold text-red-600">
                      {usersData.inactive_users.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Month User Stats */}
          <Card>
            <CardHeader>
              <CardTitle>{formatMonth(selectedMonth)} User Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {selectedUsersData.new_users?.toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">New Users</div>
                </div>
                <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {selectedUsersData.active_users?.toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Active Users</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subscription Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-[#0077ED]" />
                  Subscription Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={subscriptionsData.monthly_subscriptions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      tickFormatter={(value) => formatMonth(value).split(' ')[0]}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => formatMonth(value)}
                      formatter={(value: any, name: string) => [
                        name === 'revenue' ? formatCurrency(value) : value.toLocaleString(),
                        name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                      ]}
                    />
                    <Line type="monotone" dataKey="active" stroke="#0077ED" strokeWidth={2} />
                    <Line type="monotone" dataKey="new" stroke="#4A9AFF" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Subscription Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Subscription Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Active Subscriptions</span>
                    </div>
                    <span className="font-bold text-green-600">
                      {subscriptionsData.active_subscriptions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-red-600" />
                      <span className="font-medium">Inactive Subscriptions</span>
                    </div>
                    <span className="font-bold text-red-600">
                      {subscriptionsData.inactive_subscriptions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Monthly Revenue</span>
                    </div>
                    <span className="font-bold text-blue-600">
                      {formatCurrency(subscriptionsData.revenue)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Month Subscription Stats */}
          <Card>
            <CardHeader>
              <CardTitle>{formatMonth(selectedMonth)} Subscription Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedSubscriptionsData.active || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Subscriptions</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedSubscriptionsData.new || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">New Subscriptions</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(selectedSubscriptionsData.revenue || 0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* CSV Export Dialog */}
      <CsvExportDialog
        open={exportDialog}
        onOpenChange={setExportDialog}
        exportType="analytics"
        title="Analytics Data"
      />
    </div>
  );
};

export default AnalyticsPage;