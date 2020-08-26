import * as fs from "fs";
import {
  Wallets,
  Gateway,
  GatewayOptions,
  Network,
  TransientMap,
} from "fabric-network";

const mspid = "Org1MSP";

async function invokeChaincode(
  transaction: string,
  args: string[],
  transient: TransientMap = {}
) {
  const connectionProfileJson = (
    await fs.readFileSync("./config/connectionprofile.json")
  ).toString();
  const connectionProfile = JSON.parse(connectionProfileJson);
  const wallet = await Wallets.newFileSystemWallet("./config/wallets");
  const gatewayOptions: GatewayOptions = {
    identity: mspid,
    wallet,
    discovery: { enabled: true, asLocalhost: false },
  };
  const gateway = new Gateway();
  await gateway.connect(connectionProfile, gatewayOptions);
  try {
    const network = await gateway.getNetwork("myc");
    const contract = network.getContract("iovcases");
    const invokeResult: Buffer = await contract
      .createTransaction(transaction)
      .setTransient(transient)
      .submit(...args);
    if (invokeResult) {
      return invokeResult.toString();
    } else {
      return "[]";
    }
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    process.exit(1);
  } finally {
    gateway.disconnect();
  }
}

export default { invokeChaincode };
