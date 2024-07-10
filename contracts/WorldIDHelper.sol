// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interface/IWorldIDRouter.sol";
import "../interface/ByteHashers.sol";

contract WorldIDHelper  {
    /// @notice The address of the World Id Router
    address public constant RouterAddress = 0x469449f251692E0779667583026b5A1E99512157;

    /// @dev This allows us to use our hashToField function on bytes
    using ByteHasher for bytes;

    /// @notice Thrown when attempting to reuse a nullifier
    error InvalidNullifier();

    /// @notice appId The World ID App ID (from Developer Portal)
    /// @notice action The World ID Action (from Developer Portal)

    string public appId;
    string  public action;

    /// @dev The keccak256 hash of the externalNullifier (unique identifier of the action performed), combination of appId and action
    uint256 internal externalNullifierHash = abi
            .encodePacked(abi.encodePacked(appId).hashToField(), action)
            .hashToField();

    /// @dev The World ID group ID (1 for Orb-verified)
    uint256 internal immutable groupId = 1;

    /// @dev Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a single person
    mapping(uint256 => bool) internal nullifierHashes;

    /// @param signal An arbitrary input from the user that cannot be tampered with. In this case, it is the user's wallet address.
    /// @param root The root (returned by the IDKit widget).
    /// @param nullifierHash The nullifier hash for this proof, preventing double signaling (returned by the IDKit widget).
    /// @param proof The zero-knowledge proof that demonstrates the claimer is registered with World ID (returned by the IDKit widget).
    modifier verifyAndExecute(
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    )  {
        // First, we make sure this person hasn't done this before
        if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

        // We now verify the provided proof is valid and the user is verified by World ID
        IWorldIDRouter(RouterAddress).verifyProof(
            root,
            groupId, // set to "1" in the constructor
            abi.encodePacked(signal).hashToField(),
            nullifierHash,
            externalNullifierHash,
            proof
        );

        // We now record the user has done this, so they can't do it again (sybil-resistance)
        nullifierHashes[nullifierHash] = true;

        // Finally, execute your logic here, knowing the user is verified

        _;
    }

}
