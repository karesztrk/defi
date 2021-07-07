import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Web3 from 'web3';
import DaiToken from '../abis/DaiToken.json';
import DappToken from '../abis/DappToken.json';
import TokenFarm from '../abis/TokenFarm.json';
import Main from './Main';
import './App.css';

const App = () => {
  const [account, setAccount] = useState();
  const [daiToken, setDaiToken] = useState({});
  const [dappToken, setDappToken] = useState({});
  const [tokenFarm, setTokenFarm] = useState({});
  const [daiTokenBalance, setDaiTokenBalance] = useState();
  const [dappTokenBalance, setDappTokenBalance] = useState();
  const [stakingBalance, setStakingBalance] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (account) {
      loadBlockChainData();
    }
  }, [account]);
  const init = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      alert('Non-Ethereum compatible browser');
    }
    const { web3 } = window;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
  };

  const loadBlockChainData = async () => {
    const { web3 } = window;
    const networkId = await web3.eth.net.getId();
    const daiTokenData = DaiToken.networks[networkId];
    if (daiTokenData) {
      const daiToken = new web3.eth.Contract(
        DaiToken.abi,
        daiTokenData.address,
      );
      setDaiToken(daiToken);
      const daiTokenBalance = await daiToken.methods.balanceOf(account).call();
      setDaiTokenBalance(daiTokenBalance.toString());
    } else {
      alert('DaiToken contract not deployed on the network');
    }

    const dappTokenData = DappToken.networks[networkId];
    if (dappTokenData) {
      const dappToken = new web3.eth.Contract(
        DappToken.abi,
        dappTokenData.address,
      );
      setDappToken(dappToken);
      const dappTokenBalance = await dappToken.methods
        .balanceOf(account)
        .call();
      setDappTokenBalance(dappTokenBalance.toString());
    } else {
      alert('DappToken contract not deployed on the network');
    }

    const tokenFarmData = TokenFarm.networks[networkId];
    if (tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(
        TokenFarm.abi,
        tokenFarmData.address,
      );
      setTokenFarm(tokenFarm);
      const balance = await tokenFarm.methods.stakingBalance(account).call();
      setStakingBalance(balance.toString());
    } else {
      alert('TokenFarm contract not deployed on the network');
    }

    setLoading(false);
  };

  const stakeTokens = (amount) => {
    setLoading(true);
    daiToken.methods
      .approve(tokenFarm._address, amount)
      .send({ from: account })
      .on('transactionHash', (hash) => {
        tokenFarm.methods
          .stakeTokens(amount)
          .send({ from: account })
          .on('transactionHash', (hash) => {
            setLoading(false);
          });
      });
  };

  const unstakeTokens = (amount) => {
    setLoading(true);
    tokenFarm.methods
      .unstakeTokens()
      .send({ from: account })
      .on('transactionHash', (hash) => {
        setLoading(false);
      });
  };

  return loading ? (
    <p id='loader' className='text-center'>
      Loading...
    </p>
  ) : (
    <div>
      <Navbar account={account} />
      <div className='container-fluid mt-5'>
        <div className='row'>
          <main
            role='main'
            className='col-lg-12 ml-auto mr-auto'
            style={{ maxWidth: '600px' }}
          >
            <div className='content mr-auto ml-auto'>
              <a
                href='http://www.dappuniversity.com/bootcamp'
                target='_blank'
                rel='noopener noreferrer'
              ></a>
              <Main
                daiTokenBalance={daiTokenBalance}
                dappTokenBalance={dappTokenBalance}
                stakingBalance={stakingBalance}
                stakeTokens={stakeTokens}
                unstakeTokens={unstakeTokens}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
