export interface ModalInterface {
  toggleModal: () => void;
  refetchIndex?: () => Promise<void>;
}

export interface ShowModalInterface {
  label?: string;
  id: number;
  setActiveModal: (id: number) => void;
}

export interface UpdateModalInterface {
  id: number;
}

export interface DeleteModalInterface {
  id: number;
}
