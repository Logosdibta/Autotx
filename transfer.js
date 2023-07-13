// Bridge to access web3
const { ethers } = require("ethers");

// Network, transfer amount, Network's etherscan
const { RPC, ETH, ETHERSCAN } = require("./config");

// Private key object
const { keys } = require("./config");

// Connect to blockchain
const provider = new ethers.providers.JsonRpcProvider(RPC);

// Store all keys in an array
const keyArray = Object.entries(keys).map(([key, value]) => {
  return value;
});

// Create a wallet instance for every key
const accountWallets = keyArray.map(
  (privateKey) => new ethers.Wallet(privateKey, provider)
);

// Amount to transfer
const transferAmount = ethers.utils.parseEther(ETH);

// Transfer function
(async function () {
  try {
    console.log("== Starting Transaction ==");

    // Send ETH to every wallet in the array except for the sender
    for (let i = 1; i < accountWallets.length; i++) {
      // Create transaction
      const transaction = await accountWallets[0].sendTransaction({
        // For every wallet
        to: accountWallets[i].address,
        // And send specified amount
        value: transferAmount,
      });
      console.log(`Transfer ${i} Successful. Tx => [${transaction.hash}]`);
    }

    console.log(`== Transfers Complete! ==`);
    console.log(
      `See transactions at: ${ETHERSCAN}/address/${accountWallets[0].address}`
    );

    //Log errors to the terminal
  } catch (err) {
    console.error(err);
  }
})();
