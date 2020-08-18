const TokenFarm = artifacts.require('TokenFarm')

module.exports = function(deployer) {
  deployer.deploy(TokenFarm)
}
