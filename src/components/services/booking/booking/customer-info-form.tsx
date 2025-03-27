"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, User } from "lucide-react"

interface CustomerInfo {
  name: string
  phone: string
  email: string
  notes: string
}

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo
  onChange: (field: keyof CustomerInfo, value: string) => void
}

export function CustomerInfoForm({ customerInfo, onChange }: CustomerInfoFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Họ và tên <span className="text-destructive">*</span>
          </label>
          <div className="flex">
            <div className="bg-muted p-2 rounded-l-md border border-r-0 border-input">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              id="name"
              placeholder="Nhập họ và tên"
              value={customerInfo.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="rounded-l-none"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Số điện thoại <span className="text-destructive">*</span>
          </label>
          <div className="flex">
            <div className="bg-muted p-2 rounded-l-md border border-r-0 border-input">
              <Phone className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              id="phone"
              placeholder="Nhập số điện thoại"
              value={customerInfo.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className="rounded-l-none"
              required
              type="tel"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <div className="flex">
          <div className="bg-muted p-2 rounded-l-md border border-r-0 border-input">
            <Mail className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            id="email"
            placeholder="Nhập email (không bắt buộc)"
            value={customerInfo.email}
            onChange={(e) => onChange("email", e.target.value)}
            className="rounded-l-none"
            type="email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Ghi chú
        </label>
        <Textarea
          id="notes"
          placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt (không bắt buộc)"
          value={customerInfo.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          className="min-h-[100px]"
        />
      </div>
    </div>
  )
}

