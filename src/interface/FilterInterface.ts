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
  categoryKeyValuePairs: Array<{
    key: string;
    labelValue: Array<{ label: string; value: string | boolean | null }>;
  }>;
  canShowCategories: boolean;
  toggleShowCategories: () => void;
  selectCategory: (key: string, value: string | boolean | null) => void;
}

export interface Sort {
  sortKey: string;
  isAsc: boolean;
  sortKeyLabelPairs: Array<{
    key: string;
    label: string;
  }>;
  canShowSort: boolean;
  toggleShowSort: () => void;
  toggleAsc: () => void;
  selectSort: (key: string) => void;
}

export interface Filter {
  showFilters: boolean;
  toggleShowFilters: () => void;
}
