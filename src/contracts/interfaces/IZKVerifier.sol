// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface IZKVerifier {
    function verifyProof(bytes calldata proof, bytes32[] calldata publicSignals) external view returns (bool);
}
