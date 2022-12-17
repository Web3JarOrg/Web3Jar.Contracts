import { task, types } from "hardhat/config";
import type { HardhatRuntimeEnvironment as HRE } from "hardhat/types";

import { TaskNames } from "./task-names";
import type { Web3JarParamsType } from "./types";

import { log } from "../helpers/log";
import { Web3JarFactory__factory } from "../typechain-types";

task(TaskNames.DEPLOY_FACTORY).setAction(async (_, hre: HRE) => {
  const [signer] = await hre.ethers.getSigners();
  log.preDeploy("Web3JarFactory");

  const factory = new Web3JarFactory__factory(signer);
  const web3JarFactory = await factory.deploy();
  await web3JarFactory.deployed();
  log.deploy("Web3JarFactory", web3JarFactory.address);

  return web3JarFactory.address;
});

task(TaskNames.DEPLOY_JAR)
  .addParam("target", "The amount to be raised", 0, types.int)
  .addParam("owner", "Owner address", "", types.string)
  .addParam("factory", "Factory contract address", "", types.string)
  .addParam("jarName", "Jar name", "", types.string)
  .addParam("description", "Jar description", "", types.string)

  .setAction(async (params: Web3JarParamsType, hre: HRE) => {
    const [signer] = await hre.ethers.getSigners();
    log.preDeploy("Web3Jar");

    const target = params.target || 1;
    const owner = params.owner || signer.address;
    const factoryAddr =
      params.factory || (await hre.run(TaskNames.DEPLOY_FACTORY));
    const jarName = params.jarName || "My jar";
    const description = params.description || "Jar description";

    const web3JarFactory = Web3JarFactory__factory.connect(factoryAddr, signer);

    const deploy = await web3JarFactory.createJar(
      target,
      owner,
      jarName,
      description
    );
    await deploy.wait();

    const web3JarAddr = await web3JarFactory
      .getAllJars()
      .then((jars) => (jars.length > 0 ? jars[jars.length - 1] : jars[0]));

    log.deploy("Web3Jar", web3JarAddr);
  });
