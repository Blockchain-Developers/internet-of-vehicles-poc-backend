const saltedSha256 = require("salted-sha256");
const moment = require("moment");

//define file interface
interface Ifile {
  id: string;
}

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
function getList(data: IfileGetListParams) {
  /*query chaincode get list*/
  if (!data.search) {
    data.search = "";
  }
  let sorted_list = list.filter(function (item, index, array) {
    return item.id.indexOf(data.search) !== -1;
  });

  return <IfileGetListResponse>{
    caseid: data.caseid,
    search: data.search,
    file_list: sorted_list,
  };
}

//newfile function
async function newFile(fileDataUrl: string) {
  const id = await saltedSha256(fileDataUrl, moment(), true);
  console.log(id);
}

//delete file function
async function deleteFile(fileid: string) {
  console.log(fileid);
}

export default { getList, newFile, deleteFile };

let list: Ifile[];