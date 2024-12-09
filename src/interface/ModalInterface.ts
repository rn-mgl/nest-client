export interface Modal {
  toggleModal?: () => void;
  setActiveModal?: (id: number) => void;
  refetchIndex?: () => Promise<void>;
}

export interface UpdateModal {
  id: number;
}

export interface DeleteModal {
  id: number;
}
