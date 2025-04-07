"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useGetClinicByIdQuery } from "@/features/clinic/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  PenSquare,
  MapPinned,
  Award,
  Landmark,
  BanknoteIcon,
} from "lucide-react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils"
import { Button } from "@/components/ui/button"
import ClinicEditForm from "@/components/clinicManager/profile/clinic-edit-form"
import { motion } from "framer-motion"

export default function ClinicProfilePage() {
  const router = useRouter()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Get clinicId from token
  const token = getAccessToken()
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null
  const clinicId = tokenData?.clinicId || ""

  // Redirect if no clinicId is found
  useEffect(() => {
    if (!clinicId) {
      router.push("/login")
    }
  }, [clinicId, router])

  const { data, isLoading, error, refetch } = useGetClinicByIdQuery(clinicId)
  const clinic = data?.value

  const handleEditSuccess = () => {
    refetch()
  }

  if (!clinicId) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Card className="w-full max-w-3xl shadow-lg">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Authentication required. Please log in.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return <ClinicProfileSkeleton />
  }

  if (error || !clinic) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Card className="w-full max-w-3xl shadow-lg">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Failed to load clinic information.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8 max-w-7xl">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 mb-8">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            {clinic.profilePictureUrl ? (
              <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-white/30 shadow-xl">
                <Image
                  src={clinic.profilePictureUrl || "/placeholder.svg"}
                  alt={clinic.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-full bg-white/10 flex items-center justify-center border-4 border-white/30 shadow-xl">
                <Building2 className="w-16 h-16 text-white/80" />
              </div>
            )}
            <Badge
              variant={clinic.isActivated ? "default" : "outline"}
              className={`absolute -bottom-2 right-0 px-3 py-1 text-xs font-medium ${
                clinic.isActivated
                  ? "bg-green-500 hover:bg-green-500/90 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {clinic.isActivated ? "Active" : "Inactive"}
            </Badge>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{clinic.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-white/70" />
                <span className="text-sm text-white/90">{clinic.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-white/70" />
                <span className="text-sm text-white/90">{clinic.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinned className="w-4 h-4 text-white/70" />
                <span className="text-sm text-white/90">{clinic.city}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsEditModalOpen(true)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white border-none shadow-md"
            size="sm"
          >
            <PenSquare className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Clinic Info Card */}
        <div className="md:col-span-1 space-y-6">
          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Clinic Details</h3>
            </div>
            <CardContent className="space-y-5 pt-5">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Address</p>
                  <p className="text-sm text-gray-600">{clinic.fullAddress || clinic.city}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Tax Code</p>
                  <p className="text-sm text-gray-600">{clinic.taxCode}</p>
                </div>
              </div>

              {/* Business License moved here */}
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Business License</p>
                  {clinic.businessLicenseUrl ? (
                    <a
                      href={clinic.businessLicenseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 hover:text-purple-800 hover:underline transition-colors"
                    >
                      View Business License
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">No business license available</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Statistics</h3>
            </div>
            <CardContent className="pt-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-100">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mb-3 mx-auto">
                    <Building2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-center text-2xl font-bold text-gray-800">{clinic.totalBranches}</p>
                  <p className="text-center text-sm text-gray-600">Branches</p>
                </div>

                {/* <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100">
                  <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full mb-3 mx-auto">
                    <Award className="w-5 h-5 text-indigo-600" />
                  </div>
                  <p className="text-center text-2xl font-bold text-gray-800">{clinic.services?.length || 0}</p>
                  <p className="text-center text-sm text-gray-600">Services</p>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <Tabs defaultValue="bank" className="w-full">
              <div className="border-b">
                <div className="px-6 py-3">
                  <TabsList className="grid w-full grid-cols-2 h-11">
                    <TabsTrigger
                      value="bank"
                      className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700"
                    >
                      <BanknoteIcon className="w-4 h-4 mr-2" />
                      Bank Information
                    </TabsTrigger>
                    <TabsTrigger
                      value="branches"
                      className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Branches ({clinic.totalBranches})
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              {/* Bank Information Tab */}
              <TabsContent value="bank" className="p-6 focus:outline-none">
                <div className="grid gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden border-purple-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 pb-3">
                        <CardTitle className="text-base flex items-center gap-2 text-purple-800">
                          <Landmark className="w-5 h-5 text-purple-600" />
                          Bank Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-purple-50 p-4 rounded-lg">
                              <p className="text-sm font-medium text-purple-800 mb-1">Bank Name</p>
                              <p className="text-lg font-semibold text-gray-800">{clinic.bankName}</p>
                            </div>

                            <div className="bg-indigo-50 p-4 rounded-lg">
                              <p className="text-sm font-medium text-indigo-800 mb-1">Account Number</p>
                              <p className="text-lg font-semibold text-gray-800">{clinic.bankAccountNumber}</p>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-100/50">
                            <div className="flex items-center gap-2 mb-2">
                              <CreditCard className="w-5 h-5 text-purple-600" />
                              <p className="font-medium text-gray-800">Payment Information</p>
                            </div>
                            <p className="text-sm text-gray-600">
                              This bank account is used for receiving payments from patients and insurance providers.
                              Make sure to keep your banking information up to date.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>

              {/* Branches Tab */}
              <TabsContent value="branches" className="p-6 focus:outline-none">
                {clinic.branches.items.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {clinic.branches.items.map((branch, index) => (
                      <motion.div
                        key={branch.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card className="overflow-hidden border-indigo-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-300">
                          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 pb-3">
                            <CardTitle className="text-base flex items-center gap-2 text-indigo-800">
                              <Building2 className="w-5 h-5 text-indigo-600" />
                              {branch.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                              <p className="text-sm text-gray-600">{branch.address}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Building2 className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-2">No branches available</p>
                    <p className="text-sm text-gray-400">
                      Branches will appear here once they are added to your clinic.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && clinic && (
        <ClinicEditForm
          initialData={clinic}
          onClose={() => setIsEditModalOpen(false)}
          onSaveSuccess={handleEditSuccess}
        />
      )}
    </div>
  )
}

function ClinicProfileSkeleton() {
  return (
    <div className="container py-8 space-y-8 max-w-7xl">
      {/* Header Skeleton */}
      <div className="relative rounded-xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Skeleton className="h-32 w-32 md:h-40 md:w-40 rounded-full" />
          <div className="flex-1 space-y-4 w-full">
            <Skeleton className="h-10 w-3/4 md:w-1/2" />
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <div className="px-6 py-4 border-b">
              <Skeleton className="h-7 w-40" />
            </div>
            <CardContent className="space-y-5 pt-5">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="w-9 h-9 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card>
            <div className="px-6 py-4 border-b">
              <Skeleton className="h-7 w-40" />
            </div>
            <CardContent className="pt-5">
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-28 w-full rounded-lg" />
                <Skeleton className="h-28 w-full rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <div className="border-b p-6">
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                {Array(2)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-5 w-full" />
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

