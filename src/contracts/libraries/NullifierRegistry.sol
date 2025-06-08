// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/**
 * @title NullifierRegistry
 * @dev Library for managing nullifiers and preventing double-spends
 */
library NullifierRegistry {
    // Error messages
    error NullifierAlreadySpent();
    error InvalidNullifier();
    error RegistryFull();

    // Maximum number of nullifiers that can be stored
    uint256 public constant MAX_NULLIFIERS = 1000000;

    // Struct to store nullifier data
    struct NullifierData {
        bool isSpent;
        uint256 timestamp;
        address owner;
    }

    // Struct to store registry state
    struct Registry {
        mapping(bytes32 => NullifierData) nullifiers;
        uint256 count;
    }

    /**
     * @dev Register a nullifier
     * @param registry The registry to use
     * @param nullifier The nullifier to register
     * @param owner The owner of the nullifier
     */
    function register(
        Registry storage registry,
        bytes32 nullifier,
        address owner
    ) internal {
        if (nullifier == bytes32(0)) revert InvalidNullifier();
        if (registry.count >= MAX_NULLIFIERS) revert RegistryFull();
        if (registry.nullifiers[nullifier].isSpent) revert NullifierAlreadySpent();

        registry.nullifiers[nullifier] = NullifierData({
            isSpent: true,
            timestamp: block.timestamp,
            owner: owner
        });

        registry.count++;
    }

    /**
     * @dev Check if a nullifier has been spent
     * @param registry The registry to check
     * @param nullifier The nullifier to check
     * @return bool Whether the nullifier has been spent
     */
    function isSpent(
        Registry storage registry,
        bytes32 nullifier
    ) internal view returns (bool) {
        return registry.nullifiers[nullifier].isSpent;
    }

    /**
     * @dev Get nullifier data
     * @param registry The registry to query
     * @param nullifier The nullifier to get data for
     * @return NullifierData The nullifier data
     */
    function getNullifierData(
        Registry storage registry,
        bytes32 nullifier
    ) internal view returns (NullifierData memory) {
        return registry.nullifiers[nullifier];
    }

    /**
     * @dev Batch register multiple nullifiers
     * @param registry The registry to use
     * @param nullifiers Array of nullifiers to register
     * @param owner The owner of the nullifiers
     */
    function batchRegister(
        Registry storage registry,
        bytes32[] calldata nullifiers,
        address owner
    ) internal {
        for (uint256 i = 0; i < nullifiers.length; i++) {
            register(registry, nullifiers[i], owner);
        }
    }

    /**
     * @dev Batch check multiple nullifiers
     * @param registry The registry to check
     * @param nullifiers Array of nullifiers to check
     * @return bool[] Array of whether each nullifier has been spent
     */
    function batchCheck(
        Registry storage registry,
        bytes32[] calldata nullifiers
    ) internal view returns (bool[] memory) {
        bool[] memory results = new bool[](nullifiers.length);
        for (uint256 i = 0; i < nullifiers.length; i++) {
            results[i] = isSpent(registry, nullifiers[i]);
        }
        return results;
    }

    /**
     * @dev Get the total number of registered nullifiers
     * @param registry The registry to query
     * @return uint256 The total number of registered nullifiers
     */
    function getCount(
        Registry storage registry
    ) internal view returns (uint256) {
        return registry.count;
    }

    /**
     * @dev Check if the registry is full
     * @param registry The registry to check
     * @return bool Whether the registry is full
     */
    function isFull(
        Registry storage registry
    ) internal view returns (bool) {
        return registry.count >= MAX_NULLIFIERS;
    }

    /**
     * @dev Get the remaining capacity of the registry
     * @param registry The registry to query
     * @return uint256 The remaining capacity
     */
    function getRemainingCapacity(
        Registry storage registry
    ) internal view returns (uint256) {
        return MAX_NULLIFIERS - registry.count;
    }
}
