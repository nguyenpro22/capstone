"use client";
import { useState } from "react";
import { useGetBranchRequestByIdQuery } from "@/features/partnership/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";

interface BranchRequestDetailProps {
  requestId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const BranchRequestDetail = ({
  requestId,
  isOpen,
  onClose,
}: BranchRequestDetailProps) => {
  const t = useTranslations("clinic");
  const [activeTab, setActiveTab] = useState("information");

  const { data: detailData, isLoading: isDetailLoading } =
    useGetBranchRequestByIdQuery(requestId || "", {
      skip: !requestId,
    });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("partnershipRequestDetails")}
          </DialogTitle>
          <DialogDescription>
            {t("detailedInformationAboutRequest")}
          </DialogDescription>
        </DialogHeader>

        {isDetailLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-blue-500 dark:text-blue-400 animate-spin" />
          </div>
        ) : detailData?.value ? (
          <div className="flex-1 overflow-hidden">
            <Tabs
              defaultValue="information"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-1 mb-4">
                <TabsTrigger value="information">
                  {t("information")}
                </TabsTrigger>
              </TabsList>

              <div
                className="overflow-y-auto pr-1"
                style={{ maxHeight: "calc(90vh - 220px)" }}
              >
                <TabsContent value="information" className="mt-0 space-y-6">
                  {/* Branch Information */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
                      {t("branchInformation")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {t("branchName")}
                        </p>
                        <p className="text-gray-900 dark:text-gray-100">
                          {detailData.value.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {t("createdOn")}
                        </p>
                        <p className="text-gray-900 dark:text-gray-100">
                          {new Date(
                            detailData.value.createdOnUtc
                          ).toLocaleString()}
                        </p>
                      </div>
                      {detailData.value.rejectReason && (
                        <div className="col-span-2">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {t("rejectReason")}
                          </p>
                          <p className="text-red-600 dark:text-red-400">
                            {detailData.value.rejectReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Parent Clinic Information */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
                      {t("parentClinicInformation")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {t("clinicName")}
                        </p>
                        <p className="text-gray-900 dark:text-gray-100">
                          {detailData.value.parentName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {t("email")}
                        </p>
                        <p className="text-gray-900 dark:text-gray-100">
                          {detailData.value.parentEmail}
                        </p>
                      </div>
                      {detailData.value.parentPhoneNumber && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {t("phoneNumber")}
                          </p>
                          <p className="text-gray-900 dark:text-gray-100">
                            {detailData.value.parentPhoneNumber}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
                      {t("addressInformation")}
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {detailData.value.parentCity && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {t("city")}
                          </p>
                          <p className="text-gray-900 dark:text-gray-100">
                            {detailData.value.parentCity}
                          </p>
                        </div>
                      )}
                      {detailData.value.parentDistrict && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {t("district")}
                          </p>
                          <p className="text-gray-900 dark:text-gray-100">
                            {detailData.value.parentDistrict}
                          </p>
                        </div>
                      )}
                      {detailData.value.parentWard && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {t("ward")}
                          </p>
                          <p className="text-gray-900 dark:text-gray-100">
                            {detailData.value.parentWard}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {t("fullAddress")}
                        </p>
                        <p className="text-gray-900 dark:text-gray-100">
                          {detailData.value.parentAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        ) : (
          <div className="flex justify-center items-center py-12 text-gray-500 dark:text-gray-400">
            {t("noDetailsAvailable")}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BranchRequestDetail;
