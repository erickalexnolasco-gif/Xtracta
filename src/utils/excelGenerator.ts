//src/utils/excelGenerator.ts
import * as XLSX from 'xlsx';

export const downloadExcel = (data: any[]) => {
  if (data.length === 0) return;

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Auditoría Xtracta");

  // Configuración de anchos: Mínimo 20, máximo 80 para que NADA se oculte
  const colWidths = Object.keys(data[0]).map((key) => {
    const maxChar = data.reduce((max, row) => {
      const len = row[key] ? String(row[key]).length : 0;
      return len > max ? len : max;
    }, key.length);
    
    // wch es el ancho en caracteres. Forzamos un mínimo de 20.
    return { wch: Math.min(Math.max(maxChar + 4, 20), 80) };
  });

  ws['!cols'] = colWidths;

  XLSX.writeFile(wb, `Auditoria_Fiscal_Xtracta_${Date.now()}.xlsx`);
};