const saltedSha256 = require("salted-sha256");
const moment = require("moment");
import fabricService from "./fabric-service";
import caseService from "./case-service";
//define file interface
interface Ifile {
  fileId: string;
}

//define getlist parameters interface
interface IfileGetListParams {
  caseId: string;
  search: string;
}
//defind getlist response interface
interface IfileGetListResponse {
  caseId: string;
  search: string;
  file_list: string[];
}
//getlist function
async function getList(data: IfileGetListParams) {
  /*query chaincode get fileList*/
  if (!data.search) {
    data.search = "";
  }
  const privateFor = await caseService.getPrivateFor(data.caseId);

  let tmpResult = await fabricService.invokeChaincode("getFileList", [
    data.caseId,
    privateFor,
  ]);

  let invokeResult: string;
  if (tmpResult) {
    invokeResult = tmpResult.invokeResult;
  } else {
    invokeResult = "[]";
  }
  let fileList: string[] = JSON.parse(invokeResult);

  let sorted_list = fileList.filter(function (item, index, array) {
    return item.indexOf(data.search) !== -1;
  });

  return <IfileGetListResponse>{
    caseId: data.caseId,
    search: data.search,
    file_list: sorted_list,
  };
}

//define newfile parameters interface
interface IfileNewFileParams {
  caseId: string;
}
//newfile function
async function newFile(data: IfileNewFileParams, fileDataUrl: string) {
  const fileId = await saltedSha256(fileDataUrl, moment(), true);
  const privateFor = await caseService.getPrivateFor(data.caseId);
  const fileBase64 = await Buffer.from(fileDataUrl);
  await fabricService.invokeChaincode(
    "uploadFile",
    [data.caseId, fileId, privateFor],
    { fileBase64 }
  );
}

//define deletefile parameters interface
interface IfileDeleteFileParams {
  caseId: string;
  fileId: string;
}
//delete file function
async function deleteFile(data: IfileDeleteFileParams) {
  const privateFor = await caseService.getPrivateFor(data.caseId);
  await fabricService.invokeChaincode("deleteFile", [
    data.fileId,
    privateFor,
  ]);
}

//define viewfile parameters interface
interface IfileViewFileParams {
  caseId: string;
  fileId: string;
}
//delete file function
async function viewFile(data: IfileViewFileParams) {
  const privateFor = await caseService.getPrivateFor(data.caseId);
  let tmpResult = await fabricService.invokeChaincode("getFile", [
    data.fileId,
    privateFor,
  ]);
  if (!!tmpResult) {
    return <string>tmpResult.invokeResult;
  } else {
    return null;
  }
}

export default { getList, newFile, deleteFile };
