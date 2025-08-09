export interface HRDashboardInterface {
  attendances: {
    in: number;
    out: number;
    late: number;
    absent: number;
  };
  leaves: StatusInterface & { approved: number; rejected: number };
  documents: {
    documents: number;
    folders: number;
  };
  onboardings: StatusInterface;
  performances: StatusInterface;
  trainings: StatusInterface;
  users: {
    hr: number;
    employee: number;
  };
}

interface StatusInterface {
  pending: number;
  in_progress: number;
  done: number;
}
