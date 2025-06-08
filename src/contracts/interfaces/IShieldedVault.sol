// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;


interface IShieldedVault {
    event Deposit(address indexed sender, uint256 amount, bytes32 commitment);
    event Withdraw(address indexed recipient, uint256 amount, bytes32 nullifier);
    event ShieldedTransfer(bytes32 indexed nullifier, bytes32 indexed commitment, bytes32 merkleRoot);
    function deposit(uint256 amount, bytes32 commitment) external payable;
    function withdraw(uint256 amount, bytes32 nullifier, bytes32 merkleRoot, bytes calldata proof) external;
    function shieldedTransfer(bytes calldata metaTx, bytes calldata proof) external;
    function getMerkleRoot() external view returns (bytes32);
    function isNullifierSpent(bytes32 nullifier) external view returns (bool);
}
