export interface ShiftPayLoad {
  name: string;
  note: string;
  startTime: string;
  endTime: string;
}

export interface ShiftUpdate extends ShiftPayLoad {
  id: string;
}

export interface Shift extends ShiftUpdate {
  createdAt: string;
}
