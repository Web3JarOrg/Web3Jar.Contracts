// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Web3Jar.sol";

contract Web3JarFactory {
    Web3Jar[] private jars;

    event CreateJar(address indexed jar);

    function createJar(
        uint256 _target,
        address _jarOwner,
        string memory _jarName,
        string calldata _description
    ) external {
        Web3Jar newJar = new Web3Jar(
            _target,
            _jarOwner,
            _jarName,
            _description
        );
        jars.push(newJar);

        emit CreateJar(address(newJar));
    }

    function getAllJars() external view returns (Web3Jar[] memory) {
        return jars;
    }
}
