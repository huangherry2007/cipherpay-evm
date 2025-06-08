import { ethers } from "hardhat";
import { getEnvironmentConfig } from "../src/config/environments";
import { CONTRACT } from "../src/config/constants";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

async function main() {
  console.log("Starting deployment...");

  // Get the current network
  const network = process.env.HARDHAT_NETWORK || "local";
  const config = getEnvironmentConfig(network as any);
  console.log(`Deploying to ${config.name} (${network})`);

  // Get deployer account
  const [deployer] = await ethers.getSigners() as SignerWithAddress[];
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deploying with account: ${deployer.address}`);
  console.log(`Account balance: ${balance.toString()}`);

  // Deploy MockToken for testing (only on local and testnet)
  let tokenAddress = process.env.TOKEN_ADDRESS;
  if (network !== "mainnet" && !tokenAddress) {
    console.log("Deploying MockToken...");
    const MockToken = await ethers.getContractFactory("MockToken");
    const mockToken = await MockToken.deploy("Mock Token", "MTK");
    await mockToken.deployed();
    tokenAddress = mockToken.address;
    console.log(`MockToken deployed to: ${tokenAddress}`);
  }

  // Deploy ZKVerifier
  console.log("Deploying ZKVerifier...");
  const ZKVerifier = await ethers.getContractFactory("ZKVerifier");
  const zkVerifier = await ZKVerifier.deploy();
  await zkVerifier.deployed();
  console.log(`ZKVerifier deployed to: ${zkVerifier.address}`);

  // Deploy ShieldedVault
  console.log("Deploying ShieldedVault...");
  const ShieldedVault = await ethers.getContractFactory("ShieldedVault");
  const shieldedVault = await ShieldedVault.deploy(tokenAddress!);
  await shieldedVault.deployed();
  console.log(`ShieldedVault deployed to: ${shieldedVault.address}`);

  // Deploy Relayer
  console.log("Deploying Relayer...");
  const Relayer = await ethers.getContractFactory("Relayer");
  const relayer = await Relayer.deploy(shieldedVault.address, zkVerifier.address);
  await relayer.deployed();
  console.log(`Relayer deployed to: ${relayer.address}`);

  // Grant relayer role to Relayer contract
  console.log("Granting relayer role...");
  const relayerRole = await shieldedVault.RELAYER_ROLE();
  await shieldedVault.grantRole(relayerRole, relayer.address);
  console.log("Relayer role granted");

  // Save deployment info
  const deploymentInfo = {
    network: network,
    token: tokenAddress,
    zkVerifier: zkVerifier.address,
    shieldedVault: shieldedVault.address,
    relayer: relayer.address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  console.log("\nDeployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Save deployment info to file
  const fs = require("fs");
  const path = require("path");
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  fs.writeFileSync(
    path.join(deploymentsDir, `${network}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log(`\nDeployment info saved to deployments/${network}.json`);

  // Export environment variables for verification
  const envVars = {
    TOKEN_ADDRESS: tokenAddress,
    ZKVERIFIER_ADDRESS: zkVerifier.address,
    SHIELDED_VAULT_ADDRESS: shieldedVault.address,
    RELAYER_ADDRESS: relayer.address,
  };

  console.log("\nEnvironment variables for verification:");
  Object.entries(envVars).forEach(([key, value]) => {
    console.log(`export ${key}=${value}`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
