"use client";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import type { OrderItem } from "@/features/order/types";
import { formatCurrency } from "@/utils";
import { useTranslations } from "next-intl";

interface DirectPrintProps {
  order: OrderItem;
  onPrint: () => void;
}

// Format date function
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Giải pháp in trực tiếp không sử dụng thư viện
export function DirectPrintSolution({ order, onPrint }: DirectPrintProps) {
  const t = useTranslations("clinicStaffOrder");
  const discountPercentage =
    order.totalAmount > 0 ? (order.discount / order.totalAmount) * 100 : 0;
  const remainingAmount = order.finalAmount - (order.depositAmount || 0);

  const handlePrint = () => {
    // Tạo một cửa sổ mới để in
    const printWindow = window.open("", "_blank", "width=800,height=600");

    if (!printWindow) {
      alert(t("allowPopups"));
      return;
    }

    // Map status to translated value
    const getTranslatedStatus = (status: string) => {
      switch (status.toLowerCase()) {
        case "completed":
          return t("statusCompleted");
        case "pending":
          return t("statusPending");
        case "cancelled":
        case "canceled":
          return t("statusCancelled");
        default:
          return status;
      }
    };

    // Tạo nội dung HTML cho hóa đơn
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${t("invoice")} - ${order.id}</title>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            font-size: 24px;
            margin-bottom: 10px;
            color: #333;
          }
          .logo {
            max-width: 200px;
            margin-bottom: 20px;
          }
          .section {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #eee;
            border-radius: 8px;
            background-color: #fafafa;
          }
          .section h2 {
            font-size: 18px;
            margin-top: 0;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 1px solid #eee;
            color: #333;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .label {
            font-weight: bold;
            color: #666;
          }
          .value {
            font-weight: normal;
            text-align: right;
          }
          .subtotal {
            font-weight: 600;
          }
          .total {
            font-size: 18px;
            font-weight: bold;
            color: #000;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
            padding-top: 20px;
            border-top: 1px dashed #ccc;
          }
          .status {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 25px;
            font-size: 14px;
            color: white;
            font-weight: bold;
            text-transform: uppercase;
          }
          .status-completed {
            background-color: #22c55e;
          }
          .status-pending {
            background-color: #eab308;
          }
          .status-cancelled {
            background-color: #ef4444;
          }
          .divider {
            margin: 15px 0;
            border-top: 1px solid #eee;
          }
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            .invoice-container {
              box-shadow: none;
              border: none;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <h1>${t("invoice").toUpperCase()}</h1>
            <p>${t("orderId")}: <strong>${order.id}</strong></p>
            <p>${t("date")}: <strong>${formatDate(order.orderDate)}</strong></p>
            <div>
              <span class="status status-${order.status.toLowerCase()}">${getTranslatedStatus(
      order.status
    )}</span>
            </div>
          </div>
          
          <div class="section">
            <h2>${t("orderInformation")}</h2>
            <div class="row">
              <span class="label">${t("orderDate")}:</span>
              <span class="value">${formatDate(order.orderDate)}</span>
            </div>
            <div class="row">
              <span class="label">${t("service")}:</span>
              <span class="value">${
                order.serviceName || t("notAvailable")
              }</span>
            </div>
          </div>
          
          <div class="section">
            <h2>${t("customerInformation")}</h2>
            <div class="row">
              <span class="label">${t("customerName")}:</span>
              <span class="value">${
                order.customerName || t("notAvailable")
              }</span>
            </div>
            <div class="row">
              <span class="label">${t("email")}:</span>
              <span class="value">${
                order.customerEmail || t("notAvailable")
              }</span>
            </div>
            <div class="row">
              <span class="label">${t("phone")}:</span>
              <span class="value">${
                order.customerPhone || t("notAvailable")
              }</span>
            </div>
            ${
              order.isFromLivestream
                ? `
            <div class="row">
              <span class="label">${t("livestream")}:</span>
              <span class="value">${order.livestreamName || t("noName")}</span>
            </div>
            `
                : ""
            }
          </div>
          
          <div class="section">
            <h2>${t("paymentInformation")}</h2>
            <div class="row">
              <span class="label">${t("totalServiceAmount")}:</span>
              <span class="value">${formatCurrency(order.totalAmount)} đ</span>
            </div>
            <div class="row">
              <span class="label">${t("discount")}:</span>
              <span class="value">
                ${formatCurrency(order.discount)} đ
                ${
                  discountPercentage > 0
                    ? `(${discountPercentage.toFixed(1)}%)`
                    : ""
                }
              </span>
            </div>
            
            <div class="divider"></div>
            
            <div class="row">
              <span class="label">${t("depositAmount")}:</span>
              <span class="value">${formatCurrency(
                order.depositAmount || 0
              )} đ</span>
            </div>
            <div class="row">
              <span class="label">${t("remainingAmount")}:</span>
              <span class="value subtotal">${formatCurrency(
                remainingAmount
              )} đ</span>
            </div>
            
            <div class="divider"></div>
            
            <div class="row">
              <span class="label total">${t("finalAmount")}:</span>
              <span class="value total">${formatCurrency(
                order.finalAmount
              )} đ</span>
            </div>
          </div>
          
          <div class="footer">
            <p>${t("thankYouMessage")}</p>
            <p>${t("legalNotice")}</p>
          </div>
        </div>
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print()" style="padding: 10px 20px; background-color: #4f46e5; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Print Invoice
          </button>
        </div>
        <script>
          // Tự động in khi trang đã tải xong
          window.onload = function() {
            window.print();
            // Đóng cửa sổ sau khi in (tùy chọn)
            // window.close();
          }
        </script>
      </body>
      </html>
    `;

    // Ghi nội dung vào cửa sổ mới
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Thông báo đã in xong
    if (onPrint) {
      onPrint();
    }
  };

  return (
    <Button onClick={handlePrint} className="gap-2">
      <Printer className="h-4 w-4" />
      {t("printInvoice")}
    </Button>
  );
}
