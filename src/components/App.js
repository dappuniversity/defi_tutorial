
import React, { Component } from 'react';
import Web3 from 'web3';
import DaiToken from '../abis/DaiToken.json';
import DappToken from '../abis/DappToken.json';
import TokenFarm from '../abis/TokenFarm.json';
import Navbar from './Navbar';
import Main from './Main';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '0x0',
      daiToken: null,
      dappToken: null,
      tokenFarm: null,
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    };
  }

  async componentWillMount() {
    await this.handleLoadWeb3();
    await this.handleLoadBlockchainData();
  }

  async handleLoadWeb3() {
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
      console.log('[handleLoadWeb3] error.message => ', error.message);
    }
  }

  async handleLoadBlockchainData() {
    try {
      const web3 = window.web3;

      const accounts = await web3.eth.getAccounts();
      this.setState({ account: accounts[0] });

      const networkId = await web3.eth.net.getId();

      // Load DaiToken
      const daiTokenData = DaiToken.networks[networkId];
      if(daiTokenData) {
        const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address);
        this.setState({ daiToken });
        const daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call();
        this.setState({ daiTokenBalance: daiTokenBalance.toString() });
      } else {
        window.alert('DaiToken contract not deployed to detected network.');
      }

      // Load DappToken
      const dappTokenData = DappToken.networks[networkId];
      if(dappTokenData) {
        const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address);
        this.setState({ dappToken });
        const dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call();
        this.setState({ dappTokenBalance: dappTokenBalance.toString() });
      } else {
        window.alert('DappToken contract not deployed to detected network.');
      }

      // Load TokenFarm
      const tokenFarmData = TokenFarm.networks[networkId];
      if(tokenFarmData) {
        const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address);
        this.setState({ tokenFarm });
        const stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call();
        this.setState({ stakingBalance: stakingBalance.toString() });
      } else {
        window.alert('TokenFarm contract not deployed to detected network.');
      }
    } catch (error) {
      console.log('[handleLoadBlockchainData] error.message => ', error.message);
    } finally {
      this.setState({ loading: false });
    }
  }

  handleStakeTokens = async amount => {
    try {
      this.setState({ loading: true });
      await this.state.daiToken.methods
        .approve(this.state.tokenFarm._address, amount)
        .send({ from: this.state.account });
      await this.state.tokenFarm.methods
        .stakeTokens(amount)
        .send({ from: this.state.account });

      this.handleDaiTokenDataChange();
      this.handleDappTokenDataChange();
      this.handleTokenFarmDataChange();
    } catch (error) {
      console.log('[handleStakeTokens] error.message => ', error.message);
    } finally {
      this.setState({ loading: false });
    }
  }

  unstakeTokens = amount => {
    this.setState({ loading: true });
    this.state.tokenFarm.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', hash => {
      this.setState({ loading: false });
    });
  }

  handleDaiTokenDataChange = async () => {
    try {
      const daiTokenBalance = await this.state.daiToken.methods.balanceOf(this.state.account).call();
      this.setState({ daiTokenBalance: daiTokenBalance.toString() });
    } catch (error) {
      console.log('[handleDaiTokenDataChange] error.message => ', error.message);
    }
  }

  handleDappTokenDataChange = async () => {
    try {
      const dappTokenBalance = await this.state.dappToken.methods.balanceOf(this.state.account).call();
      this.setState({ dappTokenBalance: dappTokenBalance.toString() });
    } catch (error) {
      console.log('[handleDappTokenDataChange] error.message => ', error.message);
    }
  }

  handleTokenFarmDataChange = async () => {
    try {
      const stakingBalance = await this.state.tokenFarm.methods.stakingBalance(this.state.account).call();
      this.setState({ stakingBalance: stakingBalance.toString() });
    } catch (error) {
      console.log('[handleTokenFarmDataChange] error.message => ', error.message);
    }
  }

  render() {
    let content;
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>;
    } else {
      content = (
        <Main
          daiTokenBalance={this.state.daiTokenBalance}
          dappTokenBalance={this.state.dappTokenBalance}
          stakingBalance={this.state.stakingBalance}
          stakeTokens={this.handleStakeTokens}
          unstakeTokens={this.unstakeTokens} />
      );
    }

    return (
      <div>
        <Navbar account={this.state.account} />
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
  }
}

export default App;
