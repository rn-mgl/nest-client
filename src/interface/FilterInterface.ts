interface SearchInterface {
  searchKey: string;
  searchValue: string;
  searchLabel: string;
  canSeeSearchDropDown: boolean;
  toggleCanSeeSearchDropDown: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectSearch: (key: string, label: string) => void;
}

interface CategoryInterface {
  categoryValue: string;
  canSeeCategoryDropDown: boolean;
  toggleCanSeeCategoryDropDown: () => void;
  selectCategory: (key: string, values: string) => void;
}

interface SortInterface {
  sortKey: string;
  sortLabel: string;
  isAsc: boolean;
  canSeeSortDropDown: boolean;
  toggleCanSeeSortDropDown: () => void;
  toggleAsc: () => void;
  selectSort: (key: string, label: string) => void;
}

export interface FilterInterface {
  search?: SearchInterface;
  sort?: SortInterface;
  category?: CategoryInterface;
  searchKeyLabelPairs?: Array<{
    key: string;
    label: string;
  }>;
  categoryKeyValuePairs?: Array<{
    key: string;
    values: string[];
  }>;
  sortKeyLabelPairs?: Array<{
    key: string;
    label: string;
  }>;
}
