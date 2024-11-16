"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ethers } from "ethers";
import GreenProject from "../../../../../contract/artifacts/contracts/GreenProject.sol/GreenProject.json";
import { useWeb3Auth } from "@/utils/Web3AuthContext";
import MaxWrapper from "@/components/common/MaxWrapper";
import { truncateString, classNames } from "@/utils/common";

interface Project {
  id: number;
  name: string;
  mediaUrl: string;
  description: string;
  totalFundsRequired: string;
  fundsRaised: string;
  location: string;
  category: string;
  startDate: string;
  endDate: string;
  projectOwner: string;
  status: string;
}

const MyProjectTabs: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { provider, loggedIn }: any = useWeb3Auth();
  const [pageLoading, setPageLoading] = useState(false);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [userAddress, setUserAddress] = useState<string>("");

  useEffect(() => {
    const fetchUserProjects = async () => {
      if (!provider || !loggedIn) {
        console.error("No provider or not logged in");
        return;
      }

      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setUserAddress(address);

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_GREENPROJECT_ADDRESS!,
        GreenProject.abi,
        signer
      );

      try {
        setPageLoading(true);
        const allProjects = await contract.getProjects();
        const filteredProjects: Project[] = allProjects
          .map((project: any, index: number) => ({
            id: index,
            name: project.core.name,
            mediaUrl: project.details.mediaUrl,
            description: project.core.description,
            totalFundsRequired: ethers.utils.formatEther(
              project.core.totalFundsRequired
            ),
            fundsRaised: ethers.utils.formatEther(project.core.fundsRaised),
            location: project.details.location,
            category: project.details.category,
            startDate: new Date(
              project.details.startDate * 1000
            ).toLocaleDateString(),
            endDate: new Date(
              project.details.endDate * 1000
            ).toLocaleDateString(),
            projectOwner: project.core.projectOwner,
            status:
              new Date(project.details.endDate * 1000) < new Date()
                ? "Completed"
                : "Active",
          }))
          .filter((project) => project.projectOwner === address); // Filter projects by the user's address

        setUserProjects(filteredProjects);
        setPageLoading(false);
      } catch (error) {
        setPageLoading(false);
        console.error("Error fetching user projects:", error);
      }
    };

    fetchUserProjects();
  }, [provider, loggedIn]);

  const tabs = [
    { label: "Account", path: "/my-account" },
    { label: "Donation", path: "/my-donation" },
    { label: "My Projects", path: "/my-project" },
    { label: "My Emission", path: "/my-emission" },
  ];

  const SkeletonCard = () => (
    <div className="card rounded-lg w-full bg-base-100 shadow-md animate-pulse">
      <div className="w-full h-48 bg-gray-300 rounded-tl-lg rounded-tr-lg"></div>
      <div className="card-body p-4">
        <div className="h-6 bg-gray-300 rounded mb-4"></div>
        <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
        <div className="h-6 bg-gray-300 rounded mt-4"></div>
      </div>
    </div>
  );

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
      <h4 className="font-bold mb-6">My Project Details</h4>

      <div className="grid grid-cols-3 gap-8 pb-10">
        {pageLoading ? (
          Array(3) // Display 3 skeleton cards
            .fill(0)
            .map((_, index) => <SkeletonCard key={index} />)
        ) : userProjects.length === 0 ? (
          <p>There is no project.</p>
        ) : (
          userProjects.map((project) => {
            const progressPercentage = Math.min(
              (parseFloat(project.fundsRaised) /
                parseFloat(project.totalFundsRequired)) *
                100,
              100
            );

            return (
              <div
                key={project.id}
                className="card rounded-lg w-full bg-base-100 shadow-md"
              >
                <img
                  src={project.mediaUrl}
                  alt={project.name}
                  className="w-full h-48 object-cover rounded-tl-lg rounded-tr-lg"
                />
                <div className="card-body p-4">
                  <h2 className="card-title">{project.name}</h2>
                  <p className="p3">
                    {truncateString(project.description || "", 120)}
                  </p>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="badge bg-primary text-white px-3 py-1 text-sm">
                      {project.category}
                    </span>
                    <span
                      className={`badge px-3 py-1 p3 ${
                        project.status === "Completed"
                          ? "bg-secondary text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="p3 text-gray-500">
                    Location: {project.location}
                  </div>
                  <div className="p3 text-gray-500">
                    Duration: {project.startDate} - {project.endDate}
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between p3">
                      <span>Funds Raised:</span>
                      <span>
                        {project.fundsRaised} ETH / {project.totalFundsRequired}{" "}
                        ETH
                      </span>
                    </div>
                    <progress
                      className="progress progress-primary w-full"
                      value={progressPercentage}
                      max="100"
                    ></progress>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </MaxWrapper>
  );
};

export default MyProjectTabs;
