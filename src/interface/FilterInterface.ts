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
  categoryValue: string | number | boolean | null;
  canSeeCategoryDropDown: boolean;
  toggleCanSeeCategoryDropDown: () => void;
  selectCategory: (
    key: string,
    value: string | number | boolean | null,
    label: string
  ) => void;
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
    labelValues: { label: string; value: string | number | boolean | null }[];
  }>;
  sortKeyLabelPairs?: Array<{
    key: string;
    label: string;
  }>;
}
