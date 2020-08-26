const saltedSha256 = require("salted-sha256");
const moment = require("moment");
import fabricService from "./fabric-service";

//define orgs
const orgList: string[] = ["", "Org1MSP", "Org2MSP", "Org3MSP"];
//defind case interface
interface Icase {
  id: string;
  name: string;
  privateFor: string;
}
let list: Icase[];

//checklist function
function checkList(candidate: string) {
  for (let i = 0; i < orgList.length; i++) {
    if (orgList[i] == candidate) {
      return true;
    }
  }
  return false;
}

//get privateFor function
function getPrivateFor(caseid: string) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id == caseid) {
      return list[i].privateFor;
    }
  }
  return "";
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
async function getList(data: IcaseGetListParams) {
  if (!checkList(data.privateFor)) {
    data.privateFor = "";
  }
  if (!data.search) {
    data.search = "";
  }
  if (data.privateFor == "") {
    list = [];
    for (var i = 1; i < orgList.length; i++) {
      list = <Icase[]>(
        Object.assign(
          list,
          JSON.parse(
            (
              await fabricService.invokeChaincode("getCases", [orgList[i]])
            ).toString()
          )
        )
      );
    }
  } else {
    list = JSON.parse(
      (
        await fabricService.invokeChaincode("getCases", [data.privateFor])
      ).toString()
    );
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
  const caseid = await saltedSha256(
    data.name + data.description,
    moment(),
    true
  );
  const caseName = await Buffer.from(data.name);
  const description = await Buffer.from(data.description);
  await fabricService.invokeChaincode("createCase", [caseid, data.privateFor], {
    caseName,
    description,
  });
}

export default { orgList, getList, createCase, getPrivateFor };
