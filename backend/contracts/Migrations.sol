// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Migrations {
  address public owner;
  uint public last_completed_migration;

  modifier onlyOwner() {
    require(msg.sender == owner, "Only the owner can perform task");
		_;
  }

  constructor() {
    owner = msg.sender;
  }

  function setCompleted(uint completed) public onlyOwner {
    last_completed_migration = completed;
  }

  function upgrade(address new_address) public onlyOwner {
    require(new_address != address(0), "Invalid address");
    
    uint32 size;
    assembly {
      size := extcodesize(new_address)
    }
    require(size > 0, "Address is not a contract");

    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }
}