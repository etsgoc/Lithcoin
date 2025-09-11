// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Lithcoin is ERC20 {
    constructor() ERC20("Lithcoin", "LTCO") {
        // Mint 120 million tokens to the deployer
        _mint(msg.sender, 120_000_000 * 18 ** decimals());
    }
}
