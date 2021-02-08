
import React from 'react';
import Web3 from 'web3';

import DaiToken from '../built-contracts/DaiToken.json';
import DappToken from '../built-contracts/DappToken.json';
import TokenFarm from '../built-contracts/TokenFarm.json';
import Navbar from './Navbar';
import Main from './Main';
import './App.css';

const loadWeb3 = async () => {
  try {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  } catch (error) {
    console.log('[loadWeb3] error.message => ', error.message);
  }
};

const App = () => {
  const [account, setAccount] = React.useState('0x0');

  const [daiToken, setDaiToken] = React.useState(null);
  const [dappToken, setDappToken] = React.useState(null);
  const [tokenFarm, setTokenFarm] = React.useState(null);

  const [daiTokenBalance, setDaiTokenBalance] = React.useState('0');
  const [dappTokenBalance, setDappTokenBalance] = React.useState('0');
  const [stakingBalance, setStakingBalance] = React.useState('0');

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      await loadWeb3();
      await handleLoadBlockchainData();
    })();
  }, []);

  const handleLoadBlockchainData = async () => {
    try {
      const web3 = window.web3;

      const accounts = await web3.eth.getAccounts();
      const firstAccount = accounts[0];
      setAccount(firstAccount);

      const networkId = await web3.eth.net.getId();

      // Load DaiToken
      const daiTokenData = DaiToken.networks[networkId];
      if(daiTokenData) {
        const theDaiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address);
        setDaiToken(theDaiToken);
        const theDaiTokenBalance = await theDaiToken.methods.balanceOf(firstAccount).call();
        setDaiTokenBalance(theDaiTokenBalance.toString());
      } else {
        window.alert('DaiToken contract not deployed to detected network.');
      }

      // Load DappToken
      const dappTokenData = DappToken.networks[networkId];
      if(dappTokenData) {
        const theDappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address);
        setDappToken(theDappToken);
        const theDappTokenBalance = await theDappToken.methods.balanceOf(firstAccount).call();
        setDappTokenBalance(theDappTokenBalance);
      } else {
        window.alert('DappToken contract not deployed to detected network.');
      }

      // Load TokenFarm
      const tokenFarmData = TokenFarm.networks[networkId];
      if(tokenFarmData) {
        const theTokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address);
        setTokenFarm(theTokenFarm);
        const theStakingBalance = await theTokenFarm.methods.stakingBalance(firstAccount).call();
        setStakingBalance(theStakingBalance);
      } else {
        window.alert('TokenFarm contract not deployed to detected network.');
      }
    } catch (error) {
      console.log('[handleLoadBlockchainData] error.message => ', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStakeTokens = async amount => {
    try {
      setLoading(true);
      await daiToken.methods
        .approve(tokenFarm._address, amount)
        .send({ from: account });
      await tokenFarm.methods
        .stakeTokens(amount)
        .send({ from: account });

      handleDaiTokenDataChange();
      handleDappTokenDataChange();
      handleTokenFarmDataChange();
    } catch (error) {
      console.log('[handleStakeTokens] error.message => ', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnstakeTokens = async () => {
    try {
      setLoading(true);
      await tokenFarm.methods
        .unstakeTokens()
        .send({ from: account });
      
      handleDaiTokenDataChange();
      handleDappTokenDataChange();
      handleTokenFarmDataChange();
    } catch (error) {
      console.log('[handleUnstakeTokens] error.message => ', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDaiTokenDataChange = async () => {
    try {
      const theDaiTokenBalance = await daiToken.methods.balanceOf(account).call();
      setDaiTokenBalance(theDaiTokenBalance.toString());
    } catch (error) {
      console.log('[handleDaiTokenDataChange] error.message => ', error.message);
    }
  };

  const handleDappTokenDataChange = async () => {
    try {
      const theDappTokenBalance = await dappToken.methods.balanceOf(account).call();
      setDappTokenBalance(theDappTokenBalance.toString());
    } catch (error) {
      console.log('[handleDappTokenDataChange] error.message => ', error.message);
    }
  };

  const handleTokenFarmDataChange = async () => {
    try {
      const theStakingBalance = await tokenFarm.methods.stakingBalance(account).call();
      setStakingBalance(theStakingBalance.toString());
    } catch (error) {
      console.log('[handleTokenFarmDataChange] error.message => ', error.message);
    }
  };

  let content;
  if(loading) {
    content = <p id="loader" className="text-center">Loading...</p>;
  } else {
    content = (
      <Main
        daiTokenBalance={daiTokenBalance}
        dappTokenBalance={dappTokenBalance}
        stakingBalance={stakingBalance}
        stakeTokens={handleStakeTokens}
        unstakeTokens={handleUnstakeTokens} />
    );
  }

  return (
    <div>
      <Navbar account={account} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
            <div className="content mr-auto ml-auto">
              <a
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer">
              </a>
              {content}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
