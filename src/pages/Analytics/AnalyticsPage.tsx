import React, { useState } from 'react';
import AnalyticsSkeleton from '@/components/ui/skeleton/analytics-skeleton';
import {

  Download,
  TrendingUp,
  Calendar,
  Users,
  Building2,

  DollarSign,
  CreditCard,
  Activity,
  ArrowUpRight,
  ArrowDownRight,

} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchableSelect from '@/components/ui/searchable-select';
import CsvExportDialog from '@/components/ui/csv-export-dialog';
import Button from '@/components/ui/custom-button';

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

// COLORS constant removed - no longer needed without charts

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
              variant="outlined"
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
           {/* Monthly Performance Stats */}
           <Card className="border-0 shadow-sm">
             <CardHeader className="pb-3">
               <CardTitle className="flex items-center text-lg">
                 <Calendar className="w-4 h-4 mr-2 text-[#0077ED]" />
                  {formatMonth(selectedMonth)} Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                 <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                   <div className="flex items-center space-x-2">
                     <Building2 className="w-4 h-4 text-blue-600" />
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Organizations</span>
                    </div>
                   <span className="text-lg font-bold text-blue-600">
                      {selectedMonthData.organizations || 0}
                    </span>
                  </div>
                 <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30">
                   <div className="flex items-center space-x-2">
                     <Calendar className="w-4 h-4 text-purple-600" />
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Events</span>
                    </div>
                   <span className="text-lg font-bold text-purple-600">
                      {selectedMonthData.events || 0}
                    </span>
                  </div>
                 <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                   <div className="flex items-center space-x-2">
                     <Users className="w-4 h-4 text-green-600" />
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Users</span>
                    </div>
                   <span className="text-lg font-bold text-green-600">
                      {selectedMonthData.users?.toLocaleString() || 0}
                    </span>
                  </div>
                 <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800/30">
                   <div className="flex items-center space-x-2">
                     <DollarSign className="w-4 h-4 text-orange-600" />
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Revenue</span>
                    </div>
                   <span className="text-lg font-bold text-orange-600">
                      {formatCurrency(selectedMonthData.revenue || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

           {/* Growth Metrics */}
           <Card className="border-0 shadow-sm">
             <CardHeader className="pb-3">
               <CardTitle className="flex items-center text-lg">
                 <TrendingUp className="w-4 h-4 mr-2 text-[#0077ED]" />
                 Growth Metrics
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                 <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                   <div className="text-lg font-bold text-blue-600">
                     {growthMetrics.organizations_growth}%
          </div>
                   <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Organizations Growth</div>
                 </div>
                 <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30">
                   <div className="text-lg font-bold text-purple-600">
                     {growthMetrics.events_growth}%
                   </div>
                   <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Events Growth</div>
                 </div>
                 <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                   <div className="text-lg font-bold text-green-600">
                     {growthMetrics.users_growth}%
                   </div>
                   <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Users Growth</div>
                 </div>
                 <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800/30">
                   <div className="text-lg font-bold text-orange-600">
                     {growthMetrics.revenue_growth}%
                   </div>
                   <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Revenue Growth</div>
                 </div>
               </div>
             </CardContent>
           </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
           {/* Revenue Overview */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center text-sm">
                   <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                   Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="text-xl font-bold text-green-600">
                   {formatCurrency(revenueData.total_revenue)}
                 </div>
                 <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   All Time Revenue
                 </div>
              </CardContent>
            </Card>

             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center text-sm">
                   <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                   Monthly Revenue
                 </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="text-xl font-bold text-blue-600">
                   {formatCurrency(revenueData.monthly_revenue)}
                    </div>
                 <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   Current Month
                 </div>
               </CardContent>
             </Card>

             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center text-sm">
                   <CreditCard className="w-4 h-4 mr-2 text-purple-600" />
                      Subscription Revenue
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-xl font-bold text-purple-600">
                   {formatCurrency(selectedRevenueData.subscription_revenue || 0)}
                    </div>
                 <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   {formatMonth(selectedMonth)}
                  </div>
               </CardContent>
             </Card>

             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center text-sm">
                   <Activity className="w-4 h-4 mr-2 text-orange-600" />
                   Event Fees
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-xl font-bold text-orange-600">
                      {formatCurrency(selectedRevenueData.event_fees || 0)}
                    </div>
                 <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   {formatMonth(selectedMonth)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Revenue Organizations */}
           <Card className="border-0 shadow-sm">
             <CardHeader className="pb-3">
               <CardTitle className="text-lg">Top Revenue Organizations</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-2">
                {revenueData.top_revenue_organizations.map((org, index) => (
                   <div key={org._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-3">
                       <div className="w-6 h-6 bg-gradient-to-r from-[#0077ED] to-[#4A9AFF] rounded-md flex items-center justify-center text-white font-bold text-xs">
                        {index + 1}
                      </div>
                      <div>
                         <div className="font-medium text-sm text-gray-900 dark:text-white">{org.name}</div>
                         <div className="text-xs text-gray-600 dark:text-gray-400">
                          Subscription: {formatCurrency(org.subscription_fees)} | 
                          Commissions: {formatCurrency(org.event_commissions)}
                        </div>
                      </div>
                    </div>
                     <div className="font-bold text-sm text-green-600">
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
           {/* Organization Overview */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center text-sm">
                   <Building2 className="w-4 h-4 mr-2 text-blue-600" />
                   Total Organizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="text-xl font-bold text-blue-600">
                   {organizationsData.total_organizations}
                 </div>
                 <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   All Organizations
                 </div>
              </CardContent>
            </Card>

             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center text-sm">
                   <Activity className="w-4 h-4 mr-2 text-green-600" />
                   Active Organizations
                 </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="text-xl font-bold text-green-600">
                   {organizationsData.active_organizations}
                 </div>
                 <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   Currently Active
                 </div>
              </CardContent>
            </Card>

             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center text-sm">
                   <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                   New Signups
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-xl font-bold text-purple-600">
                   {selectedOrganizationsData.signups || 0}
          </div>
                 <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   {formatMonth(selectedMonth)}
                 </div>
               </CardContent>
             </Card>

             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center text-sm">
                   <Building2 className="w-4 h-4 mr-2 text-red-600" />
                   Inactive Organizations
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-xl font-bold text-red-600">
                   {organizationsData.inactive_organizations}
                 </div>
                 <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   Inactive
                 </div>
               </CardContent>
             </Card>
           </div>

           {/* Organizations by Plan */}
           <Card className="border-0 shadow-sm">
             <CardHeader className="pb-3">
               <CardTitle className="text-lg">Organizations by Plan</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-2">
                 {organizationsData.organizations_by_plan.map((plan, index) => (
                   <div key={plan.plan_name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                     <div className="flex items-center space-x-3">
                       <div className="w-6 h-6 bg-gradient-to-r from-[#0077ED] to-[#4A9AFF] rounded-md flex items-center justify-center text-white font-bold text-xs">
                         {index + 1}
                       </div>
                       <div>
                         <div className="font-medium text-sm text-gray-900 dark:text-white">{plan.plan_name}</div>
                         <div className="text-xs text-gray-600 dark:text-gray-400">
                           {plan.percentage}% of total
                         </div>
                       </div>
                     </div>
                     <div className="text-lg font-bold text-blue-600">
                       {plan.count}
                     </div>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>

          {/* Organization Stats for Selected Month */}
           <Card className="border-0 shadow-sm">
             <CardHeader className="pb-3">
               <CardTitle className="text-lg">{formatMonth(selectedMonth)} Organization Stats</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                   <div className="text-lg font-bold text-blue-600">
                    {selectedOrganizationsData.signups || 0}
                  </div>
                   <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">New Signups</div>
                </div>
                 <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                   <div className="text-lg font-bold text-green-600">
                    {organizationsData.active_organizations}
                  </div>
                   <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Active Organizations</div>
                </div>
                 <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
                   <div className="text-lg font-bold text-red-600">
                    {organizationsData.inactive_organizations}
                  </div>
                   <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Inactive Organizations</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
           {/* Event Overview */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center text-sm">
                   <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                   Total Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="text-xl font-bold text-blue-600">
                   {eventsData.total_events}
                 </div>
                 <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   All Events
                 </div>
              </CardContent>
            </Card>

             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center text-sm">
                   <Activity className="w-4 h-4 mr-2 text-green-600" />
                   Active Events
                 </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="text-xl font-bold text-green-600">
                   {eventsData.active_events}
                    </div>
                 <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   Currently Active
                  </div>
               </CardContent>
             </Card>

             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center text-sm">
                   <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                   Completed Events
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-xl font-bold text-purple-600">
                   {eventsData.completed_events}
                    </div>
                 <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   Successfully Completed
                  </div>
               </CardContent>
             </Card>

             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center text-sm">
                   <Users className="w-4 h-4 mr-2 text-orange-600" />
                   Avg. Attendees
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-xl font-bold text-orange-600">
                   {eventsData.average_attendees}
                    </div>
                 <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   Per Event
                  </div>
               </CardContent>
             </Card>
                    </div>

           {/* Event Status Overview */}
           <Card className="border-0 shadow-sm">
             <CardHeader className="pb-3">
               <CardTitle className="text-lg">Event Status Overview</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                 <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                   <div className="flex items-center space-x-2">
                     <Activity className="w-4 h-4 text-green-600" />
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Events</span>
                   </div>
                   <span className="text-lg font-bold text-green-600">{eventsData.active_events}</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                   <div className="flex items-center space-x-2">
                     <Calendar className="w-4 h-4 text-blue-600" />
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Completed Events</span>
                   </div>
                   <span className="text-lg font-bold text-blue-600">{eventsData.completed_events}</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
                   <div className="flex items-center space-x-2">
                     <Activity className="w-4 h-4 text-red-600" />
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cancelled Events</span>
                   </div>
                   <span className="text-lg font-bold text-red-600">{eventsData.cancelled_events}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          {/* Selected Month Event Stats */}
           <Card className="border-0 shadow-sm">
             <CardHeader className="pb-3">
               <CardTitle className="text-lg">{formatMonth(selectedMonth)} Event Performance</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30">
                   <div className="text-lg font-bold text-purple-600">
                    {selectedEventsData.events_created || 0}
                  </div>
                   <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Events Created</div>
                </div>
                 <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                   <div className="text-lg font-bold text-green-600">
                    {selectedEventsData.events_completed || 0}
                  </div>
                   <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Events Completed</div>
                </div>
                 <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                   <div className="text-lg font-bold text-blue-600">
                    {selectedEventsData.total_attendees?.toLocaleString() || 0}
                  </div>
                   <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total Attendees</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
           {/* User Overview */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center text-sm">
                   <Users className="w-4 h-4 mr-2 text-green-600" />
                   Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="text-xl font-bold text-green-600">
                   {usersData.total_users.toLocaleString()}
                 </div>
                 <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   All Users
                 </div>
              </CardContent>
            </Card>

             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center text-sm">
                   <Activity className="w-4 h-4 mr-2 text-blue-600" />
                   Active Users
                 </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="text-xl font-bold text-blue-600">
                   {usersData.active_users.toLocaleString()}
                    </div>
                 <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   Currently Active
                 </div>
               </CardContent>
             </Card>

             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center text-sm">
                   <Users className="w-4 h-4 mr-2 text-purple-600" />
                   New Users
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-xl font-bold text-purple-600">
                   {selectedUsersData.new_users?.toLocaleString() || 0}
                 </div>
                 <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   {formatMonth(selectedMonth)}
                 </div>
               </CardContent>
             </Card>

             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center text-sm">
                   <Users className="w-4 h-4 mr-2 text-red-600" />
                   Inactive Users
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-xl font-bold text-red-600">
                   {usersData.inactive_users.toLocaleString()}
                 </div>
                 <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   Inactive
                 </div>
               </CardContent>
             </Card>
           </div>

           {/* User Statistics */}
           <Card className="border-0 shadow-sm">
             <CardHeader className="pb-3">
               <CardTitle className="text-lg">User Statistics</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                 <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                   <div className="flex items-center space-x-2">
                     <Users className="w-4 h-4 text-green-600" />
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Users</span>
                   </div>
                   <span className="text-lg font-bold text-green-600">
                      {usersData.total_users.toLocaleString()}
                    </span>
                  </div>
                 <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                   <div className="flex items-center space-x-2">
                     <Activity className="w-4 h-4 text-blue-600" />
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Users</span>
                    </div>
                   <span className="text-lg font-bold text-blue-600">
                      {usersData.active_users.toLocaleString()}
                    </span>
                  </div>
                 <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
                   <div className="flex items-center space-x-2">
                     <Users className="w-4 h-4 text-red-600" />
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Inactive Users</span>
                    </div>
                   <span className="text-lg font-bold text-red-600">
                      {usersData.inactive_users.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

          {/* Selected Month User Stats */}
           <Card className="border-0 shadow-sm">
             <CardHeader className="pb-3">
               <CardTitle className="text-lg">{formatMonth(selectedMonth)} User Activity</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                   <div className="text-xl font-bold text-blue-600">
                    {selectedUsersData.new_users?.toLocaleString() || 0}
                  </div>
                   <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">New Users</div>
                </div>
                 <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                   <div className="text-xl font-bold text-green-600">
                    {selectedUsersData.active_users?.toLocaleString() || 0}
                  </div>
                   <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Active Users</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="space-y-6">
           {/* Subscription Overview */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center text-sm">
                   <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                   Total Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="text-xl font-bold text-blue-600">
                   {subscriptionsData.total_subscriptions}
                 </div>
                 <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   All Subscriptions
                 </div>
              </CardContent>
            </Card>

             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center text-sm">
                   <Activity className="w-4 h-4 mr-2 text-green-600" />
                   Active Subscriptions
                 </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="text-xl font-bold text-green-600">
                   {subscriptionsData.active_subscriptions}
                    </div>
                 <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   Currently Active
                 </div>
               </CardContent>
             </Card>

             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center text-sm">
                   <CreditCard className="w-4 h-4 mr-2 text-purple-600" />
                   New Subscriptions
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-xl font-bold text-purple-600">
                   {selectedSubscriptionsData.new || 0}
                 </div>
                 <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   {formatMonth(selectedMonth)}
                 </div>
               </CardContent>
             </Card>

             <Card className="border-0 shadow-sm">
               <CardHeader className="pb-3">
                 <CardTitle className="flex items-center text-sm">
                   <DollarSign className="w-4 h-4 mr-2 text-orange-600" />
                   Monthly Revenue
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-xl font-bold text-orange-600">
                   {formatCurrency(subscriptionsData.revenue)}
                 </div>
                 <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                   Current Month
                 </div>
               </CardContent>
             </Card>
           </div>

           {/* Subscription Statistics */}
           <Card className="border-0 shadow-sm">
             <CardHeader className="pb-3">
               <CardTitle className="text-lg">Subscription Statistics</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                 <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                   <div className="flex items-center space-x-2">
                     <CreditCard className="w-4 h-4 text-green-600" />
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Subscriptions</span>
                   </div>
                   <span className="text-lg font-bold text-green-600">
                      {subscriptionsData.active_subscriptions}
                    </span>
                  </div>
                 <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
                   <div className="flex items-center space-x-2">
                     <CreditCard className="w-4 h-4 text-red-600" />
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Inactive Subscriptions</span>
                    </div>
                   <span className="text-lg font-bold text-red-600">
                      {subscriptionsData.inactive_subscriptions}
                    </span>
                  </div>
                 <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                   <div className="flex items-center space-x-2">
                     <DollarSign className="w-4 h-4 text-blue-600" />
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Revenue</span>
                    </div>
                   <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(subscriptionsData.revenue)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

          {/* Selected Month Subscription Stats */}
           <Card className="border-0 shadow-sm">
             <CardHeader className="pb-3">
               <CardTitle className="text-lg">{formatMonth(selectedMonth)} Subscription Performance</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                   <div className="text-lg font-bold text-green-600">
                    {selectedSubscriptionsData.active || 0}
                  </div>
                   <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Active Subscriptions</div>
                </div>
                 <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                   <div className="text-lg font-bold text-blue-600">
                    {selectedSubscriptionsData.new || 0}
                  </div>
                   <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">New Subscriptions</div>
                </div>
                 <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30">
                   <div className="text-lg font-bold text-purple-600">
                    {formatCurrency(selectedSubscriptionsData.revenue || 0)}
                  </div>
                   <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Monthly Revenue</div>
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