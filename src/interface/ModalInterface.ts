export interface ModalInterface {
  toggleModal: () => void;
  refetchIndex?: () => Promise<void>;
  id?: number;
  label?: string;
}

export interface DeleteModalInterface {
  route: string;
}

export interface AssignedModalInterface {
  viewSource?: "assigner" | "assignee";
}
