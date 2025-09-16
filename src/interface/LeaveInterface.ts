import { UserInterface } from "./UserInterface";

export interface LeaveTypeInterface {
  id?: number;
  type: string;
  description: string;
  created_by: number | UserInterface;
}

export interface LeaveBalanceInterface {
  id?: number;
  leave_type_id: number;
  leave: LeaveTypeInterface;
  balance: string | number;
  assigned_to: number | UserInterface;
  provided_by: number | UserInterface;
  created_at: string;
  deleted_at: string | null;
}

export interface AssignedLeaveBalance extends UserInterface {
  assigned_leave_balance: null | LeaveBalanceInterface;
}

export interface LeaveRequestInterface {
  id?: number;
  requested_by: number | UserInterface;
  actioned_by: number | UserInterface | null;
  leave_balance: number | LeaveBalanceInterface;
  leave_type_id: number;
  leave: LeaveTypeInterface;
  start_date: string;
  end_date: string;
  status: string;
  reason: string;
  created_at: string;
}
