stuff to understand:


Auction memory newAuction: This declares that newAuction is an in-memory variable, meaning it only exists temporarily for the duration of the function where it's being created.

1. memory: Data is temporarily stored in memory for the duration of a function call. After the function execution ends, data stored in memory is deleted.

2. storage: Data is permanently stored on the blockchain (persistent between function calls). This is used for state variables.
-----------------------------------------------------------------------------------------------------------------------------------------------------


The contract checks if auction.highestBidder is not equal to address(0), which means there has been at least one valid bid placed before this new bid. 
In Solidity, address(0) refers to the zero address, which is often used as a default value for unset or non-existent addresses. If the current highest bidder is address(0), it indicates that no one has placed a bid yet, so there’s no one to refund.
--------------------------------------------------------------------------------------------------------------------------------------------


in the Auction struct, the line address payable owner; declares that the owner field is of type address payable. Here’s what it means:

- address payable vs address
1. In Solidity, an address type represents a 20-byte value that stores an Ethereum address.
address payable is a specialized version of address that allows the address to receive Ether via methods like .transfer() and .send(). Only an address payable can be the recipient of a payment.

2.address payable is a specialized version of address that allows the address to receive Ether via methods like .transfer() and .send(). Only an address payable can be the recipient of a payment.

address payable owner means that the owner can not only store an Ethereum address but can also receive Ether transfers.
----------------------------------------------------------------------------------------------------------------------------------------------



In Solidity, mapping is like a key-value store, or a kind of dictionary. It allows you to associate one type of data (the key) with another type of data (the value).

Explanation of mapping:
Key: The input that you use to look something up (like an index).
Value: The output (or result) that you get when you provide the key.
The function of a mapping is to store and organize data, allowing you to quickly access specific information based on the key.

Mapping in your contract:
mapping(uint256 => Bid[]) public auctionBids;

This mapping links an auction's ID (uint256) (the key) to an array of bids (Bid[]) (the value).
It means each auction has its own list of bids, and you can look up an auction's bids using the auction's ID as the key.
Example: Auction ID 1 can have bids stored in auctionBids[1].
mapping(address => uint[]) public auctionOwner;

This mapping links an address (address) (the key, representing the owner) to an array of auction IDs (uint[]) (the value).
It means each user (represented by their address) owns a list of auctions, and you can find which auctions a user owns by looking them up using their address.
Example: Address 0x123 might own auctions 1, 2, 5, so auctionOwner[0x123] will return [1, 2, 5].
Simple analogy:
Think of mapping like a phonebook:

The name is the key (like an auction ID or address).
The phone number is the value (like the list of bids or auctions).
You can look up someone’s phone number (value) by their name (key), just like you can look up a list of bids by an auction ID.
