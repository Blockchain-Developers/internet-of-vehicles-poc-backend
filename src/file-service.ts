const saltedSha256 = require("salted-sha256");
const moment = require("moment");
import fabricService from "./fabric-service";
import caseService from "./case-service";
//define file interface
interface Ifile {
  fileId: string;
}
let list: Ifile[];

//define getlist parameters interface
interface IfileGetListParams {
  caseId: string;
  search: string;
}
//defind getlist response interface
interface IfileGetListResponse {
  caseId: string;
  search: string;
  file_list: Ifile[];
}
//getlist function
async function getList(data: IfileGetListParams) {
  /*query chaincode get list*/
  if (!data.search) {
    data.search = "";
  }
  const privateFor = await caseService.getPrivateFor(data.caseId);
  list = JSON.parse(
    (
      await fabricService.invokeChaincode("getFileList", [
        data.caseId,
        privateFor,
      ])
    ).toString()
  );
  let sorted_list = list.filter(function (item, index, array) {
    return item.fileId.indexOf(data.search) !== -1;
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
  await fabricService.invokeChaincode("uploadFile", [
    data.caseId,
    fileId,
    privateFor,
  ]);
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
    data.caseId,
    data.fileId,
    privateFor,
  ]);
}

export default { getList, newFile, deleteFile };
