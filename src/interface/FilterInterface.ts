export interface SearchInterface {
  searchKey: string;
  searchValue: string;
  searchLabel: string;
  canSeeSearchDropDown: boolean;
  toggleCanSeeSearchDropDown: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectSearch: (key: string, label: string) => void;
}

export interface CategoryInterface {
  categoryLabel: string;
  canSeeCategoryDropDown: boolean;
  toggleCanSeeCategoryDropDown: () => void;
  selectCategory: (
    key: string,
    value: string | boolean | null,
    label: string
  ) => void;
}

export interface SortInterface {
  sortKey: string;
  sortLabel: string;
  isAsc: boolean;
  canSeeSortDropDown: boolean;
  toggleCanSeeSortDropDown: () => void;
  toggleAsc: () => void;
  selectSort: (key: string, label: string) => void;
}

export interface FilterInterface {
  useSearchFilter?: boolean;
  useSortFilter?: boolean;
  useCategoryFilter?: boolean;
  searchKeyLabelPairs?: Array<{
    key: string;
    label: string;
  }>;
  categoryKeyValuePairs?: Array<{
    key: string;
    labelValue: Array<{ label: string; value: string | boolean | null }>;
  }>;
  sortKeyLabelPairs?: Array<{
    key: string;
    label: string;
  }>;
}
