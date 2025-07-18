interface CategoryPairsInterface {
  key: string;
  labelValue: Array<{ label: string; value: string | boolean | null }>;
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
    labelValue: [
      { label: "All", value: "all" },
      { label: "Verified", value: true },
      { label: "Deactivated", value: false },
    ],
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
    labelValue: [
      { label: "All", value: "all" },
      { label: "Verified", value: true },
      { label: "Deactivated", value: false },
    ],
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
    labelValue: [
      { label: "All", value: "all" },
      { label: "Pending", value: "Pending" },
      { label: "In Progress", value: "In Progress" },
      { label: "Done", value: "Done" },
    ],
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

// for hr to filter leave
export const HR_LEAVE_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "",
    labelValue: [{ label: "", value: "all" }],
  },
];

export const HR_LEAVE_SORT: SortPairsInterface[] = [
  {
    key: "type",
    label: "Leave Type",
  },
  {
    key: "created_at",
    label: "Created At",
  },
];

export const HR_LEAVE_SEARCH: SearchPairsInterface[] = [
  {
    key: "type",
    label: "Leave Type",
  },
  {
    key: "description",
    label: "Description",
  },
];

// for hr to filter onboarding
export const HR_ONBOARDING_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "",
    labelValue: [{ label: "", value: "all" }],
  },
];

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

export const HR_PERFORMANCE_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "",
    labelValue: [{ label: "", value: "all" }],
  },
];

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

export const HR_TRAINING_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "",
    labelValue: [{ label: "", value: "all" }],
  },
];

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
    key: "-",
    labelValue: [
      { label: "All", value: "all" },
      { label: "Documents", value: "documents" },
      { label: "Folders", value: "folders" },
    ],
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
    labelValue: [
      { label: "All", value: "all" },
      { label: "Pending", value: "Pending" },
      { label: "In Progress", value: "In Progress" },
      { label: "Done", value: "Done" },
    ],
  },
];

// for employee to filter leave

export const EMPLOYEE_LEAVE_SEARCH: SearchPairsInterface[] = [
  {
    key: "type",
    label: "Type",
  },
];

export const EMPLOYEE_LEAVE_SORT: SortPairsInterface[] = [
  {
    key: "type",
    label: "Type",
  },
  {
    key: "balance",
    label: "Balance",
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
    labelValue: [
      { label: "All", value: "all" },
      { label: "Pending", value: "Pending" },
      { label: "In Progress", value: "In Progress" },
      { label: "Done", value: "Done" },
    ],
  },
];

// for employee to filter documents

export const EMPLOYEE_DOCUMENTS_CATEGORY: CategoryPairsInterface[] = [
  {
    key: "-",
    labelValue: [
      { label: "All", value: "all" },
      { label: "Documents", value: "documents" },
      { label: "Folders", value: "folders" },
    ],
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
