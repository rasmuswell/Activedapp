interface IContextProps {
  children: any;
}
interface IBalance {
  command: string; // "balance"
  pending: boolean; // false
  response: IBalanceResponse; //
  status: boolean; // true
}

interface IBalanceResponse {
  coins: number;
  confirmed: number;
  sendable: number;
  token: string;
  tokenid: string;
  total: number;
  unconfirmed: number;
}

interface IStatus {
  command: string; // "status"
  pending: boolean; // false
  response: IStatusResponse; //
  status: boolean; // true
}

interface IStatusResponse {
  chain: IStatusChainResponse;
}

interface IStatusChainResponse {
  block: number;
}

interface IDataHash {
  command: string;
  params: {};
  pending: boolean;
  response: {};
  status: boolean;
}

interface ITransactionResponse {
  status: boolean;
  pendinguid: string;
  response?: {
    txpowid: string;
    // Add other fields as needed
  };
  error?: string;
}

interface IPendingState {
  status: boolean;
  pending: boolean;
  pendinguid: string;
  coinid?: string;
}
interface IMetaDataNFT {
  name: string;
  url: {};
  metadata: { hash: string; index: string }[];
}
interface IPopupProps {
  message: string;
  fee: number;
  balance: IBalanceResponse;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
  }[];
}
