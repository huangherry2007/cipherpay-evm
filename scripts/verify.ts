import { run } from "hardhat";
import { getEnvironmentConfig } from "../src/config/environments";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Starting contract verification...");

  // Get the current network
  const network = process.env.HARDHAT_NETWORK || "local";
  if (network === "local") {
    console.log("Skipping verification for local network");
    return;
  }

  const config = getEnvironmentConfig(network as any);
  console.log(`Verifying contracts on ${config.name} (${network})`);

  // Load deployment info
  const deploymentsDir = path.join(__dirname, "../deployments");
  const deploymentFile = path.join(deploymentsDir, `${network}.json`);
  if (!fs.existsSync(deploymentFile)) {
    throw new Error(`Deployment info not found for network ${network}`);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  console.log("Loaded deployment info:", deploymentInfo);

  try {
    // Verify ZKVerifier
    console.log("\nVerifying ZKVerifier...");
    await run("verify:verify", {
      address: deploymentInfo.zkVerifier,
      constructorArguments: [],
    });
    console.log("ZKVerifier verified successfully");

    // Verify ShieldedVault
    console.log("\nVerifying ShieldedVault...");
    await run("verify:verify", {
      address: deploymentInfo.shieldedVault,
      constructorArguments: [deploymentInfo.token],
    });
    console.log("ShieldedVault verified successfully");

    // Verify Relayer
    console.log("\nVerifying Relayer...");
    await run("verify:verify", {
      address: deploymentInfo.relayer,
      constructorArguments: [
        deploymentInfo.shieldedVault,
        deploymentInfo.zkVerifier,
      ],
    });
    console.log("Relayer verified successfully");

    // Update deployment info with verification status
    deploymentInfo.verified = true;
    deploymentInfo.verifiedAt = new Date().toISOString();
    fs.writeFileSync(
      deploymentFile,
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("\nUpdated deployment info with verification status");

  } catch (error) {
    console.error("Verification failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
