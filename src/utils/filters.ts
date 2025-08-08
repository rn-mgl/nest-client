interface CategoryPairsInterface {
  key: string;
  values: string[];
}

interface SortPairsInterface {
  key: string;
  label: string;
}

interface SearchPairsInterface {
  key: string;
  label: string;
}

// for admin to filter HR
export const ADMIN_HR_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "verified",
    values: ["all", "verified", "deactivated"],
  },
];

export const ADMIN_HR_SORT: SortPairsInterface[] = [
  {
    key: "first_name",
    label: "First Name",
  },
  {
    key: "last_name",
    label: "Last Name",
  },
  {
    key: "email",
    label: "Email",
  },
];

export const ADMIN_HR_SEARCH: SearchPairsInterface[] = [
  {
    key: "first_name",
    label: "First Name",
  },
  {
    key: "last_name",
    label: "Last Name",
  },
  {
    key: "email",
    label: "Email",
  },
];

// for hr to filter employee
export const HR_EMPLOYEE_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "verified",
    values: ["all", "verified", "deactivated"],
  },
];

export const HR_EMPLOYEE_SORT: SortPairsInterface[] = [
  {
    key: "first_name",
    label: "First Name",
  },
  {
    key: "last_name",
    label: "Last Name",
  },
  {
    key: "email",
    label: "Email",
  },
];

export const HR_EMPLOYEE_SEARCH: SearchPairsInterface[] = [
  {
    key: "first_name",
    label: "First Name",
  },
  {
    key: "last_name",
    label: "Last Name",
  },
  {
    key: "email",
    label: "Email",
  },
];

// for hr to filter employee onboardings
export const HR_EMPLOYEE_ONBOARDING_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "status",
    values: ["all", "pending", "in_progress", "done"],
  },
];

export const HR_EMPLOYEE_ONBOARDING_SORT: SortPairsInterface[] = [
  {
    key: "first_name",
    label: "First Name",
  },
  {
    key: "last_name",
    label: "Last Name",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "created_at",
    label: "Assigned On",
  },
];

export const HR_EMPLOYEE_ONBOARDING_SEARCH: SearchPairsInterface[] = [
  {
    key: "first_name",
    label: "First Name",
  },
  {
    key: "last_name",
    label: "Last Name",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "status",
    label: "Status",
  },
];

// for hr to filter employee leave
export const HR_EMPLOYEE_LEAVE_TYPE_SEARCH: SearchPairsInterface[] = [
  {
    key: "first_name",
    label: "First Name",
  },
  {
    key: "last_name",
    label: "Last Name",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "reason",
    label: "Reason",
  },
];

export const HR_EMPLOYEE_LEAVE_TYPE_SORT: SortPairsInterface[] = [
  {
    key: "start_date",
    label: "Start Date",
  },
  {
    key: "end_date",
    label: "End Date",
  },
  {
    key: "balance",
    label: "Balance",
  },
];

export const HR_EMPLOYEE_LEAVE_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "status",
    values: ["all", "pending", "in_progress", "done"],
  },
  {
    key: "type",
    values: [
      "Work From Home Leave",
      "Unpaid Leave",
      "Study Leave",
      "Sick Leave",
      "Short-Term Leave",
      "Sabbatical Leave",
      "Quarantine Leave",
      "Paternity Leave",
      "Maternity Leave",
      "Marriage Leave",
      "Emergency Leave",
      "Compensatory Leave",
      "Casual Leave",
      "Bereavement Leave",
      "Annual Leave",
    ],
  },
];

// for hr to filter employee performances
export const HR_EMPLOYEE_PERFORMANCE_SEARCH: SearchPairsInterface[] = [
  {
    key: "first_name",
    label: "First Name",
  },
  {
    key: "last_name",
    label: "Last Name",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "title",
    label: "Title",
  },
];

export const HR_EMPLOYEE_PERFORMANCE_SORT: SortPairsInterface[] = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "created_at",
    label: "Assigned On",
  },
];

export const HR_EMPLOYEE_PERFORMANCE_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "status",
    values: ["all", "pending", "in_progress", "done"],
  },
];

// for hr to filter employee trainings
export const HR_EMPLOYEE_TRAINING_SEARCH: SearchPairsInterface[] = [
  {
    key: "first_name",
    label: "First Name",
  },
  {
    key: "last_name",
    label: "Last Name",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "title",
    label: "Title",
  },
];

export const HR_EMPLOYEE_TRAINING_SORT: SortPairsInterface[] = [
  {
    key: "created_at",
    label: "Assigned On",
  },
  {
    key: "deadline",
    label: "Deadline",
  },
  {
    key: "score",
    label: "Score",
  },
];

export const HR_EMPLOYEE_TRAINING_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "status",
    values: ["all", "pending", "in_progress", "done"],
  },
];

// for hr to filter leave

export const HR_LEAVE_TYPE_SORT: SortPairsInterface[] = [
  {
    key: "type",
    label: "Leave Type",
  },
  {
    key: "created_at",
    label: "Created At",
  },
];

