// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EcoToken is ERC20, Ownable {
    struct Stake {
        uint256 amount;
        uint256 startTime;
    }

    uint256 public rewardRate = 10; // Reward rate (e.g., 10% annual reward rate)
    mapping(address => Stake) public stakes;
    mapping(address => uint256) public rewards;
    mapping(address => bool) public approvedMinters; // List of addresses approved to mint tokens

    event TokensStaked(address indexed user, uint256 amount);
    event TokensUnstaked(address indexed user, uint256 amount, uint256 reward);
    event MinterApproved(address indexed minter, bool status);

    constructor() ERC20("EcoToken", "ECO") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Initial supply to contract owner
    }

    // Function to mint tokens; only the owner or approved minters can call this
    function mint(address to, uint256 amount) external {
        require(approvedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        _mint(to, amount);
    }

    // Function to set or remove a minter; only the owner can call this
    function setMinter(address minter, bool canMint) external onlyOwner {
        approvedMinters[minter] = canMint;
        emit MinterApproved(minter, canMint);
    }

    // Function to allow users to stake tokens
    function stakeTokens(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance to stake");
        require(stakes[msg.sender].amount == 0, "Already staking"); // One active stake at a time

        // Transfer tokens to the contract for staking
        _transfer(msg.sender, address(this), amount);

        // Record staking details
        stakes[msg.sender] = Stake({
            amount: amount,
            startTime: block.timestamp
        });

        emit TokensStaked(msg.sender, amount);
    }

    // Function to calculate rewards based on the staking period
    function calculateReward(address user) public view returns (uint256) {
        Stake memory userStake = stakes[user];
        if (userStake.amount == 0) return 0;

        uint256 stakingDuration = block.timestamp - userStake.startTime; // Time in seconds
        uint256 annualReward = (userStake.amount * rewardRate) / 100; // Annual reward based on rewardRate
        uint256 reward = (annualReward * stakingDuration) / 365 days; // Pro-rated reward

        return reward;
    }

    // Function to unstake tokens and claim rewards
    function unstakeTokens() external {
        Stake memory userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No active stake");

        uint256 reward = calculateReward(msg.sender);

        // Clear staking details
        stakes[msg.sender].amount = 0;
        stakes[msg.sender].startTime = 0;

        // Transfer the staked amount + reward back to the user
        _transfer(address(this), msg.sender, userStake.amount + reward);
        emit TokensUnstaked(msg.sender, userStake.amount, reward);
    }

    // Function to update reward rate, only callable by the owner
    function setRewardRate(uint256 newRate) external onlyOwner {
        rewardRate = newRate;
    }
}
