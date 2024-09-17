// - The `Auction` struct is declared as `memory` in several functions like `bidOnAuction`, `cancelAuction`, and `finalizeAuction`. This means you are working on a local copy of the auction and not modifying the actual data in storage. You should use `storage` instead to modify the state of the auction within these functions. 

// **Refunding Bidders:**
// - In the refund logic, you correctly use the `.call` method for transferring Ether. However, in the `finalizeAuction` and `cancelAuction` functions, the `revert("Refund failed");` message should be adjusted to reflect that it's the transfer to the auction owner or bidder that failed, not a refund.

// **Edge Cases for Canceling and Finalizing Auctions:**
// - It's good to add conditions for whether an auction has already been finalized or canceled. For example, in `finalizeAuction`, check if the auction is already finalized before allowing the function to proceed. Similarly, ensure canceled auctions cannot be finalized.

// - Use `storage` instead of `memory` where you are modifying the auction data.

// - **Storage instead of memory**: In `bidOnAuction`, `cancelAuction`, and `finalizeAuction`, I switched from `memory` to `storage` when dealing with the `Auction` struct to ensure that i am working with the actual auction data on the blockchain.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DeedRepository.sol";

contract AuctionRepository {
  struct Bid {
    address payable from;
    uint256 amount;
  }

  struct Auction {
    string name;
    uint256 endTime;
    uint256 startPrice;
    string metadata;
    uint256 deedId;
    address deedRepositoryAddress;
    address payable owner;
    bool active;
    bool finalized;
  }

	// Array storing all auctions
	Auction[] public auctions;
	// Mapping from auction index to user bids array
	mapping(uint256 => Bid[]) public auctionBids;
	// Mapping from owner to a list/array of owned auctions
	mapping(address => uint[]) public auctionOwner;

	event BidSuccess(address _from, uint _auctionId);
	event AuctionCreated(address _owner, uint _auctionId);
	event AuctionCanceled(address _owner, uint _auctionId);
	event AuctionFinalized(address _finalizer, uint _auctionId);

	/**
  * @dev Guarantees msg.sender is owner of the given auction
  * @param _auctionId uint ID of the auction to validate its ownership belongs to msg.sender
  */
	modifier isOwner(uint _auctionId) {
		require(auctions[_auctionId].owner == msg.sender, "Not the auction owner");
		_;
	}

	/**
  * @dev Guarantees this contract is owner of the given deed/token
  * @param _deedRepositoryAddress address of the deed repository to validate from
  * @param _deedId uint256 ID of the deed which has been registered in the deed repository
  */
	modifier contractIsDeedOwner(address _deedRepositoryAddress, uint256 _deedId) {
		address deedOwner = DeedRepository(_deedRepositoryAddress).ownerOf(_deedId);
		require(deedOwner == address(this), "Contract is not the deed owner");
		_;
	}

	/**
  * @dev Creates an auction with the given informatin
  * @param _deedRepositoryAddress address of the DeedRepository contract
  * @param _deedId uint256 of the deed registered in DeedRepository
  * @param _auctionTitle string containing auction title
  * @param _metadata string containing auction metadata 
  * @param _startPrice uint256 starting price of the auction
  * @param _endTime uint is the timestamp in which the auction expires
  * @return bool whether the auction is created
  */
	function createAuction(
		address _deedRepositoryAddress,
		uint256 _deedId,
		string memory _auctionTitle,
		string memory _metadata,
		uint256 _startPrice,
		uint _endTime
	) public contractIsDeedOwner(_deedRepositoryAddress, _deedId) returns (bool) {
			uint auctionId = auctions.length;

		Auction memory newAuction = Auction({
			name: _auctionTitle,
			endTime: _endTime,
			startPrice: _startPrice,
			metadata: _metadata,
			deedId: _deedId,
			deedRepositoryAddress: _deedRepositoryAddress,
			owner: payable(msg.sender),
			active: true,
			finalized: false
		});

		auctions.push(newAuction);
		auctionOwner[msg.sender].push(auctionId);

		emit AuctionCreated(msg.sender, auctionId);
		return true;
	}

	/**
  * @dev Bidder sends bid on an auction
  * @dev Auction should be active and not ended
  * @dev Refund previous bidder if a new bid is valid and placed.
  * @param _auctionId uint ID of the created auction
  */
	function bidOnAuction(uint _auctionId) external payable {
		//store this very bid amount contained in msg.value
		uint256 ethAmountSent = msg.value;
		Auction storage myAuction = auctions[_auctionId];

		// owner can't bid on their auctions
		require(myAuction.owner != msg.sender, "Owner cannot bid");
		// reject if auction is expired
		require(block.timestamp <= myAuction.endTime, "Auction has ended");
		// reject if bid is inactive
		require(myAuction.active, "Auction is not active");

		/* track previous bids and get current bid amount
		if not available revert to bid start price*/
		uint bidsLength = auctionBids[_auctionId].length;
		uint256 minimumBidAmount = myAuction.startPrice;
		// last bid details
		Bid memory lastBid;

		//if there are previous bids, retrieve the last bid 
		// and set minimum bid requirement
		if (bidsLength > 0) {
			lastBid = auctionBids[_auctionId][bidsLength - 1];
			minimumBidAmount = lastBid.amount;
		}

		//if this very bid amount is lower than the minimum bid amount
		require(ethAmountSent > minimumBidAmount, "Bid amount too low");

		// refund the last bidder since your bid amount is higher
		if (bidsLength > 0) {
			(bool success, ) = lastBid.from.call{value: lastBid.amount}("");
			if (!success) {
				revert("Refund to previous bidder failed");
			}
		}

		Bid memory newBid = Bid({
			from: payable(msg.sender),
			amount: ethAmountSent
		});

		// store your new bid then adds this new bid to the auction
		auctionBids[_auctionId].push(newBid);

		emit BidSuccess(msg.sender, _auctionId);
	}

	function cancelAuction(uint _auctionId) public isOwner(_auctionId) {
		Auction storage myAuction = auctions[_auctionId];
		require(myAuction.active, "Auction is not active");

		uint bidsLength = auctionBids[_auctionId].length;

		if (bidsLength > 0) {
			Bid memory lastBid = auctionBids[_auctionId][bidsLength - 1];
			(bool success, ) = myAuction.owner.call{value: lastBid.amount}("");
			if (!success) {
				revert("Refund to last bidder failed");
			}
		}

		if (approveAndTransfer(address(this), myAuction.owner, myAuction.deedRepositoryAddress, myAuction.deedId)) {
			myAuction.active = false;
			emit AuctionCanceled(msg.sender, _auctionId);
		}
	}

	function finalizeAuction(uint _auctionId) public {
		Auction storage myAuction = auctions[_auctionId];
		require(block.timestamp >= myAuction.endTime, "Auction has not ended yet");
		require(!myAuction.finalized, "Auction is already finalized");

		uint bidsLength = auctionBids[_auctionId].length;

		if (bidsLength == 0) {
			cancelAuction(_auctionId);
		} else {
			Bid memory lastBid = auctionBids[_auctionId][bidsLength - 1];
			(bool success, ) = myAuction.owner.call{value: lastBid.amount}("");
			if (!success) {
				revert("Transfer to auction owner failed");
			}

			if (approveAndTransfer(address(this), lastBid.from, myAuction.deedRepositoryAddress, myAuction.deedId)) {
				myAuction.active = false;
				myAuction.finalized = true;
				emit AuctionFinalized(msg.sender, _auctionId);
			}
		}
	}

	function approveAndTransfer(
		address _from,
		address _to,
		address _deedRepositoryAddress,
		uint256 _deedId
	) internal returns (bool) {
		DeedRepository remoteContract = DeedRepository(_deedRepositoryAddress);
		remoteContract.approve(_to, _deedId);
		remoteContract.transferFrom(_from, _to, _deedId);
		return true;
	}

	receive() external payable {
		revert("Direct payments not allowed");
	}
}
