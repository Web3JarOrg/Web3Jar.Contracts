import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import hre from "hardhat";

import type { Web3Jar, Web3JarFactory } from "../typechain-types";
import { Web3Jar__factory, Web3JarFactory__factory } from "../typechain-types";

describe("Web3Jar test scope", () => {
  const TARGET = 1;

  let signer: SignerWithAddress;
  let randomUser: SignerWithAddress;
  let web3Jar: Web3Jar;
  let web3JarFactory: Web3JarFactory;

  beforeEach(async () => {
    [signer, randomUser] = await hre.ethers.getSigners();
    web3JarFactory = await new Web3JarFactory__factory(signer).deploy();
    const deployJar = await web3JarFactory.createJar(TARGET, signer.address);
    await deployJar.wait();

    const [web3JarAddr] = await web3JarFactory.getAllJars();
    web3Jar = Web3Jar__factory.connect(web3JarAddr, signer);
  });

  it("Should be able to donate funds", async () => {
    const donate = await web3Jar.donate({
      value: hre.ethers.utils.parseEther((TARGET / 2).toString()),
    });
    await donate.wait();

    const contractBalance = await hre.ethers.provider.getBalance(
      web3Jar.address
    );

    expect(contractBalance).to.be.gt(BigNumber.from(0));
  });

  it("Shouldn't receive any donations if target is reached", async () => {
    const donate = web3Jar.donate({
      value: hre.ethers.utils.parseEther((TARGET * 2).toString()),
    });

    await expect(donate).to.be.rejectedWith(
      "Web3Jar: Target already achieved!"
    );
  });

  it("Shouldn't receive any donations if fundraising is not active", async () => {
    const endFundraising = await web3Jar.endFundraising();
    await endFundraising.wait();

    const donate = web3Jar.donate({
      value: hre.ethers.utils.parseEther((TARGET / 2).toString()),
    });

    await expect(donate).to.be.rejectedWith("Web3Jar: Jar is not active!");
  });

  it("Shouldn't let anyone end fundraising except owner", async () => {
    const donate = await web3Jar.donate({
      value: hre.ethers.utils.parseEther((TARGET / 2).toString()),
    });
    await donate.wait();

    const endFundraising = web3Jar.connect(randomUser).endFundraising();

    await expect(endFundraising).to.be.rejectedWith(
      "Web3Jar: Caller is not the owner!"
    );
  });

  it("Should withdraw funds and end fundraising", async () => {
    const donate = await web3Jar.donate({
      value: hre.ethers.utils.parseEther((TARGET / 2).toString()),
    });
    await donate.wait();

    const balanceBeforeWD = await hre.ethers.provider.getBalance(
      signer.address
    );

    const contractBalance = await hre.ethers.provider.getBalance(
      web3Jar.address
    );

    const endFundraising = await web3Jar.endFundraising();
    await endFundraising.wait();

    const balanceAfterWD = await hre.ethers.provider.getBalance(signer.address);

    expect(
      Math.floor(Number(hre.ethers.utils.formatUnits(balanceAfterWD, 18)))
    ).to.eq(
      Math.floor(
        Number(
          hre.ethers.utils.formatUnits(balanceBeforeWD.add(contractBalance), 18)
        )
      )
    );

    expect(await web3Jar.isActive()).to.eq(false);
  });
});
