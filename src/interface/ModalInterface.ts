export interface Modal {
  toggleModal: () => void;
  refetchIndex?: () => Promise<void>;
}

export interface ShowModal {
  label?: string;
  id: number;
  setActiveModal: (id: number) => void;
}

export interface UpdateModal {
  id: number;
}

export interface DeleteModal {
  id: number;
}
