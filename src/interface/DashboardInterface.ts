import { UserInterface } from "./UserInterface";

export interface AdminDashboardInterface {
  hrs: UserInterface[];
}

export interface HRDashboardInterface extends BaseDashboardInterface {
  attendances: {
    in: number;
    out: number;
    late: number;
    absent: number;
  };
  users: {
    hr: number;
    employee: number;
  };
}

export interface EmployeeDashboardInterface extends BaseDashboardInterface {
  attendances: {
    in: boolean;
    out: boolean;
    late: boolean;
    absent: boolean;
  };
}

interface BaseDashboardInterface {
  leaves: BaseStatusInterface & { approved: number; rejected: number };
  onboardings: BaseStatusInterface;
  performances: BaseStatusInterface;
  trainings: BaseStatusInterface;
  documents: {
    documents: number;
    folders: number;
  };
}

interface BaseStatusInterface {
  pending: number;
  in_progress: number;
  done: number;
}
