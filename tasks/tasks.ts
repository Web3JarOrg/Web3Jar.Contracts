import { task, types } from "hardhat/config";
import type { HardhatRuntimeEnvironment as HRE } from "hardhat/types";

import { DEPLOY_LOCK } from "./task-names";
import type { LockParamsType } from "./types";

import { log } from "../helpers/log";
import { Lock__factory } from "../typechain-types";

task(DEPLOY_LOCK)
  .addParam("unlockTime", "Tokens unlock time", 0, types.int)
  .setAction(async (params: LockParamsType, hre: HRE) => {
    const [signer] = await hre.ethers.getSigners();
    log.preDeploy("Lock");

    const factory = new Lock__factory(signer);
    const lock = await factory.deploy(params.unlockTime);
    await lock.deployed();
    log.deploy("Lock", lock.address);
  });
