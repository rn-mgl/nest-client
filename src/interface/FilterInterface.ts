export interface Search {
  searchKey: string;
  searchValue: string;
  searchLabel: string;
  canShowSearch: boolean;
  searchKeyLabelPairs: Array<{
    key: string;
    label: string;
  }>;
  toggleShowSearch: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectSearch: (key: string, label: string) => void;
}

export interface Category {
  categoryLabel: string;
  categoryKeyValuePairs: Array<{
    key: string;
    labelValue: Array<{ label: string; value: string | boolean | null }>;
  }>;
  canShowCategories: boolean;
  toggleShowCategories: () => void;
  selectCategory: (
    key: string,
    value: string | boolean | null,
    label: string
  ) => void;
}

export interface Sort {
  sortKey: string;
  sortLabel: string;
  isAsc: boolean;
  sortKeyLabelPairs: Array<{
    key: string;
    label: string;
  }>;
  canShowSort: boolean;
  toggleShowSort: () => void;
  toggleAsc: () => void;
  selectSort: (key: string, label: string) => void;
}

export interface Filter {
  showFilters: boolean;
  showSearch?: boolean;
  showSort?: boolean;
  showCategory?: boolean;
  toggleShowFilters: () => void;
}
