const saltedSha256 = require("salted-sha256");
const moment = require("moment");
import * as fs from "fs";
import { Wallets, Gateway, GatewayOptions, Wallet } from "fabric-network";

async function test() {
  const connectionProfileJson = (
    await fs.readFileSync("./config/connectionprofile.json")
  ).toString();
  const connectionProfile = JSON.parse(connectionProfileJson);
  let pub = await fs.readFileSync("./config/Admin@org1.example.com-cert.pem");
  let priv = Buffer.from(await fs.readFileSync("./config/priv_sk"));
  const x509Identity = {
    credentials: {
      certificate: pub.toString(),
      privateKey: priv.toString(), //need to be bytestring
    },
    mspId: `org1MSP`,
    type: "X.509",
  };
  const wallet = await Wallets.newFileSystemWallet("./config/wallets");
  await wallet.put("admin", x509Identity);
  //const identity = await wallet.get('admin');
  //console.log(identity)
  const gatewayOptions: GatewayOptions = {
    wallet,
    identity: "admin", // Previously imported identity
  };
  const gateway = new Gateway();
  await gateway.connect(connectionProfile, gatewayOptions);
  try {
    // Obtain the smart contract with which our application wants to interact
    const network = await gateway.getNetwork("myc");
    const contract = network.getContract(
      "iovcases:082e3263a3888511c4186a2f4cf20c433315de3403853d809c1a45f3e37c8614"
    );

    // Submit transactions for the smart contract
    const args: string[] = [];
    const submitResult = await contract.submitTransaction("init", ...args);
    return submitResult;
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    process.exit(1);
  } finally {
    // Disconnect from the gateway peer when all work for this client identity is complete
    gateway.disconnect();
  }
}

//define orgs
const orgList: string[] = ["", "Org1", "Org2", "Org3"];
//defind case interface
interface Icase {
  id: string;
  name: string;
  privateFor: string;
}

//checklist function
function checkList(candidate: string) {
  for (let i = 0; i < orgList.length; i++) {
    if (orgList[i] == candidate) {
      return true;
    }
  }
  return false;
}

//define getlist parameters interface
interface IcaseGetListParams {
  privateFor: string;
  search: string;
}
//define getlist response interface
interface IcaseGetListResponse {
  privateFor: string;
  search: string;
  case_list: Icase[];
}

//getlist function
function getList(data: IcaseGetListParams) {
  if (!checkList(data.privateFor)) {
    data.privateFor = "";
  }
  if (!data.search) {
    data.search = "";
  }
  let sorted_list = list.filter(function (item, index, array) {
    return (
      (item.privateFor == data.privateFor || data.privateFor == "") &&
      (item.id.indexOf(data.search) !== -1 ||
        item.name.indexOf(data.search) !== -1)
    );
  });

  return <IcaseGetListResponse>{
    privateFor: data.privateFor,
    search: data.search,
    case_list: sorted_list,
  };
}

//define createcase parameters interface
interface IcreateCaseParams {
  name: string;
  privateFor: string;
  description: string;
}

//createcase function
async function createCase(data: IcreateCaseParams) {
  if (!checkList(data.privateFor)) {
    data.privateFor = "";
  }
  const id = await saltedSha256(data.name + data.description, moment(), true);
  console.log(id);
}

export default { getList, orgList, createCase, test };

let list: Icase[];
