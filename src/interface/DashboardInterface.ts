export interface HRDashboardInterface {
  attendances: {
    In: number;
    Out: number;
    Late: number;
    Absent: number;
  };
  leaves: StatusInterface & { Approved: number; Rejected: number };
  documents: number;
  onboardings: StatusInterface;
  performances: StatusInterface;
  trainings: StatusInterface;
  users: number;
}

interface StatusInterface {
  Pending: number;
  "In Progress": number;
  Done: number;
}
