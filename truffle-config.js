
require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    // Connection to Ganache
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*' // Match any network id
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/built-contracts/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: 'petersburg'
    }
  }
};
