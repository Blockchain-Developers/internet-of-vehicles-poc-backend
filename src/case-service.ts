export interface Icase {
  id: string;
  name: string;
};
function getlist() {
  let list: Icase[] = [];
  /*backend dev*******************************/
  list = [{
    'id': '6c5fbb245a1676ea5c05ae19c57fff9da90ceba32d54d25e2d2f68c30f5f5ba6',
    'name': 'Insurance No. 1109068880'
  },
  {
    'id': '42b5b323bf36aa80defc5cb0313cf4d8a3b88ad7ee2931c894465a532cce2964',
    'name': 'Insurance No. 8569266466'
  },
  {
    'id': '0684e25eafa300d7f3760857903b62b4beb3b7b0945c70ccc08514f88c080abf',
    'name': 'Accident  No. ABC1109068880'
  },
  {
    'id': 'def6352acf1543eb44d12487cbbcdcb6476dd2061a5689baa140102a23b5582c',
    'name': 'Insurance No. 9189253693'
  },
  {
    'id': '7c2453e005dedf806127caa20d23885d62d061e72683aa34771ca10b746c51d8',
    'name': 'Insurance No. 8008328101'
  },
  {
    'id': '1b5fc0c1c95a0b76bc2ed80d6ecc79ff68d468caf885044ed40c7165dda6ed4f',
    'name': 'Vehicle Insurance Payment 00001'
  }];
  /*******************************************/

  return list;
}
export default {getlist};
