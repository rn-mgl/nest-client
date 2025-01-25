export interface AttendanceStatisticsInterface {
  ins: number;
  outs: number;
  lates: number;
  absents: number;
}

export interface AttendanceInterface {
  attendance_id?: number;
  login_time: string;
  logout_time: string;
  late: boolean | null;
  absent: boolean;
}
