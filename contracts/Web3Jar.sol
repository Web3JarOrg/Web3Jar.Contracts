// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Web3Jar {
    uint256 public target;

    address private owner;

    bool public isActive = true;

    constructor(uint256 _target, address _owner) {
        target = _target * 10**18;
        owner = _owner;
    }

    function donate() public payable onlyIfActive {
        require(
            address(this).balance < target,
            "Web3Jar: Target already achieved!"
        );
    }

    function endFundraising() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
        isActive = false;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Web3Jar: Caller is not the owner!");
        _;
    }

    modifier onlyIfActive() {
        require(isActive == true, "Web3Jar: Jar is not active!");
        _;
    }
}
