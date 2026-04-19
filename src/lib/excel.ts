/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as XLSX from 'xlsx';

/**
 * 导出数据到 Excel
 * @param data 要导出的数据数组
 * @param fileName 文件名
 * @param sheetName 工作表名称
 */
export const exportToExcel = (data: any[], fileName: string, sheetName: string = 'Sheet1') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // 生成 Excel 文件并触发下载
  XLSX.writeFile(workbook, `${fileName}_${new Date().toLocaleDateString()}.xlsx`);
};