export const HR_LEAVE_TYPE_SEARCH: SearchPairsInterface[] = [
  {
    key: "type",
    label: "Leave Type",
  },
  {
    key: "description",
    label: "Description",
  },
];

// for hr to filter leave balance
export const HR_LEAVE_BALANCE_SORT: SortPairsInterface[] = [
  {
    key: "balance",
    label: "Balance",
  },
  {
    key: "type",
    label: "Leave Type",
  },
];

// for hr to filter leave request
export const HR_LEAVE_REQUEST_SEARCH: SearchPairsInterface[] = [
  {
    key: "type",
    label: "Leave Type",
  },
  {
    key: "reason",
    label: "Reason",
  },
];

export const HR_LEAVE_REQUEST_SORT: SortPairsInterface[] = [
  {
    key: "start_date",
    label: "Start Date",
  },
  {
    key: "end_date",
    label: "End Date",
  },
  {
    key: "created_at",
    label: "Requested At",
  },
];

export const HR_LEAVE_REQUEST_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "status",
    values: ["all", "pending", "in_progress", "done", "approved", "rejected"],
  },
];

// for hr to filter onboarding
export const HR_ONBOARDING_SORT: SortPairsInterface[] = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "created_at",
    label: "Created At",
  },
];

export const HR_ONBOARDING_SEARCH: SearchPairsInterface[] = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "description",
    label: "Description",
  },
];

// for hr to filter performance reviews

export const HR_PERFORMANCE_SORT: SortPairsInterface[] = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "created_at",
    label: "Created At",
  },
];

export const HR_PERFORMANCE_SEARCH: SearchPairsInterface[] = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "description",
    label: "Description",
  },
];

// for hr to filter training

export const HR_TRAINING_SORT: SortPairsInterface[] = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "created_at",
    label: "Created At",
  },
];

export const HR_TRAINING_SEARCH: SearchPairsInterface[] = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "description",
    label: "Description",
  },
];

// for hr to filter docoments

export const HR_DOCUMENTS_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "",
    values: ["all", "documents", "folders"],
  },
];

export const HR_DOCUMENTS_SORT: SortPairsInterface[] = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "created_at",
    label: "Created At",
  },
];

export const HR_DOCUMENTS_SEARCH: SearchPairsInterface[] = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "description",
    label: "Description",
  },
];

export const HR_FOLDERS_SEARCH: SearchPairsInterface[] = [
  {
    key: "name",
    label: "Name",
  },
];

// for employee to filter onboarding

export const EMPLOYEE_ONBOARDING_SEARCH: SearchPairsInterface[] = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "description",
    label: "Description",
  },
];

export const EMPLOYEE_ONBOARDING_SORT: SortPairsInterface[] = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "created_at",
    label: "Assigned At",
  },
];

export const EMPLOYEE_ONBOARDING_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "status",
    values: ["all", "pending", "in_progress", "done"],
  },
];

// for employee to filter leave types

export const EMPLOYEE_LEAVE_BALANCE_SEARCH: SearchPairsInterface[] = [
  {
    key: "type",
    label: "Type",
  },
];

export const EMPLOYEE_LEAVE_BALANCE_SORT: SortPairsInterface[] = [
  {
    key: "type",
    label: "Type",
  },
  {
    key: "balance",
    label: "Balance",
  },
];

// for employee to filter leave requests

export const EMPLOYEE_LEAVE_REQUEST_SORT: SortPairsInterface[] = [
  {
    key: "start_date",
    label: "Start Date",
  },
  {
    key: "end_date",
    label: "End Date",
  },
  {
    key: "created_at",
    label: "Requested At",
  },
];

export const EMPLOYEE_LEAVE_REQUEST_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "status",
    values: ["all", "pending", "in_progress", "done", "approved", "rejected"],
  },
];

// for employee to filter leave

export const EMPLOYEE_PERFORMANCE_REVIEW_SEARCH: SearchPairsInterface[] = [
  {
    key: "title",
    label: "Title",
  },
];

export const EMPLOYEE_PERFORMANCE_REVIEW_SORT: SortPairsInterface[] = [
  {
    key: "title",
    label: "Title",
  },
];

// for employee to filter training

export const EMPLOYEE_TRAINING_SEARCH: SearchPairsInterface[] = [
  {
    key: "title",
    label: "Title",
  },
];

export const EMPLOYEE_TRAINING_SORT: SortPairsInterface[] = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "deadline",
    label: "Deadline",
  },
];

export const EMPLOYEE_TRAINING_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "status",
    values: ["all", "pending", "in_progress", "done"],
  },
];

// for employee to filter documents

export const EMPLOYEE_DOCUMENTS_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "",
    values: ["all", "documents", "folders"],
  },
];

export const EMPLOYEE_DOCUMENTS_SORT: SortPairsInterface[] = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "created_at",
    label: "Created At",
  },
];

export const EMPLOYEE_DOCUMENTS_SEARCH: SearchPairsInterface[] = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "description",
    label: "Description",
  },
];

export const EMPLOYEE_FOLDERS_SEARCH: SearchPairsInterface[] = [
  {
    key: "name",
    label: "Name",
  },
];
