import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

export default async function (deployer: Deployer, permission_contract) {
  const artifact = await deployer.loadArtifact("contracts/Profile.sol:Profile");
  const contract = await deployer.deploy(artifact, [permission_contract.address]);


  // Show the contract info.
  const contractAddress = contract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
  const chandle = await permission_contract.addSystemContract(contractAddress);
  await chandle.wait();
  console.log("Added system contract...");

  // Set a new user and read using getter
  const handle = await contract.newUser({
    username: 'alpine',
    pfp_link: "",
    operator_wallet: deployer.zkWallet.address,
    bio: "soon to be father"
  });
  await handle.wait();

  await(await contract.updateModeratorStatus('alpine', true)).wait();
  console.log("Set alpine as mod");

  console.log("Updated user object:", await contract.getUser('alpine'));

  return contract
}