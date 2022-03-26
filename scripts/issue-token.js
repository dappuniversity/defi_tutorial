const Farm = artifacts.require('Farm')

module.exports = async function(callback) {
  let tokenFarm = await Farm.deployed()
  await tokenFarm.issueTokens()
  // Code goes here...
  console.log("Tokens issued!")
  callback()
}
