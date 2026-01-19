import { useState } from 'react';
import { Upload, FileSpreadsheet, FileText, Trash2, Loader2, CheckCircle2 } from 'lucide-react';
import JSZip from 'jszip';
import { translate } from '../../utils/satCatalogs';
import { downloadExcel } from '../../utils/excelGenerator';
import { generateInvoicePDF } from '../../utils/pdfGenerator';

export default function XMLConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const parseXML = async (file: File) => {
    const text = await file.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    const getE = (n: string) => 
        xmlDoc.getElementsByTagName(n)[0] || 
        xmlDoc.getElementsByTagName(`cfdi:${n}`)[0] || 
        xmlDoc.getElementsByTagName(`tfd:${n}`)[0];

    const comp = getE("Comprobante");
    const emisor = getE("Emisor");
    const receptor = getE("Receptor");
    const timbre = getE("TimbreFiscalDigital");
    const relacionados = getE("CfdiRelacionados");

    // Datos del Timbre para el PDF
    const uuid = timbre?.getAttribute("UUID") || "N/A";
    const fTimbrado = timbre?.getAttribute("FechaTimbrado") || "N/A";
    const rpcCert = timbre?.getAttribute("RfcProvCertif") || "N/A";
    const sCFD = timbre?.getAttribute("SelloCFD") || "N/A";
    const nCertSAT = timbre?.getAttribute("NoCertificadoSAT") || "N/A";
    const sSAT = timbre?.getAttribute("SelloSAT") || "N/A";
    const tfdVersion = timbre?.getAttribute("Version") || "1.1";

    const cadenaOriginal = `||${tfdVersion}|${uuid}|${fTimbrado}|${rpcCert}|${sCFD}|${nCertSAT}||`;

    // Impuestos
    const traslados = xmlDoc.getElementsByTagName("cfdi:Traslado");
    const totalT = Array.from(traslados).reduce((acc, t) => acc + parseFloat(t.getAttribute("Importe") || "0"), 0);

    // Conceptos técnicos
    const conceptosRaw = Array.from(xmlDoc.getElementsByTagName("cfdi:Concepto")).map(c => ({
      Clave: c.getAttribute("ClaveProdServ"),
      Cant: c.getAttribute("Cantidad"),
      Unid: c.getAttribute("ClaveUnidad"),
      Desc: c.getAttribute("Descripcion"),
      ValU: c.getAttribute("ValorUnitario"),
      Imp: c.getAttribute("Importe")
    }));

    // OBJETO DE DATOS COMPLETO PARA PDF Y EXCEL
    const fullData = {
      version: comp?.getAttribute("Version"),
      uuid,
      fecha: comp?.getAttribute("Fecha"),
      serie: comp?.getAttribute("Serie") || "",
      folio: comp?.getAttribute("Folio") || "",
      tipo: translate("TipoDeComprobante", comp?.getAttribute("TipoDeComprobante")),
      metodo_pago: translate("MetodoPago", comp?.getAttribute("MetodoPago")),
      forma_pago: translate("FormaPago", comp?.getAttribute("FormaPago")),
      uso_cfdi: translate("UsoCFDI", receptor?.getAttribute("UsoCFDI")),
      exportacion: comp?.getAttribute("Exportacion") || "01",
      rfc_emisor: emisor?.getAttribute("Rfc"),
      nombre_emisor: emisor?.getAttribute("Nombre"),
      regimen_emisor: translate("RegimenFiscal", emisor?.getAttribute("RegimenFiscal")),
      lugar_exp: comp?.getAttribute("LugarExpedicion"),
      rfc_receptor: receptor?.getAttribute("Rfc"),
      nombre_receptor: receptor?.getAttribute("Nombre"),
      regimen_receptor: translate("RegimenFiscal", receptor?.getAttribute("RegimenFiscalReceptor")),
      cp_receptor: receptor?.getAttribute("DomicilioFiscalReceptor"),
      subtotal: parseFloat(comp?.getAttribute("SubTotal") || "0"),
      iva: totalT,
      total: parseFloat(comp?.getAttribute("Total") || "0"),
      moneda: comp?.getAttribute("Moneda"),
      sello: sCFD,
      conceptos_str: conceptosRaw.map(c => `[${c.Clave}] ${c.Desc}`).join(" | "),
      // Atributos adicionales para el diseño institucional
      fecha_cert: fTimbrado,
      cert_sat: nCertSAT,
      sello_sat: sSAT,
      cadena_original: cadenaOriginal
    };

    return {
      ...fullData,
      excel_row: {
        "UUID": uuid,
        "RFC Emisor": fullData.rfc_emisor,
        "Nombre Emisor": fullData.nombre_emisor,
        "Régimen Emisor": fullData.regimen_emisor,
        "LugarExp": fullData.lugar_exp,
        "RFC Receptor": fullData.rfc_receptor,
        "Nombre Receptor": fullData.nombre_receptor,
        "Método Pago": fullData.metodo_pago,
        "Forma Pago": fullData.forma_pago,
        "Total": fullData.total,
        "Conceptos": conceptosRaw.map(c => `Clave:${c.Clave}|Cant:${c.Cant}|Desc:${c.Desc}`).join(" ; ")
      }
    };
  };

  const handleExcel = async () => {
    setLoading(true);
    const data = await Promise.all(files.map(f => parseXML(f)));
    downloadExcel(data.map(d => d.excel_row));
    setLoading(false);
  };

  const handlePDF = async () => {
    setLoading(true);
    const zip = new JSZip();
    const data = await Promise.all(files.map(f => parseXML(f)));
    for (const item of data) {
      const pdfBlob = await generateInvoicePDF(item);
      zip.file(`${item.uuid}.pdf`, pdfBlob);
    }
    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = `Facturas_Xtracta_Pro.zip`;
    link.click();
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-gray-900 tracking-tighter">Xtracta <span className="text-blue-600">Pro Suite</span></h2>
        <p className="text-gray-500 mt-4 text-xl font-light tracking-tight">Análisis institucional de CFDI para auditoría fiscal.</p>
      </div>

      <div className="bg-white rounded-[3rem] border-2 border-dashed border-gray-300 p-20 text-center hover:border-blue-500 transition-all relative group shadow-sm">
        <input 
          type="file" multiple accept=".xml" 
          onChange={(e) => e.target.files && setFiles([...files, ...Array.from(e.target.files)])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
        />
        <Upload className="mx-auto w-16 h-16 text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-500" />
        <p className="text-2xl font-bold text-gray-900 tracking-tight">Suelta tus archivos aquí</p>
      </div>

      {files.length > 0 && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between mb-8 border-b pb-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500 w-6 h-6" />
              <span className="text-xl font-bold text-gray-800 tracking-tight">{files.length} Archivos cargados</span>
            </div>
            <button onClick={() => setFiles([])} className="text-red-500 font-bold hover:underline flex items-center gap-2">
              <Trash2 size={20} /> Limpiar lista
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <button onClick={handleExcel} disabled={loading} className="flex items-center justify-center gap-4 bg-green-600 text-white py-8 rounded-[2.5rem] font-bold text-2xl hover:bg-green-700 shadow-xl disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" /> : <FileSpreadsheet size={32} />} Excel de Auditoría
            </button>
            <button onClick={handlePDF} disabled={loading} className="flex items-center justify-center gap-4 bg-blue-600 text-white py-8 rounded-[2.5rem] font-bold text-2xl hover:bg-blue-700 shadow-xl disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" /> : <FileText size={32} />} Generar PDFs Pro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}