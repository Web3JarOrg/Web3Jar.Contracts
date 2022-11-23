import { getEnvVars } from "./getEnvVars";
import type { NetworkConfig, Networks } from "./types";

const { ALCHEMY_KEY, INFURA_KEY, PRIVATE_KEY } = getEnvVars();

const networkChainIDs = {
  main: 1,
  goerli: 5,
  testnet: 97,
};

const networkBaseURL = {
  main: ALCHEMY_KEY
    ? `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
    : `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  goerli: ALCHEMY_KEY
    ? `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_KEY}`
    : `https://goerli.infura.io/v3/${INFURA_KEY}`,
  testnet: "https://data-seed-prebsc-1-s1.binance.org:8545",
};

export const getNetworkConfig = (network: Networks): NetworkConfig => {
  return {
    url: networkBaseURL[network],
    chainId: networkChainIDs[network],
    accounts: [PRIVATE_KEY],
  };
};
