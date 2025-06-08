// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./libraries/MerkleTree.sol";
import "./libraries/NullifierRegistry.sol";

contract ShieldedVault is Ownable, ReentrancyGuard {
    using MerkleTree for bytes32;
    using NullifierRegistry for NullifierRegistry.Registry;

    IERC20 public immutable token;
    bytes32 public merkleRoot;
    NullifierRegistry.Registry private nullifierRegistry;

    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    event ShieldedTransfer(address indexed from, address indexed to, uint256 amount);
    event MerkleRootUpdated(bytes32 newRoot);

    constructor(address _token) {
        require(_token != address(0), "Invalid token address");
        token = IERC20(_token);
    }

    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit Deposit(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(token.transfer(msg.sender, amount), "Transfer failed");
        emit Withdrawal(msg.sender, amount);
    }

    function shieldedTransfer(
        uint256 amount,
        address recipient,
        bytes calldata proof
    ) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(recipient != address(0), "Invalid recipient");
        require(proof.length > 0, "Invalid proof");

        // Verify proof (placeholder for actual ZK verification)
        bytes32 currentRoot = merkleRoot;
        require(currentRoot != bytes32(0), "Merkle root not initialized");

        // Transfer tokens
        require(token.transfer(recipient, amount), "Transfer failed");
        emit ShieldedTransfer(msg.sender, recipient, amount);
    }

    function updateMerkleRoot(bytes32 newRoot) external onlyOwner {
        require(newRoot != bytes32(0), "Invalid merkle root");
        merkleRoot = newRoot;
        emit MerkleRootUpdated(newRoot);
    }

    function getNullifierStatus(bytes32 nullifier) external view returns (bool) {
        return NullifierRegistry.isSpent(nullifierRegistry, nullifier);
    }
} 