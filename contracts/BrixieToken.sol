// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Brixie is ERC20, ERC20Burnable, Pausable, Ownable {
    address public potentialOwner;
    constructor() ERC20("Brixie", "BRIX") {
        
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function transfer(address to, uint256 value) override isNotSender(to) public virtual returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, value);
        return true;
    } 

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }

    function transferOwnership(address newOwner) override  public virtual onlyOwner {
        if(newOwner != address(0)) {
            potentialOwner = newOwner;
        }
    }
    
    function renounceOwnership() override  public virtual onlyOwner {
        
    }

    function acceptNewOwner() external {
        require(msg.sender == potentialOwner); 
        super._transferOwnership(potentialOwner);
    }

    modifier isNotSender(address to) {
        require(msg.sender != to, "Can not transfer token to yourself");
    _;
  }
}

