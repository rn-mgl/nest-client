export interface LeaveTypeInterface {
  leave_type_id?: number;
  type: string;
  description: string;
  created_by?: number;
}

export interface LeaveBalanceInterface {
  leave_balance_id?: number | null;
  balance: number | string | null;
}

export interface LeaveRequestInterface {
  leave_request_id?: number;
  user_id: number;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  requested_at?: string;
  approved_by?: number;
}
