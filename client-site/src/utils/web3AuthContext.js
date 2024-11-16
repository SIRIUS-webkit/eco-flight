import { createContext, useContext, useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";
import { ethers } from "ethers";
// import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import RPC from "./ethersRPC"; // Ensure this is the correct path

const clientId =
  "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // Replace with your actual Web3Auth client ID

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7", // Sepolia Testnet Chain ID
  rpcTarget: "https://rpc.sepolia.org",
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
};

const Web3AuthContext = createContext(null);

export const Web3AuthProvider = ({ children }) => {
  const [web3auth, setWeb3Auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [pushUser, setPushUser] = useState(null);

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        const res = await fetch("/api/session");
        const { loggedIn: serverLoggedIn } = await res.json();
        console.log(serverLoggedIn);
        setLoggedIn(serverLoggedIn);

        const web3authInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
          chainConfig,
          privateKeyProvider: new EthereumPrivateKeyProvider({
            config: { chainConfig },
          }),
        });

        const adapters = await getDefaultExternalAdapters({
          options: web3authInstance.options,
        });
        adapters.forEach((adapter) => {
          web3authInstance.configureAdapter(adapter);
        });

        await web3authInstance.initModal();
        setWeb3Auth(web3authInstance);

        if (web3authInstance.connected) {
          const ethersProvider = new ethers.providers.Web3Provider(
            web3authInstance.provider
          );

          const signer = ethersProvider.getSigner();
          const address = await signer.getAddress();

          setWalletAddress(address);
          localStorage.setItem("usrWallet", address);

          setProvider(ethersProvider);
          setLoggedIn(true);

          // Initialize Push Protocol after successful login
          // await initializePushProtocol(signer);
        }

        setInitialized(true);
      } catch (error) {
        console.error("Web3Auth Init error:", error);
        setInitialized(true);
      }
    };

    initWeb3Auth();
  }, []);

  //   const initializePushProtocol = async (signer) => {
  //     try {
  //       const user = await PushAPI.initialize(signer, {
  //         env: CONSTANTS.ENV.STAGING, // Use STAGING or PROD
  //       });
  //       console.log("Push Protocol User Initialized:", user);
  //       setPushUser(user);
  //     } catch (error) {
  //       if (error.response) {
  //         // The request was made, but the server responded with a status code
  //         console.error("Push Protocol API Response Error:", error.response.data);
  //       } else if (error.request) {
  //         // The request was made but no response was received
  //         console.error("Push Protocol No Response Error:", error.request);
  //       } else {
  //         // Something else caused the error
  //         console.error("Push Protocol Initialization Error:", error.message);
  //       }
  //     }
  //   };

  //   const sendPushNotification = async (title, body) => {
  //     if (!pushUser) {
  //       console.error("Push Protocol not initialized");
  //       return;
  //     }

  //     try {
  //       const response = await pushUser.channel.send(
  //         [`eip155:11155111:${walletAddress}`], // Sepolia chain ID with recipient
  //         {
  //           notification: {
  //             title,
  //             body,
  //           },
  //           data: {
  //             amsg: body, // Additional message
  //             asub: title, // Subject
  //             type: "1", // Type of notification
  //           },
  //         },
  //         {
  //           env: CONSTANTS.ENV.STAGING, // STAGING or PROD
  //         }
  //       );
  //       console.log("Notification sent:", response);
  //     } catch (error) {
  //       console.error("Error sending Push notification:", error);
  //     }
  //   };

  const login = async () => {
    if (!web3auth) return;
    try {
      const web3authProvider = await web3auth.connect();

      if (!web3authProvider) {
        throw new Error("Web3Auth provider is undefined after login.");
      }

      try {
        const ethersProvider = new ethers.providers.Web3Provider(
          web3authProvider
        );
        setProvider(ethersProvider);
        setLoggedIn(true);

        await fetch("/api/session", {
          method: "POST",
          body: JSON.stringify({ loggedIn: true }),
        });
      } catch (err) {
        console.error("Error wrapping provider in Web3Provider:", err);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    if (!web3auth) return;
    try {
      await web3auth.logout();
      setProvider(null);
      setLoggedIn(false);
      // clear session cookies
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getUserInfo = async () => {
    if (!web3auth) return;
    const userInfo = await web3auth.getUserInfo();
    console.log("User Info:", userInfo);
  };

  const getAccounts = async () => {
    if (!provider) return console.warn("Provider not initialized");
    console.log(provider);
    const accounts = await RPC.getAccounts(provider);
    console.log("Accounts:", accounts);
    return accounts;
  };

  const getBalance = async () => {
    if (!provider) return console.warn("Provider not initialized");
    const balance = await RPC.getBalance(provider);
    console.log("Balance:", balance);
    return balance;
  };

  const signMessage = async () => {
    if (!provider) return console.warn("Provider not initialized");
    const message = await RPC.signMessage(provider);
    console.log("Signed Message:", message);
  };

  const sendTransaction = async () => {
    if (!provider) return console.warn("Provider not initialized");
    const txReceipt = await RPC.sendTransaction(provider);
    console.log("Transaction Receipt:", txReceipt);
  };

  return (
    <Web3AuthContext.Provider
      value={{
        walletAddress,
        provider,
        initialized,
        login,
        logout,
        loggedIn,
        getUserInfo,
        getAccounts,
        getBalance,
        signMessage,
        sendTransaction,
        pushUser,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3Auth = () => useContext(Web3AuthContext);
