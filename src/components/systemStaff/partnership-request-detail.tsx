"use client"
import { useState } from "react"
import { useGetPartnershipRequestByIdQuery } from "@/features/partnership/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Loader2, ExternalLink } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

interface PartnershipRequestDetailProps {
  requestId: string | null
  isOpen: boolean
  onClose: () => void
}

const PartnershipRequestDetail = ({ requestId, isOpen, onClose }: PartnershipRequestDetailProps) => {
  const [activeTab, setActiveTab] = useState("information")

  const { data: detailData, isLoading: isDetailLoading } = useGetPartnershipRequestByIdQuery(requestId || "", {
    skip: !requestId,
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Partnership Request Details</DialogTitle>
          <DialogDescription>Detailed information about the partnership request</DialogDescription>
        </DialogHeader>

        {isDetailLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-blue-500 dark:text-blue-400 animate-spin" />
          </div>
        ) : detailData?.value ? (
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="information" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="information">Information</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <div className="overflow-y-auto pr-1" style={{ maxHeight: "calc(90vh - 220px)" }}>
                <TabsContent value="information" className="mt-0 space-y-6">
                  {/* Basic Information */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Clinic Name</p>
                        <p className="text-gray-900 dark:text-gray-100">{detailData.value.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-gray-900 dark:text-gray-100">{detailData.value.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</p>
                        <p className="text-gray-900 dark:text-gray-100">{detailData.value.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tax Code</p>
                        <p className="text-gray-900 dark:text-gray-100">{detailData.value.taxCode}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Applications</p>
                        <p className="text-gray-900 dark:text-gray-100">{detailData.value.totalApply}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Operating License Expiry Date
                        </p>
                        <p className="text-gray-900 dark:text-gray-100">
                          {new Date(detailData.value.operatingLicenseExpiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Address Information - Simplified */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
                      Address Information
                    </h3>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Address</p>
                      <p className="text-gray-900 dark:text-gray-100">{detailData.value.fullAddress}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="mt-0">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
                      Documents
                    </h3>

                    {/* Compact layout for all three images */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Profile Picture */}
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Profile Picture</p>
                        {detailData.value.profilePictureUrl ? (
                          <div className="space-y-1">
                            <div className="relative h-32 w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                              <Image
                                src={detailData.value.profilePictureUrl || "/placeholder.svg"}
                                alt="Profile"
                                className="object-cover w-full h-full"
                                width={100}
                                height={100}
                              />
                            </div>
                            <a
                              href={detailData.value.profilePictureUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              View Full Size <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </div>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400">No profile picture available</p>
                        )}
                      </div>

                      {/* Business License */}
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Business License</p>
                        {detailData.value.businessLicenseUrl ? (
                          <div className="space-y-1">
                            <div className="relative h-32 w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                              <Image
                                src={detailData.value.businessLicenseUrl || "/placeholder.svg"}
                                alt="Business License"
                                className="object-cover w-full h-full"
                                width={100}
                                height={100}
                              />
                            </div>
                            <a
                              href={detailData.value.businessLicenseUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              View Full Size <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </div>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400">No business license available</p>
                        )}
                      </div>

                      {/* Operating License */}
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Operating License</p>
                        {detailData.value.operatingLicenseUrl ? (
                          <div className="space-y-1">
                            <div className="relative h-32 w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                              <Image
                                src={detailData.value.operatingLicenseUrl || "/placeholder.svg"}
                                alt="Operating License"
                                className="object-cover w-full h-full"
                                width={100}
                                height={100}
                              />
                            </div>
                            <a
                              href={detailData.value.operatingLicenseUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              View Full Size <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </div>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400">No operating license available</p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        ) : (
          <div className="flex justify-center items-center py-12 text-gray-500 dark:text-gray-400">
            No details available for this request
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default PartnershipRequestDetail
