export interface ClockInDto {
  notes?: string;
}

export interface ClockOutDto {
  notes?: string;
}

export interface GetAttendanceQuery {
  employeeId?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
}
