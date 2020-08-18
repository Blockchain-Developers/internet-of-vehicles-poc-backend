const saltedSha256 = require("salted-sha256");
const moment = require("moment");

export interface Ifile {
  id: string;
}

function getList(fileid: string) {
  return list;
}

async function newFile(fileDataUrl: string) {
  const id = await saltedSha256(fileDataUrl, moment(), true);
  console.log(id)
}

async function deleteFile(fileid: string) {
  console.log(fileid)
}

export default { getList, newFile, deleteFile };

/*************************************************************************/
/*                               DEV                                     */
/*************************************************************************/
let list: Ifile[] = [
  {
    id: "6c5fbb245a1676ea5c05ae19c57fff9da90ceba32d54d25e2d2f68c30f5f5ba6",
  },
  {
    id: "42b5b323bf36aa80defc5cb0313cf4d8a3b88ad7ee2931c894465a532cce2964",
  },
  {
    id: "0684e25eafa300d7f3760857903b62b4beb3b7b0945c70ccc08514f88c080abf",
  },
  {
    id: "def6352acf1543eb44d12487cbbcdcb6476dd2061a5689baa140102a23b5582c",
  },
  {
    id: "7c2453e005dedf806127caa20d23885d62d061e72683aa34771ca10b746c51d8",
  },
  {
    id: "1b5fc0c1c95a0b76bc2ed80d6ecc79ff68d468caf885044ed40c7165dda6ed4f",
  },
];
/*************************************************************************/
/*************************************************************************/
/*************************************************************************/
