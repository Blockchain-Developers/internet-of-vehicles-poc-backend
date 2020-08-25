const saltedSha256 = require("salted-sha256");
const moment = require("moment");
import * as fs from "fs";
import { Wallets, Gateway, GatewayOptions, Wallet } from "fabric-network";

const mspid = "Org2MSP";

let list: Icase[];

async function test() {
  const connectionProfileJson = (
    await fs.readFileSync("./config/connectionprofile.json")
  ).toString();
  const connectionProfile = JSON.parse(connectionProfileJson);
  const wallet = await Wallets.newFileSystemWallet("./config/wallets");
  await wallet.get(mspid);
  const gatewayOptions: GatewayOptions = {
    identity: mspid,
    wallet,
  };
  const gateway = new Gateway();
  await gateway.connect(connectionProfile, gatewayOptions);
  try {
    const network = await gateway.getNetwork("myc");
    const contract = network.getContract("iovcases");
    const args: string[] = ["Org2MSP"];
    const submitResult = await contract.submitTransaction("getCases", ...args);
    console.log(submitResult);
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    process.exit(1);
  } finally {
    gateway.disconnect();
  }
}
test();

//define orgs
const orgList: string[] = ["", "Org1MSP", "Org2MSP", "Org3MSP"];
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
