"use client";

import React from "react";
import Button from "../common/Button";

const defaultProjects = [
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
    mediaUrl:
      "https://res.cloudinary.com/dgllpowes/image/upload/v1731672754/project_images/eziqmuyesqmhwpa2buyx.jpg",
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
    mediaUrl:
      "https://res.cloudinary.com/dgllpowes/image/upload/v1731672753/project_images/pxtsqam6hb6rqyp7gnsq.jpg",
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
    mediaUrl:
      "https://res.cloudinary.com/dgllpowes/image/upload/v1731672752/project_images/guuazirpyo1tn2ofvevh.jpg",
  },
];

const HomeProject = () => {
  const projects = defaultProjects; // You can replace this with dynamic data later

  return (
    <>
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
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center items-center">
        <Button
          text="Explore Now"
          cls="btn btn-primary p2 text-white"
          type="button"
          linkTag
          link="/projects"
        />
      </div>
    </>
  );
};

export default HomeProject;
