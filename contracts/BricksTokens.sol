// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract BrickToken is ERC20, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter userId;

    constructor() ERC20("Bricks Token", "BKS") {
        maxSupply = 10000;
        allowUser(msg.sender, bytes32(""));
    }

    uint256 maxSupply;


    struct users{
        uint256 userId;
        address userAddress;
        bytes32 metadataHash;
    }

    mapping(address => users) public allowedUsers;
    mapping(uint256 => address) public userById;

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    

    function allowUser(address _user, bytes32 _metaData) onlyOwner public returns(uint256)  {
        userId.increment();
        allowedUsers[_user] = users(userId.current(), _user, _metaData);
        userById[userId.current()] = _user;
        return userId.current();
    }

    function getUserById(uint256 _userId) public view returns(address){
        return userById[_userId];
    }

    function getUserId(address _userAddress) public view returns(uint256){
        return(allowedUsers[_userAddress].userId);
    }

    function getUserMetadata(address _userAddress) public view returns(bytes32){
        return(allowedUsers[_userAddress].metadataHash);
    }

    function maxUserId() public view returns(uint256){
        return userId.current();
    }

    function _beforeTokenTransfer(address from,address to,uint256 amount) internal virtual override{
        if(owner() == to || owner() == from ){return;}
        else{            
            require(from == allowedUsers[to].userAddress, "From is not allowed");
            require(to == allowedUsers[to].userAddress, "To is not allowed");
        }
    }
}
