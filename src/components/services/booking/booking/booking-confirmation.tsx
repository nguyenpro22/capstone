"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { BookingData } from "../types/booking"
import { formatDate, calculateTotalPriceWithVAT } from "../utils/booking-utils"
import { CalendarIcon, CheckCircle, Clock, MapPin } from "lucide-react"
import { useTranslations } from "next-intl" // Import useTranslations

interface BookingConfirmationProps {
  bookingId: string
  bookingData: BookingData
  onClose: () => void
}

export function BookingConfirmation({ bookingId, bookingData, onClose }: BookingConfirmationProps) {
  const { service, doctor, clinic, date, time, selectedProcedures, customerInfo, isDefault } = bookingData
  const t = useTranslations("bookingFlow") // Use the hook with the namespace

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
        <Card className="border-primary/10 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{t("bookingSuccessful")}!</h2>
              <p className="text-muted-foreground">{t("thankYouForBooking")}</p>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{t("bookingCode")}</h3>
                <Badge variant="outline" className="font-mono">
                  {bookingId}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{t("pleaseKeepBookingCode")}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">{t("appointmentDate")}</div>
                  <div className="text-sm text-muted-foreground">{date ? formatDate(date) : t("dateNotSelected")}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">{t("appointmentTime")}</div>
                  <div className="text-sm text-muted-foreground">{time || t("timeNotSelected")}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">{t("location")}</div>
                  <div className="text-sm text-muted-foreground">
                    {clinic ? `${clinic.name} - ${clinic.address}` : t("clinicNotSelected")}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3 mb-6">
              <h3 className="font-medium">{t("serviceDetails")}</h3>
              {isDefault ? (
                <div className="flex justify-between text-sm">
                  <div>
                    <span>{service.name}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {t("defaultPackage")}
                    </Badge>
                  </div>
                  <div>
                    {service.discountMinPrice.toLocaleString("vi-VN")}đ -{" "}
                    {service.discountMaxPrice.toLocaleString("vi-VN")}đ
                  </div>
                </div>
              ) : (
                selectedProcedures.map((item) => {
                  const priceType = item.procedure.procedurePriceTypes.find((pt) => pt.id === item.priceTypeId)
                  return (
                    <div key={`${item.procedure.id}-${item.priceTypeId}`} className="flex justify-between text-sm">
                      <div>
                        <span>{item.procedure.name}</span>
                        {priceType && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {priceType.name}
                          </Badge>
                        )}
                      </div>
                      <div>{(priceType?.price || 0).toLocaleString("vi-VN")}đ</div>
                    </div>
                  )
                })
              )}
              <div className="flex justify-between font-medium pt-2">
                <span>{t("totalIncludingVAT")}</span>
                <span className="text-primary">
                  {isDefault
                    ? `${service.discountMinPrice.toLocaleString("vi-VN")}đ - ${service.discountMaxPrice.toLocaleString(
                        "vi-VN",
                      )}đ`
                    : calculateTotalPriceWithVAT(selectedProcedures).toLocaleString("vi-VN") + "đ"}
                </span>
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-2">{t("customerInfo")}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">{t("fullName")}:</span>
                  <span className="ml-2">{customerInfo.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("phoneNumber")}:</span>
                  <span className="ml-2">{customerInfo.phone}</span>
                </div>
                {customerInfo.email && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">{t("email")}:</span>
                    <span className="ml-2">{customerInfo.email}</span>
                  </div>
                )}
                {customerInfo.notes && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">{t("notes")}:</span>
                    <span className="ml-2">{customerInfo.notes}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1 gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                {t("saveInformation")}
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                {t("share")}
              </Button>
              <Button variant="secondary" className="flex-1" onClick={onClose}>
                {t("close")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
