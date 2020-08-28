import * as fs from "fs";
import {
  Wallets,
  Gateway,
  GatewayOptions,
  Network,
  TransientMap,
  Contract,
} from "fabric-network";

const mspid: string = process.env.sdkMspId || "Org1MSP";


let contract: Contract;
async function initGateway() {
  const connectionProfileJson = fs
    .readFileSync(`./config/connectionprofile-${mspid}.json`)
    .toString();
  const connectionProfile = JSON.parse(connectionProfileJson);
  const wallet = await Wallets.newFileSystemWallet("./config/wallets");
  const gatewayOptions: GatewayOptions = {
    identity: mspid,
    wallet,
    discovery: { enabled: false, asLocalhost: false },
  };
  const gateway = new Gateway();
  await gateway.connect(connectionProfile, gatewayOptions);
  const network = await gateway.getNetwork("myc");
  contract = network.getContract("iovcases");
}
initGateway();


interface invokeChaincodeResponse {
  invokeResult: string;
}
async function invokeChaincode(
  transaction: string,
  args: string[],
  transient: TransientMap = {}
) {
  try {
    const invokeResult = await contract
      .createTransaction(transaction)
      .setTransient(transient)
      .submit(...args);
    var result = "[]";
    if (invokeResult) {
      result = invokeResult.toString();
    }
    return <invokeChaincodeResponse>{ invokeResult: result };
  } catch (error) {
    console.error(
      `Failed to submit transaction: "${transaction}" with arguments: "${args}", transient: "${transient}",  error: "${error}"`
    );
  }
}

export default { invokeChaincode, mspid };
