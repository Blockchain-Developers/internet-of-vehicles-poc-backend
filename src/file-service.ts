const saltedSha256 = require("salted-sha256");
const moment = require("moment");
import fabricService from "./fabric-service";
import caseService from "./case-service";
//define file interface
interface Ifile {
  id: string;
}
let list: Ifile[];

//define getlist parameters interface
interface IfileGetListParams {
  caseid: string;
  search: string;
}
//defind getlist response interface
interface IfileGetListResponse {
  caseid: string;
  search: string;
  file_list: Ifile[];
}
//getlist function
async function getList(data: IfileGetListParams) {
  /*query chaincode get list*/
  if (!data.search) {
    data.search = "";
  }
  const privateFor = await caseService.getPrivateFor(data.caseid);
  list = JSON.parse(
    (
      await fabricService.invokeChaincode("getFileList", [
        data.caseid,
        privateFor,
      ])
    ).toString()
  );
  let sorted_list = list.filter(function (item, index, array) {
    return item.id.indexOf(data.search) !== -1;
  });

  return <IfileGetListResponse>{
    caseid: data.caseid,
    search: data.search,
    file_list: sorted_list,
  };
}

//define newfile parameters interface
interface IfileNewFileParams {
  caseid: string;
}
//newfile function
async function newFile(data: IfileNewFileParams, fileDataUrl: string) {
  const fileid = await saltedSha256(fileDataUrl, moment(), true);
  const privateFor = await caseService.getPrivateFor(data.caseid);
  await fabricService.invokeChaincode("uploadFile", [
    data.caseid,
    fileid,
    privateFor,
  ]);
}

//define deletefile parameters interface
interface IfileDeleteFileParams {
  caseid: string;
  fileid: string;
}
//delete file function
async function deleteFile(data: IfileDeleteFileParams) {
  const privateFor = await caseService.getPrivateFor(data.caseid);
  await fabricService.invokeChaincode("deleteFile", [
    data.caseid,
    data.fileid,
    privateFor,
  ]);
}

export default { getList, newFile, deleteFile };
