export interface LeaveInterface {
  leave_type_id?: number;
  type: string;
  description: string;
  created_by?: number;
}

export interface LeaveBalanceInterface {
  leave_balance_id?: number | null;
  toggleRequestLeave: (leave_type_id: number) => void;
  leave_type_id: number | null;
  balance: number | string | null;
}
