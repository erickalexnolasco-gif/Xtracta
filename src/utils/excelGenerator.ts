// src/utils/excelGenerator.ts
// Using ExcelJS instead of xlsx (SheetJS) for better security and maintenance

import ExcelJS from 'exceljs';

export const downloadExcel = async (data: any[]) => {
  if (data.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Auditoría Xtracta');

  // Define columns from the first data object
  const columns = Object.keys(data[0]).map((key) => ({
    header: key,
    key: key,
    width: Math.min(Math.max(key.length + 5, 15), 50),
  }));
  worksheet.columns = columns;

  // Style header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0071E3' },
  };
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  // Add data rows
  data.forEach((row) => {
    worksheet.addRow(row);
  });

  // Auto-fit columns based on content
  worksheet.columns.forEach((column) => {
    if (column.eachCell) {
      let maxLength = column.header?.toString().length || 10;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value?.toString() || '';
        maxLength = Math.max(maxLength, cellValue.length);
      });
      column.width = Math.min(Math.max(maxLength + 2, 12), 60);
    }
  });

  // Generate and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Auditoria_Fiscal_Xtracta_${Date.now()}.xlsx`;
  link.click();
};
