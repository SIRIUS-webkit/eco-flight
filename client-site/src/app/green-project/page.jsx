"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import GreenProject from "../../../../contract/artifacts/contracts/GreenProject.sol/GreenProject.json";
import EcoToken from "../../../../contract/artifacts/contracts/EcoToken.sol/EcoToken.json"; // Import the EcoToken ABI
import { useWeb3Auth } from "../../utils/Web3AuthContext"; // Import your Web3Auth context

const GreenProjectComponent = () => {
  const [greenProjectContract, setGreenProjectContract] = useState(null);
  const [ecoTokenContract, setEcoTokenContract] = useState(null);
  const { provider, loggedIn } = useWeb3Auth(); // Use Web3Auth provider from the context
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [isMinterApproved, setIsMinterApproved] = useState(false);
  const [userAddress, setUserAddress] = useState(null);

  useEffect(() => {
    const setup = async () => {
      if (provider && loggedIn) {
        const signer = provider.getSigner();

        // Get user's address
        const address = await signer.getAddress();
        setUserAddress(address);

        // Initialize GreenProject contract
        const greenProject = new ethers.Contract(
          process.env.NEXT_PUBLIC_GREENPROJECT_ADDRESS,
          GreenProject.abi,
          signer
        );
        setGreenProjectContract(greenProject);

        // Initialize EcoToken contract
        const ecoToken = new ethers.Contract(
          process.env.NEXT_PUBLIC_ECOTOKEN_ADDRESS,
          EcoToken.abi,
          signer
        );
        setEcoTokenContract(ecoToken);

        // Check if GreenProject contract is approved as a minter
        checkMinterApproval(greenProject.address, ecoToken);
      }
    };
    setup();
  }, [provider, loggedIn]);

  const checkMinterApproval = async (greenProjectAddress, ecoTokenContract) => {
    try {
      const isApproved = await ecoTokenContract.setMinter(
        greenProjectAddress,
        true
      );
      setIsMinterApproved(isApproved);
    } catch (error) {
      console.error("Error checking minter approval:", error);
    }
  };

  const approveMinter = async () => {
    if (!ecoTokenContract || !greenProjectContract) return;
    try {
      setLoading(true);
      const tx = await ecoTokenContract.setMinter(
        greenProjectContract.address,
        true
      );
      await tx.wait();
      setIsMinterApproved(true); // Update the state to reflect approval
    } catch (error) {
      console.error("Error approving minter:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    if (!greenProjectContract) return;
    try {
      const projectsList = await greenProjectContract.getProjects();
      const formattedProjects = projectsList.map((project, index) => ({
        id: index,
        name: project.name,
        description: project.description,
        totalFundsRequired: ethers.utils.formatEther(
          project.totalFundsRequired
        ),
        fundsRaised: ethers.utils.formatEther(project.fundsRaised),
        projectOwner: project.projectOwner,
      }));
      setProjects(formattedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const donateToProject = async (projectId) => {
    if (!greenProjectContract || !donationAmount) return;

    // Check if minter is approved, if not, prompt the user to approve
    if (!isMinterApproved) {
      console.log("Please approve the GreenProject contract as a minter.");
      return;
    }

    try {
      setLoading(true);
      const tx = await greenProjectContract.donateToProject(projectId, {
        value: ethers.utils.parseEther(donationAmount),
      });
      await tx.wait();
      setDonationAmount("");
      fetchProjects(); // Refresh projects
    } catch (error) {
      console.error("Error donating to project:", error);
    } finally {
      setLoading(false);
    }
  };

  const withdrawFunds = async (projectId) => {
    if (!greenProjectContract) return;
    try {
      setLoading(true);
      const tx = await greenProjectContract.withdrawFunds(projectId);
      await tx.wait();
      fetchProjects(); // Refresh projects
    } catch (error) {
      console.error("Error withdrawing funds:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (greenProjectContract && loggedIn) {
      fetchProjects();
    }
  }, [greenProjectContract, loggedIn]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Green Projects</h2>

      {/* Approve minter section */}
      {!isMinterApproved && (
        <div className="bg-yellow-100 p-4 rounded-lg shadow mb-4">
          <p className="text-red-600 mb-4">
            The GreenProject contract is not approved to mint EcoTokens. Please
            approve it first.
          </p>
          <button
            onClick={approveMinter}
            disabled={loading}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Approving..." : "Approve GreenProject as Minter"}
          </button>
        </div>
      )}

      {/* List of projects */}
      {projects.map((project) => (
        <div key={project.id} className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <p className="text-gray-600">{project.description}</p>
          <p>Total Funds Required: {project.totalFundsRequired} ETH</p>
          <p>Funds Raised: {project.fundsRaised} ETH</p>
          <p>Owner: {project.projectOwner}</p>
          {userAddress === project.projectOwner && (
            <button
              onClick={() => withdrawFunds(project.id)}
              disabled={loading}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:bg-gray-400"
            >
              {loading ? "Withdrawing..." : "Withdraw Funds"}
            </button>
          )}
          <input
            type="number"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            placeholder="Donation amount in ETH"
            className="w-full p-2 mb-2 border rounded"
          />
          <button
            onClick={() => donateToProject(project.id)}
            disabled={loading || !isMinterApproved}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Donate"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default GreenProjectComponent;
