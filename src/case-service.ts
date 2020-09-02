const saltedSha256 = require("salted-sha256");
const moment = require("moment");
import fabricService from "./fabric-service";
import { promises } from "fs";
import { listenerCount } from "koa";

//define orgs
const orgList: string[] = ["", "Org1MSP", "Org2MSP", "Org3MSP"];
//defind case interface
interface Icase {
  caseId: string;
  caseName: string;
  privateFor: string;
}

async function test() {
  await fabricService.invokeChaincode("init", []);
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

async function invokeGetCases(member: string) {
  let tmpResult = await fabricService.invokeChaincode("getCases", [member]);
  let invokeResult: string;
  if (tmpResult) {
    invokeResult = tmpResult.invokeResult;
  } else {
    invokeResult = "[]";
  }
  return <Icase[]>JSON.parse(invokeResult);
}

//get privateFor function
async function getPrivateFor(caseId: string) {
  for (var i = 1; i < orgList.length; i++) {
    const caseList = <Icase[]>await invokeGetCases(orgList[i]);
    for (let j = 0; j < caseList.length; j++) {
      if (caseList[j].caseId == caseId) {
        return orgList[i];
      }
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
  let caseList: Icase[];
  if (!checkList(data.privateFor)) {
    data.privateFor = "";
  }
  if (!data.search) {
    data.search = "";
  }
  if (data.privateFor == "") {
    caseList = [];
    const getCases: Promise<Icase[]>[] = [];
    for (var i = 1; i < orgList.length; i++) {
      getCases.push(invokeGetCases(orgList[i]));
    }
    const orgCaseLists = await Promise.all(getCases);
    for (let j = 0; j < orgCaseLists.length; j++) {
      caseList = [...caseList, ...orgCaseLists[j]];
    }

    Object.assign(caseList, await invokeGetCases(orgList[i]))
  } else {
    caseList = <Icase[]>await invokeGetCases(data.privateFor);
  }
  let sorted_list = caseList.filter(function (item, index, array) {
    return (
      item.caseId.indexOf(data.search) !== -1 ||
      item.caseName.indexOf(data.search) !== -1
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
  caseName: string;
  privateFor: string;
  description: string;
}

//createcase function
async function createCase(data: IcreateCaseParams) {
  if (!checkList(data.privateFor)) {
    data.privateFor = "";
  }
  const caseId = await saltedSha256(
    data.caseName + data.description,
    moment(),
    true
  );
  const caseName = await Buffer.from(data.caseName);
  const description = await Buffer.from(data.description);
  await fabricService.invokeChaincode("createCase", [caseId, data.privateFor], {
    caseName,
    description,
  });
}

export default { orgList, getList, createCase, getPrivateFor, test };
