interface ShiftsColumns {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  note: string;
  createdAt: string;
  actions: string;
}

interface ShiftsActions {
  create: string;
  edit: string;
  delete: string;
  cancel: string;
  save: string;
  confirm: string;
}

interface ShiftsForm {
  name: string;
  namePlaceholder: string;
  startTime: string;
  endTime: string;
  note: string;
  notePlaceholder: string;
}

interface ShiftsMessages {
  createSuccess: string;
  updateSuccess: string;
  deleteSuccess: string;
  deleteConfirm: string;
  deleteWarning: string;
}

interface ShiftsErrors {
  nameRequired: string;
  startTimeRequired: string;
  endTimeRequired: string;
  timeInvalid: string;
}

interface Shifts {
  title: string;
  description: string;
  createDescription: string;
  editDescription: string;
  loading: string;
  noShifts: string;
  showing: string;
  of: string;
  entries: string;
  columns: ShiftsColumns;
  actions: ShiftsActions;
  form: ShiftsForm;
  messages: ShiftsMessages;
  errors: ShiftsErrors;
}

interface ToastPositions {
  topRight: string;
  topCenter: string;
  topLeft: string;
  bottomRight: string;
  bottomCenter: string;
  bottomLeft: string;
}

interface Toast {
  settings: string;
  positionTitle: string;
  positionChanged: string;
  positions: ToastPositions;
}

interface Pagination {
  previous: string;
  next: string;
  of: string;
  results: string;
  page: string;
}

export interface Configuration {
  title: string;
  shifts: Shifts;
  pagination: Pagination;
  toast: Toast;
}
