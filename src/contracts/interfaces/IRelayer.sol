// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;


interface IRelayer {
    event MetaTransactionSubmitted(address indexed relayer, bytes metaTx, uint256 fee);

    function submitMetaTransaction(bytes calldata metaTx, uint256 fee) external;
    function getRelayerFee() external view returns (uint256); 
}
