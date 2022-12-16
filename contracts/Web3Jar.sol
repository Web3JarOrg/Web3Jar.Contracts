// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Web3Jar {
    uint256 public target;

    string public jarName;
    string public description;

    address private owner;

    bool public isActive = true;

    constructor(
        uint256 _target,
        address _owner,
        string memory _jarName,
        string memory _description
    ) {
        target = _target * 10 ** 18;
        owner = _owner;
        jarName = _jarName;
        description = _description;
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
