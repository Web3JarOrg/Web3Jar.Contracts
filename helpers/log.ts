import colors from "colors";

import type { LogType } from "./types";

const prettyDeploy = (contractName: string, contractAddress: string) => {
  console.log(
    colors.bold(colors.green(`🌐 ${contractName} successfully deployed.`))
  );

  console.log(colors.bold(colors.yellow("Address:")), contractAddress);
};

const prettyPreDeploy = (contractName: string) => {
  console.log("⌛ Deploying", colors.bold(colors.green(contractName)) + "...");
};

export const log: LogType = {
  deploy: prettyDeploy,
  preDeploy: prettyPreDeploy,
};
