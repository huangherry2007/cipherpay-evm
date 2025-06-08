// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IRelayer.sol";
import "./interfaces/IShieldedVault.sol";

/**
 * @title Relayer
 * @dev Contract for handling meta-transactions and relayer fees
 */
contract Relayer is IRelayer, ReentrancyGuard, AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant RELAYER_ROLE = keccak256("RELAYER_ROLE");

    // The token used for relayer fees
    IERC20 public immutable feeToken;
    
    // The shielded vault contract
    IShieldedVault public immutable shieldedVault;
    
    // Base relayer fee
    uint256 public baseFee;
    
    // Minimum fee required for meta-transactions
    uint256 public minFee;
    
    // Maximum fee allowed for meta-transactions
    uint256 public maxFee;
    
    // Fee multiplier for complex transactions
    uint256 public feeMultiplier;
    
    // Fee divisor for scaling
    uint256 public constant FEE_DIVISOR = 10000;

    constructor(
        address _feeToken,
        address _shieldedVault,
        address _admin,
        uint256 _baseFee,
        uint256 _minFee,
        uint256 _maxFee,
        uint256 _feeMultiplier
    ) {
        feeToken = IERC20(_feeToken);
        shieldedVault = IShieldedVault(_shieldedVault);
        
        _setupRole(DEFAULT_ADMIN_ROLE, _admin);
        _setupRole(ADMIN_ROLE, _admin);
        
        baseFee = _baseFee;
        minFee = _minFee;
        maxFee = _maxFee;
        feeMultiplier = _feeMultiplier;
    }

    /**
     * @dev Submit a meta-transaction with a fee
     * @param metaTx The meta-transaction data
     * @param fee The fee amount
     */
    function submitMetaTransaction(
        bytes calldata metaTx,
        uint256 fee
    ) external nonReentrant override {
        require(hasRole(RELAYER_ROLE, msg.sender), "Caller is not a relayer");
        require(fee >= minFee, "Fee too low");
        require(fee <= maxFee, "Fee too high");
        
        // Calculate required fee based on transaction complexity
        uint256 requiredFee = calculateRequiredFee(metaTx);
        require(fee >= requiredFee, "Insufficient fee");

        // Transfer fee from relayer
        feeToken.safeTransferFrom(msg.sender, address(this), fee);
        
        // Submit the meta-transaction to the shielded vault
        shieldedVault.shieldedTransfer(metaTx, "");
        
        emit MetaTransactionSubmitted(msg.sender, metaTx, fee);
    }

    /**
     * @dev Calculate the required fee for a meta-transaction
     * @param metaTx The meta-transaction data
     */
    function calculateRequiredFee(bytes calldata metaTx) public view returns (uint256) {
        // Base fee
        uint256 fee = baseFee;
        
        // Add complexity-based fee
        fee += (metaTx.length * feeMultiplier) / FEE_DIVISOR;
        
        return fee;
    }

    /**
     * @dev Get the current relayer fee
     */
    function getRelayerFee() external view override returns (uint256) {
        return baseFee;
    }

    /**
     * @dev Update the base fee
     * @param newBaseFee The new base fee
     */
    function updateBaseFee(uint256 newBaseFee) external {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        require(newBaseFee >= minFee, "New base fee too low");
        require(newBaseFee <= maxFee, "New base fee too high");
        baseFee = newBaseFee;
    }

    /**
     * @dev Update the fee bounds
     * @param newMinFee The new minimum fee
     * @param newMaxFee The new maximum fee
     */
    function updateFeeBounds(uint256 newMinFee, uint256 newMaxFee) external {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        require(newMinFee <= newMaxFee, "Invalid fee bounds");
        minFee = newMinFee;
        maxFee = newMaxFee;
    }

    /**
     * @dev Update the fee multiplier
     * @param newFeeMultiplier The new fee multiplier
     */
    function updateFeeMultiplier(uint256 newFeeMultiplier) external {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        feeMultiplier = newFeeMultiplier;
    }

    /**
     * @dev Withdraw collected fees
     * @param amount The amount to withdraw
     * @param recipient The recipient address
     */
    function withdrawFees(uint256 amount, address recipient) external {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        require(recipient != address(0), "Invalid recipient");
        feeToken.safeTransfer(recipient, amount);
    }
} 