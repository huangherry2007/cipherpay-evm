// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/**
 * @title MerkleTree
 * @dev Library for managing merkle tree operations
 */
library MerkleTree {
    // Maximum tree depth
    uint256 public constant MAX_DEPTH = 32;
    
    // Error messages
    error InvalidDepth();
    error InvalidIndex();
    error InvalidProof();
    error InvalidLeaf();

    /**
     * @dev Calculate the merkle root from a leaf and a proof
     * @param leaf The leaf node
     * @param proof The merkle proof
     * @param index The index of the leaf
     * @return bytes32 The calculated merkle root
     */
    function calculateRoot(
        bytes32 leaf,
        bytes32[] calldata proof,
        uint256 index
    ) internal pure returns (bytes32) {
        if (proof.length > MAX_DEPTH) revert InvalidDepth();
        if (index >= (1 << proof.length)) revert InvalidIndex();

        bytes32 computedHash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (index % 2 == 0) {
                // Left sibling
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                // Right sibling
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }

            index = index / 2;
        }

        return computedHash;
    }

    /**
     * @dev Verify a merkle proof
     * @param root The merkle root
     * @param leaf The leaf node
     * @param proof The merkle proof
     * @param index The index of the leaf
     * @return bool Whether the proof is valid
     */
    function verify(
        bytes32 root,
        bytes32 leaf,
        bytes32[] calldata proof,
        uint256 index
    ) internal pure returns (bool) {
        if (proof.length > MAX_DEPTH) revert InvalidDepth();
        if (index >= (1 << proof.length)) revert InvalidIndex();
        if (leaf == bytes32(0)) revert InvalidLeaf();

        bytes32 computedRoot = calculateRoot(leaf, proof, index);
        return computedRoot == root;
    }

    /**
     * @dev Calculate the next root after inserting a leaf
     * @param currentRoot The current merkle root
     * @param leaf The new leaf to insert
     * @param index The index where to insert the leaf
     * @param siblings The siblings needed for the update
     * @return bytes32 The new merkle root
     */
    function insert(
        bytes32 currentRoot,
        bytes32 leaf,
        uint256 index,
        bytes32[] calldata siblings
    ) internal pure returns (bytes32) {
        if (siblings.length > MAX_DEPTH) revert InvalidDepth();
        if (index >= (1 << siblings.length)) revert InvalidIndex();
        if (leaf == bytes32(0)) revert InvalidLeaf();

        bytes32 computedHash = leaf;

        for (uint256 i = 0; i < siblings.length; i++) {
            bytes32 sibling = siblings[i];

            if (index % 2 == 0) {
                // Left sibling
                computedHash = keccak256(abi.encodePacked(computedHash, sibling));
            } else {
                // Right sibling
                computedHash = keccak256(abi.encodePacked(sibling, computedHash));
            }

            index = index / 2;
        }

        return computedHash;
    }

    /**
     * @dev Calculate the index of a leaf in the tree
     * @param leaf The leaf to find
     * @param tree The merkle tree
     * @return uint256 The index of the leaf, or type(uint256).max if not found
     */
    function findLeafIndex(
        bytes32 leaf,
        bytes32[] calldata tree
    ) internal pure returns (uint256) {
        for (uint256 i = 0; i < tree.length; i++) {
            if (tree[i] == leaf) {
                return i;
            }
        }
        return type(uint256).max;
    }

    /**
     * @dev Get the siblings needed for a proof at a given index
     * @param index The index to get siblings for
     * @param tree The merkle tree
     * @return bytes32[] The siblings needed for the proof
     */
    function getSiblings(
        uint256 index,
        bytes32[] calldata tree
    ) internal pure returns (bytes32[] memory) {
        if (index >= tree.length) revert InvalidIndex();

        uint256 depth = 0;
        uint256 temp = tree.length;
        while (temp > 1) {
            temp = temp / 2;
            depth++;
        }

        bytes32[] memory siblings = new bytes32[](depth);
        uint256 currentIndex = index;

        for (uint256 i = 0; i < depth; i++) {
            uint256 siblingIndex = currentIndex % 2 == 0 ? currentIndex + 1 : currentIndex - 1;
            if (siblingIndex < tree.length) {
                siblings[i] = tree[siblingIndex];
            }
            currentIndex = currentIndex / 2;
        }

        return siblings;
    }
}
