export interface Modal {
  toggleModal: () => void;
  refetchIndex?: () => Promise<void>;
}
