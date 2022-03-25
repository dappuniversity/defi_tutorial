const { assert } = require('chai');

const DaiToken = artifacts.require('DaiToken')
const DappToken = artifacts.require('DappToken')
const Farm = artifacts.require('Farm')

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('Farm', ([owner, investor]) => {
  let daiToken, dappToken, farm

  before(async () => {
    // Load Contracts
    daiToken = await DaiToken.new()
    dappToken = await DappToken.new()
    farm = await Farm.new(dappToken.address, daiToken.address)

    // Transfer all Dapp tokens to farm (1 million)
    await dappToken.transfer(farm.address, tokens('1000000'))

    // Send tokens to investor
    await daiToken.transfer(investor, tokens('100'), { from: owner })
  })

  describe('Mock DAI deployment', async () => {
    it('has a name', async () => {
      const name = await daiToken.name()
      assert.equal(name, 'Mock DAI Token')
    })
  })

  describe('Dapp Token deployment', async () => {
    it('has a name', async () => {
      const name = await dappToken.name()
      assert.equal(name, 'DApp Token')
    })
  })

  describe('Token Farm deployment', async () => {
    it('has a name', async () => {
      const name = await farm.name()
      assert.equal(name, 'Dapp Token Farm')
    })

    it('contract has tokens', async () => {
      let balance = await dappToken.balanceOf(farm.address)
      assert.equal(balance.toString(), tokens('1000000'))
    })
  })

  describe('Farming tokens', async () => {

    it('rewards investors for staking mDai tokens', async () => {
      let result

      console.log("investor-> "+ investor+ "\nowner-> "+ owner + 
      "\nfarm adress-> "+ farm.address+
      "\nDAI smart contract->"+daiToken.address)

      // Check investor balance before staking
      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking')

      // Stake Mock DAI Tokens
        //we need to call approve function from DAI token, to tell DAI token
        //that FARM smart contract is allowed to spend token on its behafe
        //basically the aprrove is saying, farm contract can spend 2 tokens
      await daiToken.approve(farm.address,tokens('2'),{ from: investor})
      await farm.stakeTokens(tokens('2'),{from: investor})
    //check staking result    
      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('98'),'investor Mock DAI wallet balance correct after staking')

      result = await daiToken.balanceOf(farm.address)
      assert.equal(result.toString(), tokens('2'), 'Token Farm Mock DAI balance correct after staking')

      result = await farm.stakingBalance(investor)
      assert.equal(result.toString(), tokens('2'), 'investor staking balance correct after staking')

      result = await farm.isStaking(investor)
      assert.equal(result.toString(), 'true', 'investor staking status correct after staking')



      // Issue Tokens
      await farm.issueTokens({from: owner})
      // Check balances after issuance
      result = await dappToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('2'),'investor DApp Token wallet balance correct affter issuance')  
      // Ensure that only onwer can issue tokens
      await farm.issueTokens({ from: investor }).should.be.rejected;


    //Unstake token
    await farm.unstakeTokens({from: investor})
    result = await daiToken.balanceOf(investor)    

    //Check results after unstaking
      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct after staking')

      result = await daiToken.balanceOf(farm.address)
      assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after staking')

      result = await farm.stakingBalance(investor)
      assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking')

      result = await farm.isStaking(investor)
      assert.equal(result.toString(), 'false', 'investor staking status correct after staking')
    })
  })

})
