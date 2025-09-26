import React, { useEffect, useState } from "react";
import {
  Building2,
  Globe,
  Calendar,
  Users,
  DollarSign,
  Building,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  CustomDialog,
  CustomDialogTitle,
  CustomDialogContent,
  CustomDialogActions,
} from "@/components/ui/custom-dialog";
import { useAppContext } from "@/contexts/AppContext";
import { _organization_detail_view_api } from "@/DAL/organizationAPI";
import { useSnackbar } from "notistack";
import Spinner from "../../../components/ui/spinner";

interface OrganizationDetailViewProps {
  open: boolean;
  onClose: () => void;
  organizationId: string;
}

const OrganizationDetailView = ({
  open,
  onClose,
  organizationId,
}: OrganizationDetailViewProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { darkMode } = useAppContext();
  const [organization, setOrganization] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const getOrgDetail = async (id: string) => {
    setLoading(true);
    const result = await _organization_detail_view_api(id);
    if (result?.code === 200) {
      setOrganization(result?.data);
      setLoading(false);
    } else {
      setLoading(false);

      enqueueSnackbar(result?.message || "Failed to fetch organization", {
        variant: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open && organizationId) {
      getOrgDetail(organizationId);
    }
  }, [open, organizationId]);

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      active: {
        label: "Active",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      },
      inactive: {
        label: "Inactive",
        className:
          "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      },
    };

    const config = statusConfig[status] || statusConfig.inactive;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (!organization) return null;

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <CustomDialogTitle onClose={onClose}>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-[#0077ED] to-[#4A9AFF] rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">
            {organization.orgn_user?.name}
          </h1>
        </div>
      </CustomDialogTitle>

      <CustomDialogContent dividers>
        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <Spinner />
          </div>
        )}
        {!loading && (
          <Card>
            <CardContent>
              {/* --- Totals Section --- */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 mb-6">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                  <div className="font-bold">
                    {organization.total_events ?? "N/A"}
                  </div>
                  <div className="text-sm">Total Events</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Building className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
                  <div className="font-bold">
                    {organization.total_companies ?? "N/A"}
                  </div>
                  <div className="text-sm">Companies</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <div className="font-bold">
                    {organization.total_revenue !== undefined
                      ? `$${organization.total_revenue.toLocaleString()}`
                      : "N/A"}
                  </div>
                  <div className="text-sm">Revenue</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Users className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                  <div className="font-bold">
                    {organization.total_attendees !== undefined
                      ? organization.total_attendees.toLocaleString()
                      : "N/A"}
                  </div>
                  <div className="text-sm">Attendees</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm">
                  <span className="font-semibold">Industry:</span>{" "}
                  {organization.bio?.industry ? (
                    organization.bio.industry
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">
                      No industry available
                    </span>
                  )}
                </p>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">Subscription:</span>
                    {getStatusBadge(
                      organization.subscription_status || "inactive"
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">Organization:</span>
                    {getStatusBadge(organization.status || "inactive")}
                  </div>
                </div>
              </div>

              <div className="mt-2 mb-2 text-sm">
                <span className="font-semibold">Description:</span>{" "}
                {organization.bio?.description &&
                organization.bio.description.replace(/<[^>]+>/g, "").trim() ? (
                  organization.bio.description.replace(/<[^>]+>/g, "").trim()
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">
                    No description available
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {/* Website */}
                <p className="text-sm flex items-center space-x-2">
                  <span className="font-semibold">Website:</span>
                  {organization.bio?.website ? (
                    <a
                      href={organization.bio.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 dark:text-blue-400"
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      {organization.bio.website}
                    </a>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">
                      No website available
                    </span>
                  )}
                </p>

                {/* Facebook */}
                <p className="text-sm flex items-center space-x-2">
                  <span className="font-semibold">Facebook:</span>
                  {organization.social_links?.facebook ? (
                    <a
                      href={organization.social_links.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 dark:text-blue-400"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 mr-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2v-3h2v-2c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2v1.8h2.6l-.4 3h-2.2v7A10 10 0 0 0 22 12" />
                      </svg>
                      {organization.social_links.facebook}
                    </a>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">
                      No link available
                    </span>
                  )}
                </p>

                {/* Twitter */}
                <p className="text-sm flex items-center space-x-2">
                  <span className="font-semibold">Twitter:</span>
                  {organization.social_links?.twitter ? (
                    <a
                      href={organization.social_links.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sky-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 mr-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.37 8.6 8.6 0 0 1-2.72 1.04A4.3 4.3 0 0 0 16.1 4c-2.4 0-4.3 2-4.3 4.4 0 .35.04.7.12 1A12.2 12.2 0 0 1 3.1 5.2a4.4 4.4 0 0 0-.6 2.2c0 1.5.75 2.8 1.9 3.6a4.2 4.2 0 0 1-2-.6v.1c0 2.1 1.4 3.9 3.3 4.3a4.3 4.3 0 0 1-2 .1c.6 1.9 2.3 3.3 4.3 3.3A8.7 8.7 0 0 1 2 19.5a12.1 12.1 0 0 0 6.6 2c7.9 0 12.3-6.7 12.3-12.5v-.6A8.7 8.7 0 0 0 22.5 6h-.04z" />
                      </svg>
                      {organization.social_links.twitter}
                    </a>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">
                      No link available
                    </span>
                  )}
                </p>

                {/* LinkedIn */}
                <p className="text-sm flex items-center space-x-2">
                  <span className="font-semibold">LinkedIn:</span>
                  {organization.social_links?.linkedin ? (
                    <a
                      href={organization.social_links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 mr-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4.98 3.5C3.33 3.5 2 4.85 2 6.48s1.33 2.98 2.98 2.98c1.64 0 2.98-1.34 2.98-2.98S6.62 3.5 4.98 3.5zM3 21h4v-11H3v11zm7-11h3.6v1.5h.1c.5-.9 1.7-1.9 3.5-1.9 3.7 0 4.4 2.4 4.4 5.6V21h-4v-5.2c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21h-4v-11z" />
                      </svg>
                      {organization.social_links.linkedin}
                    </a>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">
                      No link available
                    </span>
                  )}
                </p>

                {/* Instagram */}
                <p className="text-sm flex items-center space-x-2">
                  <span className="font-semibold">Instagram:</span>
                  {organization.social_links?.instagram ? (
                    <a
                      href={organization.social_links.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-pink-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 mr-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.6 0 3 1.4 3 3v10c0 1.6-1.4 3-3 3H7c-1.6 0-3-1.4-3-3V7c0-1.6 1.4-3 3-3h10zm-5 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm4.5-2.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2z" />
                      </svg>
                      {organization.social_links.instagram}
                    </a>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">
                      No link available
                    </span>
                  )}
                </p>
              </div>

              {/* --- Monthly Stats --- */}
              <div className="mt-4">
                <h3 className="text-md font-semibold mb-2">Monthly Stats</h3>
                {organization.monthly_stats &&
                Object.keys(organization.monthly_stats).length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(organization.monthly_stats).map(
                      ([month, value]: [string, any]) => (
                        <div
                          key={month}
                          className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <p className="font-bold">{value ?? "N/A"}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {month}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No monthly stats available
                  </p>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    Created At:
                  </span>{" "}
                  {organization.createdAt
                    ? new Date(organization.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </CustomDialogContent>

      <CustomDialogActions>
        <Button onClick={onClose}>Close</Button>
      </CustomDialogActions>
    </CustomDialog>
  );
};

export default OrganizationDetailView;
