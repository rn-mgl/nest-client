export interface AttendanceStatistics {
  ins: number;
  outs: number;
  lates: number;
  absents: number;
}

export interface Attendance {
  attendance_id?: number;
  login_time: string;
  logout_time: string;
  late: boolean;
  absent: boolean;
}
