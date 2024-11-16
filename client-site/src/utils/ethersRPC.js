/* eslint-disable @typescript-eslint/no-explicit-any */

import { ethers } from "ethers";

const getChainId = async (provider) => {
  try {
    const ethersProvider = new ethers.providers.Web3Provider(provider); // Corrected provider instantiation
    // Get the connected Chain's ID
    const networkDetails = await ethersProvider.getNetwork();
    return networkDetails.chainId.toString();
  } catch (error) {
    console.error("Error getting chain ID:", error);
    return error;
  }
};

const getAccounts = async (provider) => {
  try {
    if (!provider) throw new Error("Provider is not defined");

    const signer = provider.getSigner();

    // Check if signer is connected by trying to get the address
    const address = await signer.getAddress();
    console.log("Signer Address:", address);

    return address;
  } catch (error) {
    console.error("Error in getAccounts function:", error);
    throw error;
  }
};

const getBalance = async (provider) => {
  try {
    const signer = provider.getSigner();

    // Get user's Ethereum public address
    const address = await signer.getAddress();

    // Get user's balance in ether
    const balance = ethers.utils.formatEther(
      await provider.getBalance(address) // Balance is in wei
    );

    return balance;
  } catch (error) {
    console.error("Error getting balance:", error);
    return error;
  }
};

const sendTransaction = async (provider) => {
  try {
    const ethersProvider = new ethers.providers.Web3Provider(provider); // Corrected provider instantiation
    const signer = ethersProvider.getSigner();

    const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56"; // Replace with the actual destination address

    const amount = ethers.utils.parseEther("0.001");
    const fees = await ethersProvider.getFeeData();

    // Submit transaction to the blockchain
    const tx = await signer.sendTransaction({
      to: destination,
      value: amount,
      maxPriorityFeePerGas: fees.maxPriorityFeePerGas, // Max priority fee per gas
      maxFeePerGas: fees.maxFeePerGas, // Max fee per gas
    });

    // Wait for transaction to be mined
    const receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.error("Error sending transaction:", error);
    return error;
  }
};

const signMessage = async (provider) => {
  try {
    const ethersProvider = new ethers.providers.Web3Provider(provider); // Corrected provider instantiation
    const signer = ethersProvider.getSigner();
    const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const signedMessage = await signer.signMessage(originalMessage);

    return signedMessage;
  } catch (error) {
    console.error("Error signing message:", error);
    return error;
  }
};

export default {
  getChainId,
  getAccounts,
  getBalance,
  sendTransaction,
  signMessage,
};
