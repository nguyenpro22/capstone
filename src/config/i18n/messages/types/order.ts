export type order = {
  title: string;
  subtitle: string;
  description: string;
  tabs: {
    orders: string;
    bookings: string;
  };
  search: {
    placeholder: string;
  };
  filter: {
    status: string;
    allStatuses: string;
    completed: string;
    inProgress: string;
    pending: string;
  };
  columns: {
    id: string;
    customerName: string;
    serviceName: string;
    orderDate: string;
    totalAmount: string;
    discount: string;
    depositAmount: string;
    finalAmount: string;
    customerPhone: string;
    customerEmail: string;
    livestream: string;
    feedback: string;
    status: string;
    details: string;
  };
  columnVisibility: {
    title: string;
    selectColumns: string;
  };
  status: {
    completed: string;
    inProgress: string;
    pending: string;
  };
  noOrders: {
    title: string;
    description: string;
  };
  pagination: {
    showing: string;
    page: string;
    rowsPerPage: string;
    first: string;
    previous: string;
    next: string;
    last: string;
  };
  viewDetails: string;
  noFeedback: string;
  noFeedbackComment: string;
  bookingsForDate: string;
  bookingsCount: string;
  noBookingsForDate: string;
  noBookingsTitle: string;
  noBookingsDescription: string;
  moreBookings: string;
  close: string;
};
