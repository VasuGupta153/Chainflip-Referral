// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

// @title Campaign
// @notice This contract represents an individual campaign and manages participation and reward distribution.
// @dev Uses OpenZeppelin's AccessControl for role-based access control and Initializable for upgradeable contracts.

contract Campaign is AccessControl, Initializable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");


    // @notice The address of the ERC20 reward token

    address public constant REWARD_TOKEN = 0xdC27c60956cB065D19F08bb69a707E37b36d8086;


    // @notice The ID of the campaign
    bytes public campaignId;

    // @notice The name of the campaign
    string public name;

    // @notice The deadline for the campaign
    uint256 public deadline;

    // @notice The total reward amount allocated for the campaign
    uint256 public totalRewardAmount;

    // @notice The reward amount per referral
    uint256 public rewardPerReferral;

    // @notice The number of referrals left that can be rewarded
    uint256 public leftReferralCount;

    // @notice Indicates whether the campaign has been stopped
    bool public isStopped;

    // @notice The address of the campaign creator
    address public creator;


    // @notice Mapping to track whether an address has participated in the campaign
    mapping(address => bool) public hasParticipated;

    // @notice Array of participants in the campaign
    address[] public participants;

    // @notice Mapping to track the number of referrals for each participant
    mapping(address => uint256) public referralCount;

    // @notice Mapping to store referral codes for each participant
    mapping(address => string) public referralCodes;

    // @notice Mapping to link referral codes to referrers
    mapping(string => address) public codeToReferrer;

    // @notice Mapping to track whether a participant has been referred
    mapping(address => bool) public isReferred;


    // @notice Emitted when a referral code is set for a user
    // @param user The address of the user
    // @param code The referral code
    event ReferralCodeSet(address user, string code);

    // @notice Emitted when a user participates in the campaign
    // @param user The address of the user
    // @param referralCode The referral code used for participation
    event Participated(address user, string referralCode);

    // @notice Emitted when rewards are distributed to a participant
    // @param user The address of the user
    // @param amount The amount of reward distributed
    event RewardDistributed(address user, uint256 amount);



    // @notice Initializes the campaign with the specified parameters
    // @param _campaignId The ID of the campaign
    // @param _name The name of the campaign
    // @param _deadline The deadline for the campaign
    // @param _totalRewardAmount The total reward amount allocated for the campaign
    // @param _rewardPerReferral The reward amount per referral
    // @param _creator The address of the campaign creator
    // @param _owner The address of the owner (admin) of the campaign

    function initialize(
        bytes memory _campaignId,
        string memory _name,
        uint256 _deadline,
        uint256 _totalRewardAmount,
        uint256 _rewardPerReferral,
        address _creator,
        address _owner
    ) public initializer {
        campaignId = _campaignId;
        name = _name;
        deadline = _deadline;
        totalRewardAmount = _totalRewardAmount;
        rewardPerReferral = _rewardPerReferral;
        creator = _creator;
        leftReferralCount = totalRewardAmount / rewardPerReferral;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, _owner);
    }

    // @notice Modifier to restrict access to admin functions
    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        _;
    }



    // @notice Allows a user to participate in the campaign using a referral code
    // @param referralCode The referral code used for participation

    function participate(string memory referralCode) external {
        require(!isStopped, "Campaign has been stopped");
        require(block.timestamp < deadline, "Campaign has ended");
        require(!hasParticipated[msg.sender], "Already participated");
        require(leftReferralCount > 1, "No reward left!");
        hasParticipated[msg.sender] = true;
        participants.push(msg.sender);
        if (bytes(referralCode).length > 0) {
            address referrer = codeToReferrer[referralCode];
            if (referrer != address(0)) {
                referralCount[referrer]++;
                isReferred[msg.sender] = true;
                leftReferralCount -= 2;
            }
        }
        emit Participated(msg.sender, referralCode);
    }



    // @notice Stops the campaign and distributes remaining rewards
    // @dev Only callable by an admin

    function stopCampaign() public onlyAdmin {
        require(!isStopped, "Campaign is already stopped");
        require(block.timestamp >= deadline, "Campaign deadline has not been reached");
        isStopped = true;
        distributeRewards();
        // Transfer remaining rewards back to the campaign creator
        uint256 remainingRewards = IERC20(REWARD_TOKEN).balanceOf(address(this));
        if (remainingRewards > 0) {
            IERC20(REWARD_TOKEN).transfer(creator, remainingRewards);
        }
    }



    // @notice Distributes rewards to participants based on their referrals
    // @dev Only callable internally when the campaign is stopped

    function distributeRewards() private {
        for (uint256 i = 0; i < participants.length; ++i) {
            uint256 referCount = 0;
            address participant = participants[i];
            referCount += referralCount[participant];
            if (isReferred[participant]) {
                referCount++;
            }
            uint256 rewardValue = referCount * rewardPerReferral;
            IERC20(REWARD_TOKEN).transfer(participant, rewardValue);
            emit RewardDistributed(participant, rewardValue);
        }
    }



    // @notice Sets a referral code for a user
    // @param user The address of the user
    // @param code The referral code to be set

    function setReferralCode(address user, string memory code) external onlyAdmin {
        require(hasParticipated[user], "User has not participated");
        require(bytes(referralCodes[user]).length == 0, "Referral code already set");
        require(codeToReferrer[code] == address(0), "Code already in use");

        referralCodes[user] = code;
        codeToReferrer[code] = user;
        emit ReferralCodeSet(user, code);
    }



    // @notice Gets the participation information of a user
    // @param user The address of the user
    // @return A tuple containing participation status, referral count, and referral code of the user

    function getParticipantInfo(address user) external view returns (bool, uint256, string memory) {
        return (hasParticipated[user], referralCount[user], referralCodes[user]);
    }



    // @notice Adds a new admin to the campaign
    // @param newAdmin The address of the new admin
    
    function addAdmin(address newAdmin) public onlyAdmin {
        grantRole(ADMIN_ROLE, newAdmin);
    }


    // @notice Removes an admin from the campaign
    // @param admin The address of the admin to be removed
    
    function removeAdmin(address admin) public onlyAdmin {
        revokeRole(ADMIN_ROLE, admin);
    }
}
