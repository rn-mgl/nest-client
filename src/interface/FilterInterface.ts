export interface SearchInterface {
  searchKey: string;
  searchValue: string;
  searchLabel: string;
  canSeeSearchDropDown: boolean;
  searchKeyLabelPairs?: Array<{
    key: string;
    label: string;
  }>;
  toggleCanSeeSearchDropDown: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectSearch: (key: string, label: string) => void;
}

export interface CategoryInterface {
  categoryValue: string;
  canSeeCategoryDropDown: boolean;
  categoryKeyValuePairs?: Array<{
    key: string;
    values: string[];
  }>;
  toggleCanSeeCategoryDropDown: () => void;
  selectCategory: (key: string, values: string) => void;
}

export interface SortInterface {
  sortKey: string;
  sortLabel: string;
  isAsc: boolean;
  canSeeSortDropDown: boolean;
  sortKeyLabelPairs?: Array<{
    key: string;
    label: string;
  }>;
  toggleCanSeeSortDropDown: () => void;
  toggleAsc: () => void;
  selectSort: (key: string, label: string) => void;
}

export interface FilterInterface {
  useSearchFilter?: boolean;
  useSortFilter?: boolean;
  useCategoryFilter?: boolean;
}
