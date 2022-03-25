pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract Farm {
    string public name = "Dapp Token Farm"; //state var
    DappToken public dappToken; // we need to save these to state var, as we want to use them on other functions
    DaiToken public daiToken;

    address public owner;

    address[] public stakers; //to keep track of stakers
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking; //current staking status?!

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // stake tokens (when client wants to deposit DAI smart contract
    // and we want to transfer it to Farm contact
    // by calling transferFrom contract allows to move the funds on behalf of 
    // the investor
    function stakeTokens(uint _amount) public {
        
        //if the condition is wrong, the contract will break with an exception
        require(_amount > 0, 'amount should be greater than 0');

        // Transfer Mock Dai tokens to this contract for staking 
        daiToken.transferFrom(msg.sender, address(this), _amount);

        //update the staking balance
        //q: mage msg sender kasi nist k dare in amount ro enteghal mide?
        // pas amount bayad azash kam she k?
        //asnwer: engar k taraf ye address too in farm e dare, 
        //in msg sender hamoon address ast. yani be in addressesh deposit mishe
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // add user to stakers only if they havent staked already
        if (!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        //update stake status
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;

    }

    //issuing token
    function issueTokens() public{
        
        // Only owner can call this function
        require(msg.sender == owner, "caller must be owner");

        // Issue tokens to all stakers
        for (uint i=0;i< stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if (balance >0 ) dappToken.transfer(recipient, balance);
        }
    }

    //unstaking token (withdrawal)
    function unstakeTokens() public {
        // Fetch staking balance
        uint balance = stakingBalance[msg.sender];

        // Require amount greater than 0
        require(balance > 0, "staking balance cannot be 0");

        // Transfer Mock Dai tokens to this contract for staking
        daiToken.transfer(msg.sender, balance);

        // Reset staking balance
        stakingBalance[msg.sender] = 0;

        // Update staking status
        isStaking[msg.sender] = false;
    }
}
