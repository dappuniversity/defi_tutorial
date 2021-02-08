
const TokenFarm = artifacts.require('TokenFarm');

module.exports = async function(callback) {
  const tokenFarm = await TokenFarm.deployed();
  await tokenFarm.issueDappTokens();
  // Code goes here...
  console.log('Tokens issued!');
  callback();
};
