const saltedSha256 = require("salted-sha256");
const moment = require("moment");
import fabricService from "./fabric-service";

//define orgs
const orgList: string[] = ["", "Org1MSP", "Org2MSP", "Org3MSP"];
//defind case interface
interface Icase {
  caseId: string;
  caseName: string;
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

//get privateFor function
async function getPrivateFor(caseId: string) {
  let caseList: Icase[] = [];
  for (var i = 1; i < orgList.length; i++) {
    caseList = <Icase[]>(
      Object.assign(
        caseList,
        JSON.parse(
          (
            await fabricService.invokeChaincode("getCases", [orgList[i]])
          )
        )
      )
    );
  }
  for (let i = 0; i < caseList.length; i++) {
    if (caseList[i].caseId == caseId) {
      return caseList[i].privateFor;
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
    for (var i = 1; i < orgList.length; i++) {
      caseList = <Icase[]>(
        Object.assign(
          caseList,
          JSON.parse(
            (
              await fabricService.invokeChaincode("getCases", [orgList[i]])
            )
          )
        )
      );
    }
  } else {
    caseList = JSON.parse(
      (
        await fabricService.invokeChaincode("getCases", [data.privateFor])
      )
    );
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

export default { orgList, getList, createCase, getPrivateFor };
