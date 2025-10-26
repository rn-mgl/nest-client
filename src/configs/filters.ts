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

// for hr to filter employee
export const MANAGEMENT_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "verification_status",
    values: ["All", "Verified", "Deactivated"],
  },
];

export const MANAGEMENT_SORT: SortPairsInterface[] = [
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

export const MANAGEMENT_SEARCH: SearchPairsInterface[] = [
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

// for hr to filter employee attendance
export const MANAGEMENT_ATTENDANCE_SORT: SortPairsInterface[] = [
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
    key: "login_time",
    label: "In",
  },
  {
    key: "logout_time",
    label: "Out",
  },
];

export const MANAGEMENT_ATTENDANCE_SEARCH: SearchPairsInterface[] = [
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
export const MANAGEMENT_ONBOARDING_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "status",
    values: ["All", "Pending", "In Progress", "Done"],
  },
];

export const MANAGEMENT_ONBOARDING_SORT: SortPairsInterface[] = [
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
    key: "assigned_on",
    label: "Assigned On",
  },
];

export const MANAGEMENT_ONBOARDING_SEARCH: SearchPairsInterface[] = [
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
export const MANAGEMENT_LEAVE_TYPE_SEARCH: SearchPairsInterface[] = [
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

export const MANAGEMENT_LEAVE_TYPE_SORT: SortPairsInterface[] = [
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

export const MANAGEMENT_LEAVE_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "status",
    values: ["All", "Pending", "In Progress", "Done", "Rejected", "Approved"],
  },
];

// for hr to filter employee performances
export const MANAGEMENT_PERFORMANCE_SEARCH: SearchPairsInterface[] = [
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

export const MANAGEMENT_PERFORMANCE_SORT: SortPairsInterface[] = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "assigned_on",
    label: "Assigned On",
  },
];

export const MANAGEMENT_PERFORMANCE_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "status",
    values: ["All", "Pending", "In Progress", "Done"],
  },
];

// for hr to filter employee trainings
export const MANAGEMENT_TRAINING_SEARCH: SearchPairsInterface[] = [
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

export const MANAGEMENT_TRAINING_SORT: SortPairsInterface[] = [
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

export const MANAGEMENT_TRAINING_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "status",
    values: ["All", "Pending", "In Progress", "Done"],
  },
];

// for hr to filter docoments

export const RESOURCE_DOCUMENTS_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "type",
    values: ["All", "Document", "Folder"],
  },
];

export const RESOURCE_DOCUMENTS_SORT: SortPairsInterface[] = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "created_at",
    label: "Created At",
  },
];

export const RESOURCE_DOCUMENTS_SEARCH: SearchPairsInterface[] = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "description",
    label: "Description",
  },
];

export const RESOURCE_FOLDERS_SEARCH: SearchPairsInterface[] = [
  {
    key: "title",
    label: "Title",
  },
];

// for user to filter resource onboarding
export const RESOURCE_ONBOARDING_SORT: SortPairsInterface[] = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "created_at",
    label: "Created At",
  },
];

export const RESOURCE_ONBOARDING_SEARCH: SearchPairsInterface[] = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "description",
    label: "Description",
  },
];

// for user to filter assigned onboarding
export const ASSIGNED_ONBOARDING_SEARCH: SearchPairsInterface[] = [
  {
    key: "onboarding.title",
    label: "Title",
  },
  {
    key: "onboarding.description",
    label: "Description",
  },
];

export const ASSIGNED_ONBOARDING_SORT: SortPairsInterface[] = [
  {
    key: "onboarding.title",
    label: "Title",
  },
  {
    key: "created_at",
    label: "Assigned At",
  },
];

export const ASSIGNED_ONBOARDING_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "status",
    values: ["All", "Pending", "In Progress", "Done"],
  },
];

// for user to filter assigned leave types

export const ASSIGNED_LEAVE_TYPE_SEARCH: SearchPairsInterface[] = [
  {
    key: "leave.type",
    label: "Leave Type",
  },
];

export const ASSIGNED_LEAVE_TYPE_SORT: SortPairsInterface[] = [
  {
    key: "leave.type",
    label: "Leave Type",
  },
  {
    key: "leave.balance",
    label: "Balance",
  },
];

// for user to filter resource leave type

export const RESOURCE_LEAVE_TYPE_SORT: SortPairsInterface[] = [
  {
    key: "type",
    label: "Leave Type",
  },
  {
    key: "created_at",
    label: "Created At",
  },
];

export const RESOURCE_LEAVE_TYPE_SEARCH: SearchPairsInterface[] = [
  {
    key: "type",
    label: "Leave Type",
  },
  {
    key: "description",
    label: "Description",
  },
];

// for user to filter resource leave requests

export const RESOURCE_LEAVE_REQUEST_SEARCH: SearchPairsInterface[] = [
  {
    key: "type",
    label: "Type",
  },
];

export const RESOURCE_LEAVE_REQUEST_SORT: SortPairsInterface[] = [
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

export const RESOURCE_LEAVE_REQUEST_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "status",
    values: ["All", "Pending", "In Progress", "Done", "Approved", "Rejected"],
  },
];

// for user to filter resource performance reviews
export const RESOURCE_PERFORMANCE_REVIEW_SORT: SortPairsInterface[] = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "created_at",
    label: "Created At",
  },
];

export const RESOURCE_PERFORMANCE_REVIEW_SEARCH: SearchPairsInterface[] = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "description",
    label: "Description",
  },
];

// for user to filter assigned performance review
export const ASSIGNED_PERFORMANCE_REVIEW_SEARCH: SearchPairsInterface[] = [
  {
    key: "performance_review.title",
    label: "Title",
  },
  {
    key: "performance_review.description",
    label: "Description",
  },
];

export const ASSIGNED_PERFORMANCE_REVIEW_SORT: SortPairsInterface[] = [
  {
    key: "performance_review.title",
    label: "Title",
  },
];

// for user to filter resource trianing
export const RESOURCE_TRAINING_SORT: SortPairsInterface[] = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "created_at",
    label: "Created At",
  },
];

export const RESOURCE_TRAINING_SEARCH: SearchPairsInterface[] = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "description",
    label: "Description",
  },
];

// for user to filter assigned training
export const ASSIGNED_TRAINING_SEARCH: SearchPairsInterface[] = [
  {
    key: "training.title",
    label: "Title",
  },
];

export const ASSIGNED_TRAINING_SORT: SortPairsInterface[] = [
  {
    key: "training.title",
    label: "Title",
  },
  {
    key: "deadline",
    label: "Deadline",
  },
];

export const ASSIGNED_TRAINING_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "status",
    values: ["All", "Pending", "In Progress", "Done"],
  },
];

// for user to filter role

export const RESOURCE_ROLE_SEARCH: SearchPairsInterface[] = [
  {
    key: "role",
    label: "Role",
  },
];

export const RESOURCE_ROLE_SORT: SortPairsInterface[] = [
  {
    key: "role",
    label: "Role",
  },
  {
    key: "created_at",
    label: "Created At",
  },
];
