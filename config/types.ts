export type EnvVars = {
  ALCHEMY_KEY?: string;
  INFURA_KEY?: string;
  OPTIMIZER: boolean;
  REPORT_GAS: boolean;
  PRIVATE_KEY: string;
  ETHERSCAN_KEY?: string;
};

export type Networks = "main" | "goerli" | "testnet";

export type NetworkConfig = {
  url: string;
  accounts: string[];
  chainId: number;
};
