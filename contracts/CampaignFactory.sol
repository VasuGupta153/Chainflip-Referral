// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Campaign.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

// @title CampaignFactory
// @notice This contract is responsible for creating and managing individual campaign contracts.
// @dev Uses OpenZeppelin's Ownable for access control and Clones for creating campaign instances.


contract CampaignFactory is Ownable {

    // @notice The address of the ERC20 reward token
    address public constant REWARD_TOKEN = 0xdC27c60956cB065D19F08bb69a707E37b36d8086;


    // @notice The address of the campaign implementation contract used for creating clones
    address public immutable campaignImplementation;


    // @notice The count of campaigns created
    uint256 public campaignCount;

    
    // @notice Emitted when a new campaign is created
    // @param campaignId The ID of the campaign
    // @param campaignAddress The address of the new campaign contract
    // @param creator The address of the campaign creator
    // @param name The name of the campaign
    // @param deadline The deadline for the campaign
    // @param totalRewardAmount The total reward amount allocated for the campaign
    // @param rewardPerReferral The reward amount per referral

    event CampaignCreated(
        bytes indexed campaignId,
        address campaignAddress,
        address creator,
        string name,
        uint256 deadline,
        uint256 totalRewardAmount,
        uint256 rewardPerReferral
    );


    // @notice Emitted when an expired campaign is stopped
    // @param campaignId The ID of the campaign
    // @param campaignAddress The address of the campaign contract
    // @param name The name of the campaign
    // @param deadline The deadline for the campaign
    // @param timestamp The timestamp when the campaign was stopped

    event CampaignStopped(
        bytes indexed campaignId,
        address campaignAddress,
        string name,
        uint256 deadline,
        uint256 timestamp
    );


    // @notice Constructor to set the owner and initialize the campaign implementation address
    constructor() Ownable(msg.sender) {
        campaignCount = 0;
        campaignImplementation = address(new Campaign());
    }


    // @notice Creates a new campaign with the specified parameters
    // @param name The name of the campaign
    // @param deadline The deadline for the campaign
    // @param totalRewardAmount The total reward amount allocated for the campaign
    // @param rewardPerReferral The reward amount per referral

    function createCampaign(
        string memory name,
        uint256 deadline,
        uint256 totalRewardAmount,
        uint256 rewardPerReferral
    ) public {
        require(bytes(name).length > 0, "Campaign name cannot be empty");
        require(deadline > block.timestamp, "Deadline must be in the future");
        require(totalRewardAmount > 0, "Total reward amount must be greater than 0");
        require(rewardPerReferral > 0, "Reward per referral must be greater than 0");
        require(totalRewardAmount >= rewardPerReferral, "Total reward amount must be greater than or equal to reward per referral");
        require(IERC20(REWARD_TOKEN).balanceOf(msg.sender) >= totalRewardAmount, "Insufficient token balance");
        require(IERC20(REWARD_TOKEN).allowance(msg.sender, address(this)) >= totalRewardAmount, "Token allowance too low");

        bytes memory newCampaignId = abi.encodePacked(campaignCount);
        campaignCount++;

        address newCampaignAddress = Clones.clone(campaignImplementation);
        Campaign newCampaign = Campaign(newCampaignAddress);

        newCampaign.initialize(
            newCampaignId,
            name,
            deadline,
            totalRewardAmount,
            rewardPerReferral,
            msg.sender,
            owner()
        );

        IERC20(REWARD_TOKEN).transferFrom(msg.sender, address(newCampaign), totalRewardAmount);

        emit CampaignCreated(
            newCampaignId,
            address(newCampaign),
            msg.sender,
            name,
            deadline,
            totalRewardAmount,
            rewardPerReferral
        );
    }



    // @notice Stops an expired campaign
    // @param _campaign The address of the campaign to be stopped

    function stopExpiredCampaign(address _campaign) public onlyOwner {
        Campaign stoppedCampaign = Campaign(_campaign);
        require(stoppedCampaign.deadline() <= block.timestamp, "Campaign has not yet expired");

        stoppedCampaign.stopCampaign();

        emit CampaignStopped(
            stoppedCampaign.campaignId(),
            _campaign,
            stoppedCampaign.name(),
            stoppedCampaign.deadline(),
            block.timestamp
        );
    }



    // @notice Returns the current block timestamp
    // @return The current block timestamp
    
    function currentTime() view public returns (uint256){
        return block.timestamp;
    }
}
