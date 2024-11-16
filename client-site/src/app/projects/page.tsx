"use client";

import React, { useEffect, useState } from "react";
import MaxWrapper from "@/components/common/MaxWrapper";
import { classNames, truncateString } from "@/utils/common";
import { ethers } from "ethers";
import { useWeb3Auth } from "@/utils/Web3AuthContext";
import GreenProject from "../../../../contract/artifacts/contracts/GreenProject.sol/GreenProject.json";
import { ClientPageRoot } from "next/dist/client/components/client-page";

interface Project {
  id: number;
  name: string;
  description: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  fundsRaised: number;
  totalFundsRequired: number;
  mediaUrl: string;
  minDonation: number;
  maxDonation: number;
  status: string;
}

const ProjectsPage: React.FC = () => {
  const defaultProjects: Project[] = [
    {
      id: 1,
      name: "Green Initiative",
      description:
        "A global initiative to plant trees in deforested regions, focusing on species that absorb high amounts of CO2. Contributions support tree planting and maintenance.",
      category: "Reforestation",
      location: "Kenya",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      fundsRaised: 10,
      totalFundsRequired: 50,
      mediaUrl:
        "https://res.cloudinary.com/dgllpowes/image/upload/v1731672754/project_images/eziqmuyesqmhwpa2buyx.jpg",
      minDonation: 1,
      maxDonation: 10,
      status: "Active",
    },
    {
      id: 2,
      name: "Solar for Rural Communities",
      description:
        "This project funds the installation of solar panels in rural areas, reducing reliance on fossil fuels and providing clean energy access to underserved communities.",
      category: "Renewable Energy",
      location: "India",
      startDate: "2023-06-01",
      endDate: "2024-06-01",
      fundsRaised: 30,
      totalFundsRequired: 100,
      mediaUrl:
        "https://res.cloudinary.com/dgllpowes/image/upload/v1731672753/project_images/pxtsqam6hb6rqyp7gnsq.jpg",
      minDonation: 2,
      maxDonation: 20,
      status: "Active",
    },
    {
      id: 3,
      name: "Protect Our Peatlands",
      description:
        "Peatlands are vital carbon sinks. This project preserves existing peatlands, preventing CO2 release through activities like sustainable management and community engagement.",
      category: "Conservation",
      location: "Brazil",
      startDate: "2024-02-01",
      endDate: "2025-01-01",
      fundsRaised: 70,
      totalFundsRequired: 120,
      mediaUrl:
        "https://res.cloudinary.com/dgllpowes/image/upload/v1731672752/project_images/guuazirpyo1tn2ofvevh.jpg",
      minDonation: 5,
      maxDonation: 50,
      status: "Completed",
    },
  ];

  const { provider, loggedIn }: any = useWeb3Auth();
  const [projects, setProjects] = useState<any>(defaultProjects);
  const [greenProjectContract, setGreenProjectContract] =
    useState<ethers.Contract | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [donationAmount, setDonationAmount] = useState<number | "">("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProjects = async () => {
    if (
      !process.env.NEXT_PUBLIC_GREENPROJECT_ADDRESS ||
      !process.env.NEXT_PUBLIC_INFURA_API_KEY
    ) {
      console.error("Environment variables are not set.");
      return;
    }

    const rpcProvider = new ethers.providers.JsonRpcProvider(
      `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
    );
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_GREENPROJECT_ADDRESS,
      GreenProject.abi,
      rpcProvider
    );

    try {
      const projectData = await contract.getProjects();
      console.log(projectData);
      const formattedProjects: Project[] = projectData.map(
        (project: any, index: number) => {
          const endDate = new Date(project.details.endDate * 1000);
          const currentDate = new Date();
          const status = endDate < currentDate ? "Completed" : "Active";

          return {
            id: index,
            name: project.core.name,
            description: project.core.description,
            totalFundsRequired: parseFloat(
              ethers.utils.formatEther(project.core.totalFundsRequired)
            ),
            fundsRaised: parseFloat(
              ethers.utils.formatEther(project.core.fundsRaised)
            ),
            location: project.details.location,
            category: project.details.category,
            startDate: new Date(
              project.details.startDate * 1000
            ).toLocaleDateString(),
            endDate: endDate.toLocaleDateString(),
            minDonation: parseFloat(
              ethers.utils.formatEther(project.details.minDonation)
            ),
            maxDonation: parseFloat(
              ethers.utils.formatEther(project.details.maxDonation)
            ),
            mediaUrl: project.details.mediaUrl,
            status, // Dynamically set the status
          };
        }
      );

      console.log("Newly Fetched Projects:", formattedProjects);

      // Merge existing and new projects, avoiding duplicates
      setProjects((prevProjects) => {
        const uniqueProjects = formattedProjects.filter(
          (newProject) =>
            !prevProjects.some(
              (prevProject) => prevProject.id === newProject.id
            )
        );
        return [...uniqueProjects, ...prevProjects];
      });
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
    if (provider && loggedIn && process.env.NEXT_PUBLIC_GREENPROJECT_ADDRESS) {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_GREENPROJECT_ADDRESS,
        GreenProject.abi,
        signer
      );
      setGreenProjectContract(contract);
    }
  }, [provider, loggedIn]);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setDonationAmount("");
    setErrorMessage("");
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedIn) {
      setErrorMessage("Please log in to make a donation.");
      return;
    }
    if (!selectedProject) return;

    const { minDonation, maxDonation } = selectedProject;

    if (donationAmount < minDonation) {
      setErrorMessage(`Minimum donation is ${minDonation} ETH`);
      return;
    }
    if (donationAmount > maxDonation) {
      setErrorMessage(`Maximum donation is ${maxDonation} ETH`);
      return;
    }

    setLoading(true);

    try {
      const tx = await greenProjectContract!.donateToProject(
        selectedProject.id,
        {
          value: ethers.utils.parseEther(donationAmount.toString()),
        }
      );
      await tx.wait();
      alert(
        `Thank you for donating ${donationAmount} ETH to ${selectedProject.name}`
      );
      closeModal();
      fetchProjects();
    } catch (error) {
      console.error("Donation failed:", error);
      setErrorMessage("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MaxWrapper>
      <h3 className="font-bold pt-10">Projects</h3>
      <div className="grid grid-cols-3 gap-8 py-10">
        {projects.map((project) => {
          const progressPercentage = Math.min(
            (project.fundsRaised / project.totalFundsRequired) * 100,
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
                  {truncateString(project?.description, 120)}
                </p>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="badge bg-primary text-white px-3 py-1 text-sm">
                    {project.category}
                  </span>
                  <span className="badge bg-secondary text-white px-3 py-1 p3">
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

                <div
                  className={classNames(
                    project.status === "Completed"
                      ? "!opacity-0"
                      : "opacity-100",
                    "card-actions justify-end"
                  )}
                >
                  <button
                    disabled={project.status === "Completed"}
                    onClick={() => openModal(project)}
                    className="btn btn-outline btn-secondary p2"
                  >
                    Donate
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedProject && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Donate to {selectedProject.name}
            </h3>
            <form onSubmit={handleDonationSubmit} className="mt-4">
              {loggedIn ? (
                <>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Donation Amount (ETH)</span>
                    </label>
                    <input
                      type="number"
                      value={donationAmount}
                      onChange={(e) =>
                        setDonationAmount(Number(e.target.value))
                      }
                      className="input input-bordered"
                      placeholder={`Min: ${selectedProject.minDonation}, Max: ${selectedProject.maxDonation}`}
                    />
                  </div>
                  {errorMessage && (
                    <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                  )}
                  <div className="modal-action">
                    <button
                      type="submit"
                      className="btn btn-primary p2 font-bold text-white"
                    >
                      {loading ? "Donating..." : "Donate"}
                    </button>
                    <button
                      onClick={closeModal}
                      className="btn btn-outline btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-red-500">
                  Please log in to donate. Viewing is available without login.
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </MaxWrapper>
  );
};

export default ProjectsPage;
