// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GoArt is ERC721, Ownable {
    // Mapping to keep track of mint counts per address
    mapping(address => uint256) private _mintCount;

    constructor()
        ERC721("GoArt", "GRT")
        Ownable(msg.sender)
    {}

    // Updated safeMint function
    function safeMint(address to, uint256 tokenId) public {
        require(_mintCount[msg.sender] < 5, "Mint limit exceeded for this address");

        // If 'to' address is not provided, mint to the sender's address
        address recipient = to == address(0) ? msg.sender : to;

        _safeMint(recipient, tokenId);
        _mintCount[msg.sender]++;
    }
}
