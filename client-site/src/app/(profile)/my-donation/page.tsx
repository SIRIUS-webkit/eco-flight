"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ethers, Contract } from "ethers";
import GreenProject from "../../../../../contract/artifacts/contracts/GreenProject.sol/GreenProject.json";
import { useWeb3Auth } from "@/utils/Web3AuthContext";
import MaxWrapper from "@/components/common/MaxWrapper";
import { classNames } from "@/utils/common";

interface Donation {
  projectName: string;
  donatedAmount: string;
  projectStatus: string;
  donatedDate: string;
}

const DonationTabs: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { provider, loggedIn }: any = useWeb3Auth();

  const [donations, setDonations] = useState<Donation[]>([]);
  const [userAddress, setUserAddress] = useState<string>("");
  const [greenProjectContract, setGreenProjectContract] =
    useState<Contract | null>(null);

  const tabs = [
    { label: "Account", path: "/my-account" },
    { label: "Donation", path: "/my-donation" },
    { label: "My Projects", path: "/my-project" },
    { label: "My Emission", path: "/my-emission" },
  ];
  useEffect(() => {
    const fetchDonations = async () => {
      if (
        !provider ||
        !loggedIn ||
        !process.env.NEXT_PUBLIC_GREENPROJECT_ADDRESS
      ) {
        console.error(
          "Provider, user login, or contract address not available."
        );
        return;
      }

      try {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);

        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_GREENPROJECT_ADDRESS,
          GreenProject.abi,
          signer
        );
        setGreenProjectContract(contract);

        const projectData = await contract.getProjects(); // Fetch all projects

        const donationDetails: Donation[] = await Promise.all(
          projectData.map(async (project: any, index: number) => {
            const donatedAmount = await contract.userDonations(address, index); // Fetch user donation for each project
            if (donatedAmount.gt(0)) {
              return {
                projectName: project.core.name,
                donatedAmount: ethers.utils.formatEther(donatedAmount),
                projectStatus:
                  project.core.status === 0
                    ? "Active"
                    : project.core.status === 1
                    ? "Completed"
                    : "Canceled",
                donatedDate: new Date().toLocaleDateString(), // Placeholder for now
              };
            }
            return null;
          })
        );

        // Filter out null values
        setDonations(
          donationDetails.filter((donation) => donation !== null) as Donation[]
        );
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations();
  }, [provider, loggedIn]);

  return (
    <MaxWrapper>
      {/* Navigation Tabs */}
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

      {/* Donation Details */}
      <div>
        <h4 className="font-bold mb-6">Donation Details</h4>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="p4">Project Name</th>
                <th className="p4">Donated Amount</th>
                <th className="p4">Project Status</th>
                <th className="p4">Donated Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.length > 0 ? (
                donations.map((donation, index) => (
                  <tr key={index}>
                    <td className="p2">{donation.projectName}</td>
                    <td className="p2">{donation.donatedAmount} ETH</td>
                    <td>
                      <span
                        className={`badge ${
                          donation.projectStatus === "Active"
                            ? "bg-primary text-white p2"
                            : "bg-secondary text-white p2"
                        }`}
                      >
                        {donation.projectStatus}
                      </span>
                    </td>
                    <td>{donation.donatedDate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">
                    No donations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MaxWrapper>
  );
};

export default DonationTabs;
