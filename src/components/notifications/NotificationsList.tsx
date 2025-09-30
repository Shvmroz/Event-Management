import React from "react";
import {
  Bell,
  Calendar,
  Users,
  Building2,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  MailOpen,
  Mail,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAppContext } from "@/contexts/AppContext";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "event":
      return <Calendar className="w-5 h-5" />;
    case "user":
      return <Users className="w-5 h-5" />;
    case "organization":
      return <Building2 className="w-5 h-5" />;
    case "payment":
      return <DollarSign className="w-5 h-5" />;
    case "alert":
      return <AlertTriangle className="w-5 h-5" />;
    case "success":
      return <CheckCircle className="w-5 h-5" />;
    case "info":
    default:
      return <Info className="w-5 h-5" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case "event":
      return "text-purple-600";
    case "user":
      return "text-green-600";
    case "organization":
      return "text-blue-600";
    case "payment":
      return "text-emerald-600";
    case "alert":
      return "text-red-600";
    case "success":
      return "text-green-600";
    case "info":
    default:
      return "text-gray-600";
  }
};

const getNotificationBgColor = (type: string) => {
  switch (type) {
    case "event":
      return "bg-purple-50 dark:bg-purple-900/20";
    case "user":
      return "bg-green-50 dark:bg-green-900/20";
    case "organization":
      return "bg-blue-50 dark:bg-blue-900/20";
    case "payment":
      return "bg-emerald-50 dark:bg-emerald-900/20";
    case "alert":
      return "bg-red-50 dark:bg-red-900/20";
    case "success":
      return "bg-green-50 dark:bg-green-900/20";
    case "info":
    default:
      return "bg-gray-50 dark:bg-gray-900/20";
  }
};

interface NotificationsListProps {
  onClose?: () => void;
}

const NotificationsList: React.FC<NotificationsListProps> = ({ onClose }) => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
  } = useAppContext();

  return (
    <div className="w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-[#0077ED]" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Notifications
          </h3>
          {/* {unreadNotificationsCount > 0 && (
            <span className="flex items-center justify-center bg-red-500 text-white text-xs h-5 w-5 rounded-full">
              {unreadNotificationsCount}
            </span>
          )} */}
        </div>
        <div className="flex items-center space-x-2">
          {unreadNotificationsCount > 0 && (
            <span
              onClick={markAllNotificationsAsRead}
              className="text-xs text-[#0077ED] hover:text-[#0066CC] font-medium cursor-pointer"
            >
              Mark all read
            </span>
          )}
          {onClose && (
            <span
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
            >
              <X className="w-4 h-4 text-gray-500" />
            </span>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors ${
                  !notification.read ? "bg-blue-100/30 dark:bg-blue-700/10" : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div
                    className={`p-2 rounded-lg ${getNotificationBgColor(
                      notification.notification_type
                    )} flex-shrink-0`}
                  >
                    <div
                      className={getNotificationColor(
                        notification.notification_type
                      )}
                    >
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4
                          className={`text-sm font-medium ${
                            !notification.read
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {notification.title}
                        </h4>
                        <p
                          className={`text-sm mt-1 ${
                            !notification.read
                              ? "text-gray-800 dark:text-gray-300"
                              : "text-gray-500 dark:text-gray-500"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                          {formatDistanceToNow(
                            new Date(notification.created_at),
                            { addSuffix: true }
                          )}
                        </p>
                      </div>

                      {/* Read/Unread Status */}
                      <div className="flex items-center space-x-2 ml-2">
                        {!notification.read ? (
                          <>
                            <div
                              onClick={() =>
                                markNotificationAsRead(notification.id)
                              }
                              className="rounded transition-colors cursor-pointer"
                              title="Mark as read"
                            >
                              <Mail className="w-4 h-4 text-green-500 hover:text-green-600" />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-4 h-4 flex items-center justify-center">
                              <MailOpen className="w-4 h-4 text-gray-400" />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsList;
