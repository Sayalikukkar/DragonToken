pragma solidity ^0.8.4;

import "@openzeppelin/contracts@4.5.0/token/ERC20/ERC20.sol";

contract DragonToken is ERC20 {
    constructor() ERC20("Dragon Token", "DTK") {
        _mint(msg.sender, 10000 * 10 ** decimals());
    }
}