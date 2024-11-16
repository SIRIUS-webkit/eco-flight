"use client";

import MaxWrapper from "@/components/common/MaxWrapper";
import React, { useState } from "react";

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
  minDonation?: number; // Optional
  maxDonation?: number; // Optional
}

const ProjectsPage: React.FC = () => {
  const projects: Project[] = [
    {
      id: 1,
      name: "Clean Water Initiative",
      description: "Providing clean water to rural communities.",
      category: "Health",
      location: "Kenya",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      fundsRaised: 10,
      totalFundsRequired: 50,
      mediaUrl: "https://via.placeholder.com/300x200?text=Clean+Water",
      minDonation: 1,
      maxDonation: 10,
    },
    {
      id: 2,
      name: "Education for All",
      description: "Building schools and providing learning materials.",
      category: "Education",
      location: "India",
      startDate: "2023-06-01",
      endDate: "2024-06-01",
      fundsRaised: 30,
      totalFundsRequired: 100,
      mediaUrl: "https://via.placeholder.com/300x200?text=Education",
      minDonation: 2,
      maxDonation: 20,
    },
    {
      id: 3,
      name: "Renewable Energy Project",
      description: "Installing solar panels in underdeveloped regions.",
      category: "Environment",
      location: "Brazil",
      startDate: "2024-02-01",
      endDate: "2025-01-01",
      fundsRaised: 70,
      totalFundsRequired: 120,
      mediaUrl: "https://via.placeholder.com/300x200?text=Renewable+Energy",
      minDonation: 5,
      maxDonation: 50,
    },
  ];

  const loggedIn = false;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [donationAmount, setDonationAmount] = useState<number | "">("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

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
                <p>{project.description}</p>
                <p className="badge bg-primary text-white p4">
                  {project.category}
                </p>
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

                <div className="card-actions justify-end">
                  <button
                    onClick={() => openModal(project)}
                    className="btn btn-outline btn-secondary"
                  >
                    Donate
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
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
                    <button type="submit" className="btn btn-primary">
                      {loading ? "Donating..." : "Donate"}
                    </button>
                    <button onClick={closeModal} className="btn btn-outline">
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
