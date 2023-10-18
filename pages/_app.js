import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import '../styles/global.css'

const WalletInfo = () => {

  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [chainName, setChainName] = useState('');

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);

          const networkId = await web3.eth.net.getId();
          const networkIdHex = web3.utils.toHex(networkId);

          const networkData = web3.utils.hexToNumber(networkIdHex);

          switch (networkData) {
            case 1:
              setChainName('Ethereum Mainnet');
              break;
            case 3:
              setChainName('Ropsten Testnet');
              break;
            case 4:
              setChainName('Rinkeby Testnet');
              break;
            case 42:
              setChainName('Kovan Testnet');
              break;
            default:
              setChainName('Unknown Network');
          }

          const balance = await web3.eth.getBalance(accounts[0]);
          setBalance(web3.utils.fromWei(balance, 'ether'));
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log('Web3 not detected. Please install a Web3-enabled browser.');
        setAccount(''); 
        window.alert('MetaMask is not connected. Please connect your wallet.');
      }
    };

    loadWeb3();
  }, []);

  const connectWallet = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
      window.alert('Failed to connect to MetaMask. Please check your MetaMask setup.');
    }
  };

  return (
    <div className="wallet-info-container">
      <h1 className='title'>MetaMask Info</h1>
      {account ? (
        <div>
          <div className="info-box">
            <p className="info-label">Wallet Address:</p>
            <p className="info-value">{account}</p>
          </div>
          <div className="info-box">
            <p className="info-label">Balance:</p>
            <p className="info-value">{balance} ETH</p>
          </div>
          <div className="info-box">
            <p className="info-label">Chain Name:</p>
            <p className="info-value">{chainName}</p>
          </div>
        </div>
      ) : (
        <div>
          <p>Connect your wallet to view your account information.</p>
          <button className="connect-button" onClick={connectWallet}>Connect Wallet</button>
        </div>
      )}
    </div>

  );
};

export default WalletInfo;






