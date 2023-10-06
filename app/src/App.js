import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';
import escrowContractDefinition from './artifacts/contracts/Escrow.sol/Escrow.json';

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function getIsApproved() {
    const contractAddr = document.getElementById('contract-address').value;

    // https://ethereum.stackexchange.com/questions/120817/how-to-call-a-contract-function-method-using-ethersjs

    const ExistingEscrowContract = new ethers.Contract(
      contractAddr,
      escrowContractDefinition.abi,
      signer);
  
    const isApproved = await ExistingEscrowContract.isApproved();
    console.log(`response from getIsApproved`, isApproved);

    document.getElementById('isapproved').innerText = isApproved ? 'Approved!' : 'Not Approved or Failure!';
  }

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const value = ethers.utils.parseUnits(document.getElementById('eth').value, "ether");
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className =
            'complete';
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        await approve(escrowContract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
  }

  return (
    <>
    <div class='main-wrapper'>
      <div class='row'>
        <div class='column'>
          <div class='row'>
              <div className="contract">
                <h1> New Contract </h1>
                <label>
                  Arbiter Address
                  <input type="text" id="arbiter" />
                </label>

                <label>
                  Beneficiary Address
                  <input type="text" id="beneficiary" />
                </label>

                <label>
                  Deposit Amount (in GoerliETH)
                  <input type="text" id="eth" />
                </label>

                <div
                  className="button"
                  id="deploy"
                  onClick={(e) => {
                    e.preventDefault();
                    newContract();
                  }}
                >
                  Deploy
                </div>
              </div>
          </div>
          <div class='row'>
            <div className="contract">
              <h1> Get isApproved</h1>
                <label>
                  Contract Address
                  <input type="text" id="contract-address" />
                </label>
                <div
                  className="button"
                  id="isapproved"
                  onClick={(e) => {
                    e.preventDefault();
                    getIsApproved();
                  }}
                >
                  Do It
                </div>
            </div>
          </div>
        </div>
        <div class='column'>
          <div class='row'>
            <img class="real-estate" src="restate.png" alt="Real Estate" />
          </div>
          <div class='row'>
            <div className="existing-contracts">
              <h1> Existing Contracts </h1>

              <div id="container">
                {escrows.map((escrow) => {
                  return <Escrow key={escrow.address} {...escrow} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default App;
