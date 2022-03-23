//put smart contracts on a blockchain
const Farm = artifacts.require('Farm');

module.exports = function(deployer) {
  deployer.deploy(Farm);
};
