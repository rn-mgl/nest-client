export interface LeaveInterface {
  leave_id?: number;
  type: string;
  description: string;
  created_by?: number;
}

export interface LeaveBalanceInterface {
  leave_balance_id?: number | null;
  leave_type_id: number | null;
  balance: number | null;
}
