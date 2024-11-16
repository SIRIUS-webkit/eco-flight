"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ethers, Contract } from "ethers";
import EcoToken from "../../../../../contract/artifacts/contracts/EcoToken.sol/EcoToken.json";
import { usePathname } from "next/navigation";
import { useWeb3Auth } from "@/utils/Web3AuthContext";
import MaxWrapper from "@/components/common/MaxWrapper";
import { classNames } from "@/utils/common";

const EcoTokenAddress = process.env.NEXT_PUBLIC_ECOTOKEN_ADDRESS;

const AccountPage: React.FC = () => {
  const [ethBalance, setEthBalance] = useState<string>("0");
  const [ecoBalance, setEcoBalance] = useState<string>("0");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [stakeDetails, setStakeDetails] = useState<{
    amount: ethers.BigNumber;
  } | null>(null);
  const [reward, setReward] = useState<string>("0");
  const [ecoTokenContract, setEcoTokenContract] = useState<Contract | null>(
    null
  );
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const { provider, loggedIn, initialized }: any = useWeb3Auth();
  const [errMsg, setErrMsg] = useState("");
  const [pageLoading, setPageLoading] = useState<boolean>(false);

  const pathname = usePathname();

  const tabs = [
    { label: "Account", path: "/my-account" },
    { label: "Donation", path: "/my-donation" },
    { label: "My Projects", path: "/my-project" },
    { label: "My Emission", path: "/my-emission" },
  ];

  useEffect(() => {
    if (!initialized || !provider || !loggedIn || !EcoTokenAddress) return;

    const initializeContract = async () => {
      try {
        setPageLoading(true);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          EcoTokenAddress,
          EcoToken.abi,
          signer
        );
        setEcoTokenContract(contract);

        const signerAddress = await signer.getAddress();
        const ethBalance = await provider.getBalance(signerAddress);
        const ecoBalance = await contract.balanceOf(signerAddress);

        setWalletAddress(signerAddress);
        setEthBalance(ethers.utils.formatEther(ethBalance));
        setEcoBalance(ethers.utils.formatEther(ecoBalance));

        const stake = await contract.stakes(signerAddress);
        setStakeDetails(stake.amount.gt(0) ? stake : null);

        const reward = await contract.calculateReward(signerAddress);
        setReward(ethers.utils.formatEther(reward));
        setPageLoading(false);
      } catch (error) {
        setPageLoading(false);
        console.error("Error initializing contract:", error);
      }
    };

    initializeContract();
  }, [provider, loggedIn, initialized]);

  const handleStake = async () => {
    try {
      if (!ecoTokenContract || !stakeAmount) {
        setErrMsg("Please enter a valid stake amount.");
        return;
      }

      // Convert the stake amount to Wei
      const stakeAmountWei = ethers.utils.parseEther(stakeAmount);

      // Fetch the user's ECO token balance
      const signerAddress = await provider.getSigner().getAddress();
      const ecoBalanceWei = await ecoTokenContract.balanceOf(signerAddress);

      // Check if the user has sufficient balance
      if (stakeAmountWei.gt(ecoBalanceWei)) {
        setErrMsg(
          "Insufficient balance. Please enter an amount within your balance."
        );
        return;
      }

      // Perform the staking transaction
      const tx = await ecoTokenContract.stakeTokens(stakeAmountWei);
      await tx.wait();
      alert("Successfully staked!");
      fetchBalanceAndStakeDetails();
    } catch (error) {
      console.error("Stake failed:", error);
    }
  };

  const handleUnstake = async () => {
    try {
      if (!ecoTokenContract) return;
      const tx = await ecoTokenContract.unstakeTokens();
      await tx.wait();
      alert("Successfully unstaked!");
      fetchBalanceAndStakeDetails();
    } catch (error) {
      console.error("Unstake failed:", error);
    }
  };

  const fetchBalanceAndStakeDetails = async () => {
    try {
      if (!ecoTokenContract || !provider) return;
      const signerAddress = await provider.getSigner().getAddress();
      const ecoBalance = await ecoTokenContract.balanceOf(signerAddress);

      setEcoBalance(ethers.utils.formatEther(ecoBalance));

      const stake = await ecoTokenContract.stakes(signerAddress);
      setStakeDetails(stake.amount.gt(0) ? stake : null);

      const reward = await ecoTokenContract.calculateReward(signerAddress);
      setReward(ethers.utils.formatEther(reward));
    } catch (error) {
      console.error("Error fetching balance and stake details:", error);
    }
  };

  return (
    <MaxWrapper>
      <div className="flex justify-center items-center py-10">
        <div className="tabs tabs-boxed w-1/2 bg-[#d5f5e3]">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              href={tab.path}
              className={`tab ${pathname === tab.path ? "tab-active" : ""}`}
            >
              <p
                className={classNames(
                  pathname === tab.path ? "text-white" : "text-baack",
                  "p2"
                )}
              >
                {" "}
                {tab.label}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {pageLoading ? (
        <div>
          <div className="py-10">
            <div className="flex flex-col gap-4">
              <div className="skeleton h-8 w-1/2"></div>
              <div className="skeleton h-8 w-1/4"></div>
              <div className="skeleton h-32 w-full"></div>
              <div className="skeleton h-8 w-1/3"></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {" "}
          {loggedIn ? (
            <div className="overflow-x-auto mb-10">
              <h4 className="font-semibold mb-4">Personal Information</h4>
              <table className="table w-full border">
                <tbody>
                  <tr>
                    <td className="font-bold p2">Wallet ID</td>
                    <td className="p2">{walletAddress || "-"}</td>
                  </tr>
                  <tr>
                    <td className="font-bold p2">Wallet Balance (ETH)</td>
                    <td className="p2">{ethBalance} ETH</td>
                  </tr>
                  <tr>
                    <td className="font-bold p2">ECO Token Balance</td>
                    <td className="p2">{ecoBalance} ECO</td>
                  </tr>
                  <tr>
                    <td className="font-bold p2">Staked Amount</td>
                    <td className="p2">
                      {stakeDetails
                        ? `${ethers.utils.formatEther(stakeDetails.amount)} ECO`
                        : "0"}
                      {stakeDetails && (
                        <button
                          className="btn btn-primary mt-4 ml-4 text-white"
                          onClick={handleUnstake}
                        >
                          Unstake & Claim Rewards
                        </button>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold p2">Reward</td>
                    <td className="p2">{reward} ECO</td>
                  </tr>
                  {!stakeDetails && (
                    <tr>
                      <td className="font-bold p2">Enter Stake Amount (ECO)</td>
                      <td>
                        <input
                          type="number"
                          value={stakeAmount}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (parseFloat(value) < 0) {
                              setErrMsg("Stake amount cannot be negative.");
                            } else {
                              setErrMsg("");
                              setStakeAmount(value);
                            }
                          }}
                          className="input input-bordered w-full max-w-xs"
                          placeholder="0.0"
                        />
                        <button
                          className="btn btn-primary mt-2 ml-4 text-white p2"
                          onClick={handleStake}
                        >
                          Stake
                        </button>
                        {errMsg && <p className="p3 text-error">{errMsg}</p>}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Please log in to view your account details.</p>
          )}
        </>
      )}
    </MaxWrapper>
  );
};

export default AccountPage;
