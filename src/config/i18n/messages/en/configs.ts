import { Messages } from "../types";

export const configs: Messages["configs"] = {
  title: "Configuration",
  shifts: {
    title: "Shift Management",
    description: "Manage all shifts in the system",
    createDescription: "Create a new shift in the system",
    editDescription: "Edit an existing shift in the system",
    loading: "Loading shifts...",
    noShifts: "No shifts found",
    showing: "Showing",
    of: "of",
    entries: "entries",
    columns: {
      id: "ID",
      name: "Shift Name",
      startTime: "Start Time",
      endTime: "End Time",
      note: "Note",
      createdAt: "Created At",
      actions: "Actions",
    },
    actions: {
      create: "Create Shift",
      edit: "Edit",
      delete: "Delete",
      cancel: "Cancel",
      save: "Save Changes",
      confirm: "Confirm",
    },
    form: {
      name: "Shift Name",
      namePlaceholder: "Enter shift name",
      startTime: "Start Time",
      endTime: "End Time",
      note: "Note",
      notePlaceholder: "Enter additional notes",
    },
    messages: {
      createSuccess: "Shift created successfully",
      updateSuccess: "Shift updated successfully",
      deleteSuccess: "Shift deleted successfully",
      deleteConfirm: "Are you sure you want to delete this shift?",
      deleteWarning: "This action cannot be undone.",
    },
    errors: {
      nameRequired: "Shift name is required",
      startTimeRequired: "Start time is required",
      endTimeRequired: "End time is required",
      timeInvalid: "End time must be after start time",
    },
  },
  pagination: {
    previous: "Previous",
    next: "Next",
    of: "of",
    results: "results",
    page: "Page",
  },
  toast: {
    settings: "Notification Settings",
    positionTitle: "Toast Position",
    positionChanged: "Notification position updated",
    positions: {
      topRight: "Top Right",
      topCenter: "Top Center",
      topLeft: "Top Left",
      bottomRight: "Bottom Right",
      bottomCenter: "Bottom Center",
      bottomLeft: "Bottom Left",
    },
  },
};
