pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm is DappToken {
    //All code goes here...
    string public name = "Royalhit Token Bank";
    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;


    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;  

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    //1. Stake Tokens (Deposit)
    function stakeTokens(uint _amount) public {
        //Code goes inside here....
        //Require amount greater than 0 and
        require(_amount > 0, "amount cannot be 0");

        //Transfer Mock Dai tokens to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        //Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        //Add user to stakers array *only if they haven't staked already
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        //Update staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    //2. Unstaking tokens (Withdraw)

    function unstakeTokens() public {
        //Fetch staking balance
        uint balance = stakingBalance[msg.sender]; 

        //Require amount greater than 0
        require(balance > 0, "staking balance cannot be 0");

        //Transfer mock Dai tokens to this contract for stakingBalance
        daiToken.transfer(msg.sender, balance);

        //Reset staking balance
        stakingBalance[msg.sender] = 0;

        //Update staking statuses
        isStaking[msg.sender] = false;
    }

    //3. Issuing Tokens 

    function issueTokens() public {
        //Only owner can call this function.
        require(msg.sender == owner, "caller must be the owner");

        for (uint i=0; i<stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }

    function proposeTokens() public {
        //Only owner can call this function.
        require(msg.sender == owner, "caller must be the owner");

        for (uint i=0; i<stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }

}


