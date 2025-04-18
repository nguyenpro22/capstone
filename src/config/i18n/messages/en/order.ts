import { Messages } from "../types";

export const orderMessages: Messages["userOrder"] = {
  title: "Order Management",
  subtitle: "Order History & Appointments",
  description:
    "View all your orders and appointments here. You can track the status and view details of each order.",
  tabs: {
    orders: "Orders",
    bookings: "Appointments",
  },
  search: {
    placeholder: "Search by service name...",
  },
  filter: {
    status: "Status",
    allStatuses: "All statuses",
    completed: "Completed",
    inProgress: "In Progress",
    pending: "Pending",
  },
  columns: {
    id: "Order ID",
    customerName: "Customer",
    serviceName: "Service",
    orderDate: "Order Date",
    totalAmount: "Total Amount",
    discount: "Discount",
    depositAmount: "Deposit",
    finalAmount: "Final Amount",
    customerPhone: "Phone",
    customerEmail: "Email",
    livestream: "Livestream",
    feedback: "Feedback",
    status: "Status",
    details: "Details",
  },
  columnVisibility: {
    title: "Column Visibility",
    selectColumns: "Select columns to display",
  },
  status: {
    completed: "Completed",
    inProgress: "In Progress",
    pending: "Pending",
  },
  noOrders: {
    title: "No orders found",
    description:
      "You don't have any orders yet or there are no orders matching your current filter.",
  },
  pagination: {
    showing: "Showing {count} of {total} items",
    page: "Page",
    rowsPerPage: "Rows per page",
    first: "First page",
    previous: "Previous page",
    next: "Next page",
    last: "Last page",
  },
  viewDetails: "View details",
  noFeedback: "No feedback yet",
  noFeedbackComment: "No comment provided with this rating",
  bookingsForDate: "Appointments for {date}",
  bookingsCount: "{count} appointments scheduled",
  noBookingsForDate: "No appointments scheduled for this date",
  noBookingsTitle: "No appointments found",
  noBookingsDescription: "There are no appointments scheduled for this date.",
  moreBookings: "more appointments",
  close: "Close",
};
