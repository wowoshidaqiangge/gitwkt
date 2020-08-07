import { isArray } from 'jquery';

export function export2Excel(columns, list, excelname) {
  require.ensure([], () => {
    const { export_json_to_excel } = require('../excel/Export2Excel');
    let tHeader = [];
    let filterVal = [];
    console.log(columns);
    if (!columns) {
      return;
    }
    columns.forEach(item => {
      tHeader.push(item.label);
      filterVal.push(item.prop);
    });
    const data = list.map(v => filterVal.map(j => v[j]));
    export_json_to_excel(tHeader, data, excelname);
  });
}
// 对应  第三级head  数据列表  表格名称  数据对应字段 一级头  二级头  合并表格
export function export2Excel1(columns, list, excelname, filterVal1, multiHeader, multiHeader2, merges) {
  require.ensure([], () => {
    const { export_json_to_excel1 } = require('../excel/Export2Excel');
    let tHeader = [];
    let filterVal = filterVal1;
    console.log(columns);
    if (!columns) {
      return;
    }
    // columns.forEach(item => {
    //     tHeader.push(item.label);
    //     filterVal.push(item.prop);
    // });
    const data = list.map(v => filterVal.map(j => v[j]));
    export_json_to_excel1({
      multiHeader,
      multiHeader2,
      header: columns,
      data,
      filename: excelname,
      merges
    });
  });
}

const multiHeader = [
  [
    '加工内容',
    '',
    '派工人员',
    '派工日期',
    '设备编号',
    '工作人员',
    '结算方式',
    '计时工价',
    '派件数量',
    '质量检验结果(件)',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  ]
];

const multiHeader2 = [
  [
    '工种',
    '工序',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '工废',
    '料废',
    '让步工H',
    '降级工C',
    '让步料H',
    '降级料C',
    '合格P',
    '补',
    '首检',
    '',
    '巡检',
    '完检',
    'CPK值',
    '完成时间'
  ]
];
const tHeader = [
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '班组长',
  '检验员',
  '',
  '',
  '',
  ''
];

const merges = [
  'A1:B1',
  'C1:C3',
  'D1:D3',
  'E1:E3',
  'F1:F3',
  'G1:G3',
  'H1:H3',
  'I1:I3',
  'J1:W1',
  'A2:A3',
  'B2:B3',
  'J2:J3',
  'K2:K3',
  'L2:L3',
  'M2:M3',
  'N2:N3',
  'O2:O3',
  'P2:P3',
  'Q2:Q3',
  'R2:S2',
  'T2:T3',
  'U2:U3',
  'V2:V3',
  'W2:W3'
];
export { multiHeader, multiHeader2, tHeader, merges };
export function handle(res) {
  let index1 = 0;
  if (Array.isArray(res)) {
    return res.map((item, index) => {
      if (item.accountType == 1) {
        item.accountType1 = '计件';
      } else if (item.accountType == 2) {
        item.accountType1 = '计时';
      } else if (item.accountType == 3) {
        item.accountType1 = '计件和计时';
      }
      if (item.taskNumber) {
        if (item.taskNumber.indexOf('#') != -1) {
          if (!index1 || item.taskNumber.substring(item.taskNumber.length - 1) == 1) {
            index1 = index1 + 1;
          }
          item.index = index1 + '-' + item.taskNumber.substring(item.taskNumber.length - 1);
          item.disabled = true;
        } else {
          item.index = index1 + 1;
          index1 = index1 + 1;
        }
      } else {
        item.index = index1 + 1;
        index1 = index1 + 1;
      }

      if (item.createUser && item.createUser.split(':')[1]) {
        item.createUser = JSON.parse(item.createUser.split(':')[1]);
      }
      if (item.firstcheckSquadUser && item.firstcheckSquadUser.split(':')[1]) {
        item.firstcheckSquadUser = JSON.parse(item.firstcheckSquadUser.split(':')[1]);
      }
      if (item.firstcheckExamUser && item.firstcheckExamUser.split(':')[1]) {
        item.firstcheckExamUser = JSON.parse(item.firstcheckExamUser.split(':')[1]);
      }
      if (item.secondcheckaExamUser && item.secondcheckaExamUser.split(':')[1]) {
        item.secondcheckaExamUser = JSON.parse(item.secondcheckaExamUser.split(':')[1]);
      }
      if (item.finishcheckExamUser && item.finishcheckExamUser.split(':')[1]) {
        item.finishcheckExamUser = JSON.parse(item.finishcheckExamUser.split(':')[1]);
      }
    });
  }
}
export function sessionSetStore(name, content) {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.sessionStorage.setItem(name, content);
}

export function sessionGetStore(name) {
  if (!name) return;
  return window.sessionStorage.getItem(name);
}

export function sessionRemoveStore(name) {
  if (!name) return;
  window.sessionStorage.removeItem(name);
}

export const debounce = (fn, delay) => {
  let timer = null;
  return function() {
    if (timer) {
      clearTimeout(timer);
    } else {
      timer = setTimeout(fn, delay);
    }
  };
};
// 修改下载文件名称
export function getBlob(url) {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      }
    };
    xhr.send();
  });
}
// 修改下载文件名称
export function saveAs(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement('a');
    var body = document.querySelector('body');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    // fix Firefox
    link.style.display = 'none';
    body.appendChild;
    link.click();
    body.removeChild;
    window.URL.revokeObjectURL(link.href);
  }
}

// 判断值是否空（多个空格也算空）
export function isEmpty(val) {
  if (typeof val === 'undefined' || val == null || val.trim() == '') {
    return true;
  } else {
    return false;
  }
}
