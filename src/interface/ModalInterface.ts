export interface Modal {
  toggleModal: () => void;
  refetchIndex?: () => Promise<void>;
}

export interface UpdateModal {
  id: number;
}
