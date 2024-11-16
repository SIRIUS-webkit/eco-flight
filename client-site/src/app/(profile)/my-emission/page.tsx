/* eslint-disable */
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ethers } from "ethers";
import CarbonEmission from "../../../../../contract/artifacts/contracts/CarbonEmission.sol/CarbonEmission.json";
import GreenProject from "../../../../../contract/artifacts/contracts/GreenProject.sol/GreenProject.json";
import { useWeb3Auth } from "@/utils/Web3AuthContext";
import { classNames, getAirportNameByIATA } from "@/utils/common";
import MaxWrapper from "@/components/common/MaxWrapper";

interface Emission {
  id: number;
  departure: string;
  destination: string;
  passengers: number;
  tripType: string;
  carbonEmission: number;
  fulfilled: string;
}

const MyEmissionTabs: React.FC = () => {
  const pathname = usePathname();
  const { provider, loggedIn }: any = useWeb3Auth();

  const [userEmission, setUserEmission] = useState<Emission[]>([]);
  const [totalEmission, setTotalEmission] = useState<number>(0);
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [reducedEmission, setReducedEmission] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  const emissionReductionRate = 500; // 500 kg CO2 reduction per 1 Ether donated

  useEffect(() => {
    const fetchUserEmissions = async () => {
      if (!provider || !loggedIn) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        const emissionContract = new ethers.Contract(
          process.env.NEXT_PUBLIC_CARBONEMISSION_ADDRESS!,
          CarbonEmission.abi,
          signer
        );

        const greenProjectContract = new ethers.Contract(
          process.env.NEXT_PUBLIC_GREENPROJECT_ADDRESS!,
          GreenProject.abi,
          signer
        );

        // Fetch user emissions
        const allEmissions = await emissionContract.getUserFlights(address);
        const formattedEmissions: Emission[] = allEmissions.map(
          (emission: any, index: number) => ({
            id: index,
            departure: emission[0],
            destination: emission[1],
            passengers: emission[2]?.toNumber() || 0,
            tripType: emission[3] === "direct" ? "One-Way" : "Round-Trip",
            carbonEmission: (emission[4]?.toNumber() || 0) / 100,
            fulfilled: emission[6] ? "Fulfilled" : "Pending",
          })
        );

        setUserEmission(formattedEmissions);

        const total = formattedEmissions.reduce(
          (sum, emission) => sum + emission.carbonEmission,
          0
        );
        setTotalEmission(total);

        // Fetch user donations
        const projectData = await greenProjectContract.getProjects();
        const donationDetails = await Promise.all(
          projectData.map(async (_project: any, index: number) => {
            const donatedAmount = await greenProjectContract.userDonations(
              address,
              index
            );
            return donatedAmount.gt(0)
              ? parseFloat(ethers.utils.formatEther(donatedAmount))
              : 0;
          })
        );

        const totalDonations = donationDetails.reduce(
          (sum, donation) => sum + donation,
          0
        );
        setDonationAmount(totalDonations);
        setReducedEmission(totalDonations * emissionReductionRate);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEmissions();
  }, [provider, loggedIn]);

  const tabs = [
    { label: "Account", path: "/my-account" },
    { label: "Donation", path: "/my-donation" },
    { label: "My Projects", path: "/my-project" },
    { label: "My Emission", path: "/my-emission" },
  ];

  const progressPercentage = totalEmission
    ? Math.min((reducedEmission / totalEmission) * 100, 100)
    : 0;

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
                  pathname === tab.path ? "text-white" : "text-black",
                  "p2"
                )}
              >
                {tab.label}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 mb-10">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="card bg-white shadow-lg border rounded-lg p-3 animate-pulse"
              >
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
        </div>
      ) : (
        <>
          <h4 className="font-bold mb-6">My Carbon Emissions</h4>
          <div className="mt-6">
            <h5 className="font-semibold">Emission Summary</h5>
            <p>
              Total Emissions:{" "}
              <strong>{totalEmission.toFixed(2)} kg CO2</strong>
            </p>
            <p>
              Reduced Emissions:{" "}
              <strong>{reducedEmission.toFixed(2)} kg CO2</strong>
            </p>
            <p>
              Remaining Emissions:{" "}
              <strong>
                {Math.max(totalEmission - reducedEmission, 0).toFixed(2)} kg CO2
              </strong>
            </p>
            <div className="mt-4">
              <progress
                className="progress progress-accent w-full"
                value={progressPercentage}
                max="100"
              ></progress>
              <div className="text-sm text-center mt-1">
                {progressPercentage.toFixed(2)}% Reduction Achieved
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 mb-10">
            {userEmission.map((emission) => (
              <div
                key={emission.id}
                className="card bg-white shadow-lg border rounded-lg p-3"
              >
                <div className="card-body">
                  <h3 className="card-title text-xl font-semibold mb-2">
                    Flight #{emission.id + 1} ({emission.tripType})
                  </h3>
                  <p>
                    <strong>From:</strong>{" "}
                    {getAirportNameByIATA(emission.departure)}
                  </p>
                  <p>
                    <strong>To:</strong>{" "}
                    {getAirportNameByIATA(emission.destination)}
                  </p>
                  <p>
                    <strong>Passengers:</strong> {emission.passengers}
                  </p>
                  <p>
                    <strong>Carbon Emission:</strong>{" "}
                    {emission.carbonEmission.toFixed(2)} kg CO2
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </MaxWrapper>
  );
};

export default MyEmissionTabs;
