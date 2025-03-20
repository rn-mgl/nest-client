export interface ModalInterface {
  toggleModal: () => void;
  refetchIndex?: () => Promise<void>;
  id?: number;
}

export interface ShowModalInterface {
  label?: string;
  id: number;
  setActiveModal: (id: number) => void;
}
