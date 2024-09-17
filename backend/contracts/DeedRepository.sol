// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721/ERC721.sol";

/**
* @title Repository of ERC721 Deeds
* This contract contains the list of deeds registered by users.
* This is a demo to show how tokens (deeds) can be minted and added
* to the repository.
*/

contract DeedRepository is ERC721 {
  /**
* @dev Created a DeedRepository with a name and symbol
* @param _name string represents the name of the repository
* @param _symbol string represents the symbol of the repository
*/
  constructor(string _name, string _symbol) ERC721(_name, _symbol) {}

  function registerdDeed(uint256 _tokenId, string _uri) public {
    _mint(msg.sender, _tokenId);
    addDeedMetadata(_tokenId, _uri);
    emit DeedRegistered(msg.sender, _tokenId);
  }

  /**
  * @dev Public function to add metadata to a deed
  * @param _tokenId represents a specific deed
  * @param _uri text which describes the characteristics of a given deed
  * @return whether the deed metadata was added to the repository
  */

  function addDeedMetadata(uint _tokenId, string _uri) public returns(bool) {
    _setTokenURI(_tokenId,_uri);
    return true;
  }

  /**
* @dev Event is triggered if deed/token is registered
* @param _by address of the registrar
* @param _tokenId uint256 represents a specific deed
*/

  event DeedRegistered(address _by, uint26 _tokenId)
}
