interface Common {
  close: string;
  cancel: string;
  submit: string;
  submitting: string;
  loading: string;
  save: string;
  delete: string;
  edit: string;
  view: string;
  create: string;
}

interface Errors {
  somethingWentWrong: string;
  failedToLoadBookings: string;
  failedToLoadOrderDetails: string;
}

interface Status {
  pending: string;
  confirmed: string;
  completed: string;
  cancelled: string;
}

interface BookingHistoryColumns {
  id: string;
  service: string;
  date: string;
  amount: string;
  status: string;
  actions: string;
}

interface BookingHistoryActions {
  viewDetails: string;
}

interface BookingHistory {
  title: string;
  search: string;
  noBookings: string;
  columns: BookingHistoryColumns;
  actions: BookingHistoryActions;
}

interface OrderDetail {
  title: string;
  orderId: string;
  status: string;
  customerInfo: string;
  customerName: string;
  phone: string;
  email: string;
  livestream: string;
  notSpecified: string;
  serviceInfo: string;
  serviceName: string;
  schedules: string;
  noSchedules: string;
  doctor: string;
  procedure: string;
  date: string;
  time: string;
  paymentInfo: string;
  totalAmount: string;
  discount: string;
  depositAmount: string;
  finalAmount: string;
}
interface TableColumns {
  id: string;
  customer: string;
  service: string;
  date: string;
  amount: string;
  feedback: string;
  status: string;
  actions: string;
}

interface TableActions {
  viewDetails: string;
}

interface Table {
  columns: TableColumns;
  noOrders: string;
  noOrdersDescription: string;
  actions: TableActions;
}

interface FeedbackErrors {
  submitFailed: string;
}

interface FeedbackErrors {
  ratingRequired: string;
  contentRequired: string;
  scheduleRatingRequired: string;
  submitFailed: string;
}

interface Feedback {
  createTitle: string;
  viewTitle: string;
  createFeedback: string;
  viewFeedback: string;
  overallRating: string;
  content: string;
  contentPlaceholder: string;
  images: string;
  uploadImage: string;
  maxImages: string;
  doctorFeedbacks: string;
  doctorFeedbackPlaceholder: string;
  noContent: string;
  createdOn: string;
  successMessage: string;
  errors: FeedbackErrors;
}

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
  bookingHistory: {
    common: Common;
    errors: Errors;
    status: Status;
    bookingHistory: BookingHistory;
    orderDetail: OrderDetail;
    feedback: Feedback;
    table: Table;
  };
};
