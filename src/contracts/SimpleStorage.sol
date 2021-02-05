pragma solidity ^0.5.0;

contract SimpleStorage {
    string ipfsHash;

    function set(uint x) public {
        ipfsHash = x;
    }
    
    function get() public view retunrs (uint) {
        return ipfsHash;
    }
}