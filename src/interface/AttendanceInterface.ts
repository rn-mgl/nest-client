export interface AttendanceStatisticsInterface {
  ins: number;
  outs: number;
  lates: number;
  absents: number;
}

export interface AttendanceInterface {
  attendance_id?: number;
  login_time: string | null;
  logout_time: string | null;
  late: boolean | null;
  absent: boolean;
}
