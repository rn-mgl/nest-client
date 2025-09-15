import { UserInterface } from "./UserInterface";

export interface LeaveTypeInterface {
  id?: number;
  type: string;
  description: string;
  created_by: number | UserInterface;
}

export interface LeaveBalanceInterface {
  id?: number;
  leave: LeaveTypeInterface;
  balance: number;
  assigned_to: number | UserInterface;
  provided_by: number | UserInterface;
  created_at: string;
}

export interface LeaveRequestInterface {
  id?: number;
  requested_by: number | UserInterface;
  actioned_by: number | UserInterface | null;
  balance: number | LeaveBalanceInterface;
  leave_type_id: number;
  leave: LeaveTypeInterface;
  start_date: string;
  end_date: string;
  status: string;
  reason: string;
  created_at: string;
}
