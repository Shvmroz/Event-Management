import React from "react";
import DashboardSkeleton from "@/components/ui/skeleton/dashboard-skeleton";
import {
  Calendar,
  Building2,
  TrendingUp,
  DollarSign,
  CreditCard,
  ChevronRight,
  Building,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/custom-button";

// Dummy data matching your API response structure
const dashboardData = {
  data: {
    total_organizations: 150,
    total_companies: 300,
    total_revenue: 250000,
    monthly_revenue: 45000,
    total_users: 300,
    active_subscriptions: 145,
    top_organizations: [
      {
        _id: "org_456",
        name: "TechCorp Events",
        total_events: 25,
        total_revenue: 50000,
      },
      {
        _id: "org_789",
        name: "Innovation Labs",
        total_events: 18,
        total_revenue: 35000,
      },
      {
        _id: "org_123",
        name: "StartupHub",
        total_events: 15,
        total_revenue: 28000,
      },
      {
        _id: "org_321",
        name: "Digital Summit Co",
        total_events: 12,
        total_revenue: 22000,
      },
      {
        _id: "org_654",
        name: "Event Masters",
        total_events: 10,
        total_revenue: 18000,
      },
    ],
  },
};

// format ISO → "2m ago"
function timeAgo(isoDate: string) {
  const date = new Date(isoDate);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

  return date.toLocaleDateString();
}

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  onClick: () => void;
}> = ({ title, value, icon, color, bgColor, onClick }) => (
  <div
    onClick={onClick}
    className={`${bgColor} dark:bg-gray-800 rounded-xl px-6 py-3 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer relative overflow-hidden group`}
  >
    {/* Background Icon */}
    <div className="absolute top-1 right-1 w-20 h-20 opacity-10 transform rotate-12">
      {/* use this to set size of icon */}
      {React.cloneElement(icon as React.ReactElement, {
        className: `w-full h-full ${color}`,
      })}
    </div>

    <div className="flex items-start justify-between relative z-10">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-4">
          <div className={color}>{icon}</div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            {title}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const OrganizationRow: React.FC<{
  organization: {
    _id: string;
    name: string;
    total_events: number;
    total_revenue: number;
  };
  rank: number;
  maxRevenue: number;
}> = ({ organization, rank }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200">
    <td className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
      #{rank}
    </td>
    <td className="px-6 py-3">
      <div className="font-[500] text-sm text-gray-900 dark:text-white">
        {organization.name}
      </div>
    </td>
    <td className="px-6 py-3">
      <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 text-sm">
        <Calendar className="w-3.5 h-3.5 text-orange-500" />
        <span>{organization.total_events}</span>
      </div>
    </td>
    <td className="px-6 py-3">
      <div className="text-green-600 dark:text-green-400 font-semibold text-sm">
        ${organization.total_revenue.toLocaleString()}
      </div>
    </td>
  </tr>
);

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data } = dashboardData;
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  // Recent activities ISO dataset
  const recentActivities = [
    {
      type: "organization",
      title: "New Organization Registered ",
      description: "TechCorp Events joined",
      time: "2025-09-03T10:25:00Z",
    },
    {
      type: "event",
      title: "Event Created",
      description: "Annual Tech Summit 2024 created",
      time: "2025-09-03T10:12:00Z",
    },
    {
      type: "payment",
      title: "Payment Received",
      description: "$299 for event registration",
      time: "2025-09-03T09:30:00Z",
    },
    {
      type: "user",
      title: "New User",
      description: "Shamroz khan registered",
      time: "2025-09-03T08:45:00Z",
    },
    {
      type: "subscription",
      title: "Subscription Renewed",
      description: "Innovation Labs renewed",
      time: "2025-09-03T08:00:00Z",
    },
  ];

  // Map type → style
  const activityStyles: Record<
    string,
    { icon: any; color: string; bg: string }
  > = {
    organization: {
      icon: Building2,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-900/30",
    },
    event: {
      icon: Calendar,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-900/30",
    },
    payment: {
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-900/30",
    },
    user: {
      icon: User,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-900/30",
    },
    subscription: {
      icon: CreditCard,
      color: "text-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-900/30",
    },
  };

  const maxRevenue = Math.max(
    ...data.top_organizations.map((org) => org.total_revenue)
  );

  const metrics = [
    {
      title: "Total Organizations",
      value: data.total_organizations,
      icon: <Building2 className="w-5 h-5" />,
      color: "text-sky-600",
      bgColor: "bg-sky-50 dark:bg-sky-900/20",
      path: "/organizations",
    },
    {
      title: "Total Companies",
      value: data.total_companies,
      icon: <Building className="w-5 h-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      path: "/companies",
    },
    {
      title: "Total Users",
      value: data.total_users,
      icon: <User className="w-5 h-5" />,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      path: "/analytics",
    },
    {
      title: "Active Subscriptions",
      value: data.active_subscriptions,
      icon: <CreditCard className="w-5 h-5" />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      path: "/analytics",
    },
    {
      title: "Monthly Revenue",
      value: `$${data.monthly_revenue.toLocaleString()}`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      path: "/analytics",
    },
    {
      title: "Total Revenue",
      value: `$${data.total_revenue.toLocaleString()}`,
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      path: "/analytics",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor your platform performance and key metrics
          </p>
        </div>
        <Button
          className="hidden sm:flex space-x-2 items-center"
          variant="contained"
          color="primary"
          onClick={() => navigate("/analytics")}
        >
          <TrendingUp className="w-4 h-4" />
          <span>View Analytics</span>
        </Button>
      </div>


      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, i) => (
          <MetricCard
            key={i}
            {...metric}
            onClick={() => navigate(metric.path)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Organizations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-[360px]">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Top Organizations
            </h2>
            <span
              onClick={() => navigate("/organizations")}
              className="flex items-center space-x-1 text-orange-500 hover:text-orange-600 text-sm font-medium cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Events
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.top_organizations.map((org, i) => (
                  <OrganizationRow
                    key={org._id}
                    organization={org}
                    rank={i + 1}
                    maxRevenue={maxRevenue}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-[360px]">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Activities
            </h2>
          </div>

          {/* Fixed height scrollable content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {recentActivities.map((activity, i) => {
              const style = activityStyles[activity.type];
              return (
                <div
                  key={i}
                  className={`flex justify-between items-start p-2 rounded-lg transition-all duration-200 hover:shadow-sm ${style.bg} border border-transparent hover:border-gray-200 dark:hover:border-gray-600`}
                >
                  {/* Left: Icon + Text */}
                  <div className="flex items-start space-x-2 flex-1 min-w-0">
                    <div className={`p-1.5 rounded-md ${style.bg}`}>
                      <style.icon className={`w-4 h-4 ${style.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {activity.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Time */}
                  <div className="flex-shrink-0 ml-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {timeAgo(activity.time)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
