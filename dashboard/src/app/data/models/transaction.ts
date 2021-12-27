export interface Transaction {
  gasUsed: number;
  gasPrice: number;
  nonce: number;
  status: string;
  value: number;
  fee: number;
  timestamp: number;
  action: {
    description: string;
  };
}
