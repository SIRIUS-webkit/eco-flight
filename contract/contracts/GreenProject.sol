// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./EcoToken.sol";

contract GreenProject is Ownable {

    enum Status { Active, Completed, Canceled }

    struct ProjectCore {
        string name;
        string description;
        uint256 totalFundsRequired;
        uint256 fundsRaised;
        address payable projectOwner;
        Status status;
    }

    struct ProjectDetails {
        string category;
        uint256 startDate;
        uint256 endDate;
        string location;
        uint256 minDonation;
        uint256 maxDonation;
        string mediaUrl;
    }

    struct Project {
        ProjectCore core;
        ProjectDetails details;
    }

    struct ProjectInput {
        string name;
        string description;
        uint256 totalFundsRequired;
        string category;
        uint256 startDate;
        uint256 endDate;
        string location;
        uint256 minDonation;
        uint256 maxDonation;
        string mediaUrl;
    }

    EcoToken public ecoToken;
    Project[] public projects;
    mapping(address => mapping(uint256 => uint256)) public userDonations;
    address public adminWallet;

    event DonationMade(address indexed donor, uint256 projectId, uint256 amount, uint256 tokensAwarded);
    event ProjectCreated(uint256 projectId, string name, address projectOwner);
    event FundsWithdrawn(uint256 projectId, uint256 amount, uint256 adminFee);
    event ProjectCompleted(uint256 projectId);
     event ProjectEndDateUpdated(uint256 projectId, uint256 newEndDate);

    constructor(address _ecoToken, address _adminWallet) Ownable(msg.sender) {
        ecoToken = EcoToken(_ecoToken);
        adminWallet = _adminWallet;
    }

    function createProject(ProjectInput memory projectInput) public {
        require(projectInput.totalFundsRequired > 0, "Total funds required must be greater than zero");
        require(projectInput.startDate < projectInput.endDate, "Start date must be before end date");

        ProjectCore memory core = ProjectCore({
            name: projectInput.name,
            description: projectInput.description,
            totalFundsRequired: projectInput.totalFundsRequired,
            fundsRaised: 0,
            projectOwner: payable(msg.sender),
            status: Status.Active
        });

        ProjectDetails memory details = ProjectDetails({
            category: projectInput.category,
            startDate: projectInput.startDate,
            endDate: projectInput.endDate,
            location: projectInput.location,
            minDonation: projectInput.minDonation,
            maxDonation: projectInput.maxDonation,
            mediaUrl: projectInput.mediaUrl
        });

        projects.push(Project({
            core: core,
            details: details
        }));

        emit ProjectCreated(projects.length - 1, projectInput.name, msg.sender);
    }

    function donateToProject(uint256 projectId) external payable {
        require(projectId < projects.length, "Project does not exist");

        Project storage project = projects[projectId];
        require(project.core.status == Status.Active, "Project is not active");
        require(block.timestamp <= project.details.endDate, "Project has ended");
        require(msg.value > 0, "Donation amount must be greater than zero");
        require(msg.value >= project.details.minDonation, "Donation below minimum limit");
        require(msg.value <= project.details.maxDonation, "Donation exceeds maximum limit");

        project.core.fundsRaised += msg.value;
        userDonations[msg.sender][projectId] += msg.value;

        // Calculate EcoToken reward (e.g., 10 tokens per ETH)
        uint256 rewardAmount = (msg.value * 10 * 10 ** ecoToken.decimals()) / 1 ether;
        ecoToken.mint(msg.sender, rewardAmount);

        emit DonationMade(msg.sender, projectId, msg.value, rewardAmount);

        // Automatically update status to Completed if endDate has passed
        if (block.timestamp > project.details.endDate) {
            project.core.status = Status.Completed;
            emit ProjectCompleted(projectId);
        }
    }

    function withdrawFunds(uint256 projectId) public {
        Project storage project = projects[projectId];
        require(msg.sender == project.core.projectOwner, "Only project owner can withdraw funds");
        require(project.core.status == Status.Completed, "Funds can only be withdrawn after project is completed");
        require(project.core.fundsRaised > 0, "No funds to withdraw");

        uint256 amount = project.core.fundsRaised;
        uint256 adminFee = (amount * 5) / 1000; // 0.5% admin fee
        uint256 withdrawableAmount = amount - adminFee;

        project.core.fundsRaised = 0;

        // Transfer the admin fee to the admin wallet
        payable(adminWallet).transfer(adminFee);

        // Transfer the remaining funds to the project owner
        project.core.projectOwner.transfer(withdrawableAmount);

        emit FundsWithdrawn(projectId, withdrawableAmount, adminFee);
    }

    function getProjects() public view returns (Project[] memory) {
        return projects;
    }

    function updateProjectEndDate(uint256 projectId, uint256 newEndDate) public {
        require(projectId < projects.length, "Project does not exist");

        Project storage project = projects[projectId];
        require(newEndDate > project.details.startDate, "New end date must be after start date");
        require(project.core.status == Status.Active, "Cannot update end date for inactive projects");

        project.details.endDate = newEndDate;
        emit ProjectEndDateUpdated(projectId, newEndDate);

        if (block.timestamp > newEndDate) {
            project.core.status = Status.Completed;
            emit ProjectCompleted(projectId);
        }
    }

}