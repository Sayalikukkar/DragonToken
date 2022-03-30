import './App.css';
import ERC20abi from './ERC20abi.json';
import { ethers } from "ethers";
import { useState, useEffect } from 'react';
// import fetchData from './fetchData';
import fetchData from './fetchData';

function App() {

  const [txs, setTxs] = useState([]);
  const [contractListened, setContractListened] = useState();
  const [contractInfo, setContractInfo] = useState({
    address: "-",
    tokenName: "-",
    tokenSymbol: "-"
  });

  useEffect(() => {
    if (contractInfo.address !== "-") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const ERC20 = new ethers.Contract(
        contractInfo.address,
        ERC20abi,
        provider
      );

      ERC20.on("Transfer", (from, to, amount, event) => {
        console.log({ from, to, amount, event });

        setTxs((currentTxs) => [
          ...currentTxs,
          {
            txHash: event.transactionHash,
            from,
            to,
            amount: String(amount)
          }
        ]);
      });
      setContractListened(ERC20);

      return () => {
        contractListened.removeAllListeners();
      };
    }
  }, [contractInfo.address]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("hello")
    const data = new FormData(e.target);
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const ERC20 = new ethers.Contract(data.get("addr"), ERC20abi, provider);

    const tokenName = await ERC20.name();
    const tokenSymbol = await ERC20.symbol();

    setContractInfo({
      address: data.get("addr"),
      tokenName,
      tokenSymbol
    });
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(contractInfo.address, ERC20abi, signer);
    await erc20.transfer(data.get("recipient"), data.get("amount"));
  };
  return (
    <div className="container">
      <form className="m-4" onSubmit={handleSubmit}>
        <div className="card">
          <main className="mt-4 p-4">
            <h2 className="text-center">
              Fetching Name and Symbol from Contract
            </h2>
            <div className="">
              <div className="my-3">
                <input
                  type="text"
                  name="addr"
                  className="form-control"
                  placeholder="ERC20 contract address"
                />
              </div>
            </div>
          </main>
          <footer className="p-4 text-center d-grid">
            <button
              type="submit"
              className="btn btn-secondary btn-lg"
            >
              Get token info
            </button>
          </footer>
          <div className="px-4">
            <div className="overflow-x-auto">
              <table className="table text-center">
                <thead>
                  <tr>
                    <th>Token Name</th>
                    <th>Token Symbol</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>{contractInfo.tokenName}</th>
                    <td>{contractInfo.tokenSymbol}</td>
                    <td>{contractInfo.deployedAt}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </form>

      <form className="m-4" onSubmit={handleTransfer}>
        <div className="card">
          <main className="mt-4 p-4">
            <h2 className="text-center">
              Send Tokens to Entered Address
            </h2>
            <div className="">
              <div className="my-3">
                <input
                  type="text"
                  name="recipient"
                  className="form-control"
                  placeholder="Recipient address"
                />
              </div>
              <div className="my-3">
                <input
                  type="text"
                  name="amount"
                  className="form-control"
                  placeholder="Amount to transfer"
                />
              </div>
            </div>
          </main>
          <footer className="p-4 text-center d-grid">
            <button
              type="submit"
              className="btn btn-secondary btn-lg"
            >
              Transfer
            </button>
          </footer>
        </div>
      </form>

      <form className="m-4">
        <div className="card">
          <main className="mt-4 p-4">
            <h2 className="text-center">
              Transaction History
            </h2>
            <p>
              <fetchData txs={txs} />
            </p>
          </main>
        </div>
      </form>

    </div>
  );
}

export default App;
