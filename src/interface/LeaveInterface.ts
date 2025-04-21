export interface LeaveInterface {
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
  start_date: string;
  end_date: string;
  reason: string;
}
