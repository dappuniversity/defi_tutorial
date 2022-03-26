//put smart contracts on a blockchain
const DappToken = artifacts.require('DappToken');
const DaiToken = artifacts.require('DaiToken');
const Farm = artifacts.require('Farm');
const TokenFarm = artifacts.require('TokenFarm')

//q1: why async?
module.exports = async function(deployer, network, accounts) {
  
  //q2: what the fuck?
  //Deploy DAI token
  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()

  //Deploy Dapp token
  await deployer.deploy(DappToken)
  const dappToken = await DappToken.deployed()

  // //Deploy Farm
  // // take a look at farm contstructor which needs dapptoken and daitoken
  // await deployer.deploy(Farm, dappToken.address, daiToken.address)
  // const farm = await Farm.deployed();

  // // Transafer all tokens to Farm (1 milion)
  // await dappToken.transfer(farm.address,'1000000000000000000000000')

  // //Transfer 100 DAI tokens to investor
  // await daiToken.transfer(accounts[1],'100000000000000000000')

const TokenFarm = artifacts.require('TokenFarm')


  // Deploy TokenFarm
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
  const tokenFarm = await TokenFarm.deployed()

  // Transfer all tokens to TokenFarm (1 million)
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')

  // Transfer 100 Mock DAI tokens to investor
  await daiToken.transfer(accounts[1], '100000000000000000000')


}
