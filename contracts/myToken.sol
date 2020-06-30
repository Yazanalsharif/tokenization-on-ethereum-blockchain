pragma solidity ^0.6.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract myToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("miqyry", "miq", 0) public {
        _mint(msg.sender, initialSupply);
    }
}