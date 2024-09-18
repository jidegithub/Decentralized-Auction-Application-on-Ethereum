// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
* @title Repository of ERC721 Deeds
* This contract contains the list of deeds registered by users.
* This is a demo to show how tokens (deeds) can be minted and added
* to the repository.
*/

contract DeedRepository is ERC721URIStorage {
  /**
  * @dev Created a DeedRepository with a name and symbol
  * @param _contractName string represents the name of the repository
  * @param _contractSymbol string represents the symbol of the repository
  */
  constructor(string memory _contractName, string memory _contractSymbol) ERC721(_contractName, _contractSymbol) {}

  function registerDeed(uint256 _tokenId, string memory _uri) public {
    _mint(msg.sender, _tokenId);
    _setDeedMetadata(_tokenId, _uri);  // Now using internal function
    emit DeedRegistered(msg.sender, _tokenId);
  }

  /**
  * @dev Internal function to add metadata to a deed
  * @param _tokenId represents a specific deed
  * @param _uri text which describes the characteristics of a given deed
  */
  function _setDeedMetadata(uint _tokenId, string memory _uri) internal {
    _setTokenURI(_tokenId, _uri);  // calling the internal function _setTokenURI
  }

  /**
  * @dev Event is triggered if deed/token is registered
  * @param _by address of the registrar
  * @param _deedTokenId uint256 represents a specific deed
  */
  event DeedRegistered(address _by, uint256 _deedTokenId);
}