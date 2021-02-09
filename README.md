
# DeFi Demo

DApp developed using the following tech stacks:

- React.js (CRA)
- Smart Contracts (Solidity)
- Truffle
- Ganache
- Web3.js
- Automated Tests using Mocha and Chai


## Quick setup and running

- Install node in the local (Node version is v12.18.3 and if possible, use the same version for compatibility).
- Download Ganache from https://www.trufflesuite.com/ganache and install it in the local.
- Run Ganache in the local.

``` bash
$ npm install --g truffle@5.1.39 # If possible, use the same version for compatibility

$ npm install # Or yarn install
$ npm run truffle-compile # Compile smart contracts
$ npm run truffle-migrate # (Or npm run truffle-migrate-reset) Deploy the compiled smart contracts
$ npm run truffle-test # Run the automated tests to make sure of the behaviors of the smart contracts
$ npm start # Run the UI website

$ npm run truffle-issue-dapp-tokens # Issue Dapp tokens to the stakers
```
