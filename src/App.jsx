import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Wallet from './artifacts/contracts/wallet.sol/Wallet.json'
import './App.css';


let WalletAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
function App() {

  const [balance, setBalance] = useState(0);
  const [amountSend, setAmountSend] = useState();
  const [amountWithdraw, setAmountWithdraw] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getBalance();
  }, [])


  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(WalletAddress, Wallet.abi, provider);

      try {
        let overrides = {
          from: accounts[0]
        }

        const data = await contract.getBalance(overrides);
        setBalance(String(data));

      } catch (err) {
        setError("An Error Occured bro");
      }
    }
  }



  async function transfer() {
    if (!amountSend) {
      return;
    }
    setError('');
    setSuccess('');

    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      try {
        const tx = {
          from: accounts[0],
          to: WalletAddress,
          value: ethers.utils.parseEther(amountSend)
        }
        const transaction = await signer.sendTransaction(tx);
        await transaction.wait();
        setAmountSend('');
        getBalance('');
        setSuccess('Your ETH has been transfered to the Wallet');

      } catch (err) {
        setError("An Error Occured bro");
      }
    }
  }


  async function withdraw() {
    if (!amountWithdraw) {
      return;
    }
    setError('');
    setSuccess('');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(WalletAddress, Wallet.abi, signer);
    try {

      const transaction = await contract.withdraw(accounts[0], ethers.utils.parseEther(amountWithdraw));
      await transaction.wait();
      setAmountWithdraw('');
      getBalance();
      setSuccess('Your withdraw succeed bro')

    } catch (err) {
      setError("An Error Occured bro");
    }
  }


  function changeAmountSend(e) {
    setAmountSend(e.target.value);
  }

  function changeAmountWithdraw(e) {
    setAmountWithdraw(e.target.value);
  }



  return (
    <div className="App">
    
      <div className='container'>
        <h1 className='firstTitle'>Your Ethereum Wallet</h1>
        <div className='logo'>
        <i class="fa-brands fa-ethereum"></i>
        </div>
        {error && <p className='error'>{error}</p>}
        {success && <p className='success'>{success}</p>}

        <h1>You currently have : {balance / 10 ** 18} <span className='eth'>ETH</span></h1>
        <div className='wallet__flex'>

          <div className='walletLeft'>
            <h2>Deposit Ethereum</h2>
            <input type="text" placeholder='Amount to send' onChange={changeAmountSend} />
            <button onClick={transfer}>Deposit</button>
          </div>

          <div className='walletRight'>
            <h2>Withdraw Ethereum</h2>
            <input type="text" placeholder='Amount to withdraw' onChange={changeAmountWithdraw} />
            <button onClick={withdraw}> Withdraw</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
