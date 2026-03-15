import { useState, useCallback, useMemo } from 'react';
import JSZip from 'jszip';
import { translate } from '../../utils/satCatalogs';
import { downloadExcel } from '../../utils/excelGenerator';
import { generateInvoicePDF } from '../../utils/pdfGenerator';
import { motion, AnimatePresence } from 'framer-motion';

interface ParsedFile {
  id: string;
  fileName: string;
  tipo: string;
  tipoRaw: string;
  version: string;
  uuid: string;
  fecha: string;
  subtotal: number;
  iva: number;
  total: number;
  status: 'ready' | 'processing' | 'error';
  errorMessage?: string;
  fullData: any;
}

export default function XMLConverter() {
  const [files, setFiles] = useState<ParsedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Calculate totals
  const totals = useMemo(() => {
    const readyFiles = files.filter(f => f.status === 'ready');
    return {
      count: readyFiles.length,
      subtotal: readyFiles.reduce((acc, f) => acc + f.subtotal, 0),
      iva: readyFiles.reduce((acc, f) => acc + f.iva, 0),
      total: readyFiles.reduce((acc, f) => acc + f.total, 0),
    };
  }, [files]);

  const parseXML = async (file: File): Promise<ParsedFile> => {
    const id = `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const text = await file.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');

      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        return {
          id,
          fileName: file.name,
          tipo: 'Error',
          tipoRaw: '',
          version: '',
          uuid: '',
          fecha: '',
          subtotal: 0,
          iva: 0,
          total: 0,
          status: 'error',
          errorMessage: 'XML inválido',
          fullData: null,
        };
      }

      const getE = (n: string) =>
        xmlDoc.getElementsByTagName(n)[0] ||
        xmlDoc.getElementsByTagName(`cfdi:${n}`)[0] ||
        xmlDoc.getElementsByTagName(`tfd:${n}`)[0];

      const comp = getE('Comprobante');
      const emisor = getE('Emisor');
      const receptor = getE('Receptor');
      const timbre = getE('TimbreFiscalDigital');

      if (!comp) {
        return {
          id,
          fileName: file.name,
          tipo: 'Error',
          tipoRaw: '',
          version: '',
          uuid: '',
          fecha: '',
          subtotal: 0,
          iva: 0,
          total: 0,
          status: 'error',
          errorMessage: 'No es un CFDI válido',
          fullData: null,
        };
      }

      const uuid = timbre?.getAttribute('UUID') || 'N/A';
      const fTimbrado = timbre?.getAttribute('FechaTimbrado') || 'N/A';
      const rpcCert = timbre?.getAttribute('RfcProvCertif') || 'N/A';
      const sCFD = timbre?.getAttribute('SelloCFD') || 'N/A';
      const nCertSAT = timbre?.getAttribute('NoCertificadoSAT') || 'N/A';
      const sSAT = timbre?.getAttribute('SelloSAT') || 'N/A';
      const tfdVersion = timbre?.getAttribute('Version') || '1.1';
      const cadenaOriginal = `||${tfdVersion}|${uuid}|${fTimbrado}|${rpcCert}|${sCFD}|${nCertSAT}||`;

      const traslados = xmlDoc.getElementsByTagName('cfdi:Traslado');
      const totalT = Array.from(traslados).reduce(
        (acc, t) => acc + parseFloat(t.getAttribute('Importe') || '0'),
        0
      );

      const conceptosRaw = Array.from(xmlDoc.getElementsByTagName('cfdi:Concepto')).map((c) => ({
        Clave: c.getAttribute('ClaveProdServ'),
        Cant: c.getAttribute('Cantidad'),
        Unid: c.getAttribute('ClaveUnidad'),
        Desc: c.getAttribute('Descripcion'),
        ValU: c.getAttribute('ValorUnitario'),
        Imp: c.getAttribute('Importe'),
      }));

      const tipoRaw = comp?.getAttribute('TipoDeComprobante') || '';
      const version = comp?.getAttribute('Version') || '4.0';

      const fullData = {
        version,
        uuid,
        fecha: comp?.getAttribute('Fecha'),
        serie: comp?.getAttribute('Serie') || '',
        folio: comp?.getAttribute('Folio') || '',
        tipo: translate('TipoDeComprobante', tipoRaw),
        metodo_pago: translate('MetodoPago', comp?.getAttribute('MetodoPago')),
        forma_pago: translate('FormaPago', comp?.getAttribute('FormaPago')),
        uso_cfdi: translate('UsoCFDI', receptor?.getAttribute('UsoCFDI')),
        exportacion: comp?.getAttribute('Exportacion') || '01',
        rfc_emisor: emisor?.getAttribute('Rfc'),
        nombre_emisor: emisor?.getAttribute('Nombre'),
        regimen_emisor: translate('RegimenFiscal', emisor?.getAttribute('RegimenFiscal')),
        lugar_exp: comp?.getAttribute('LugarExpedicion'),
        rfc_receptor: receptor?.getAttribute('Rfc'),
        nombre_receptor: receptor?.getAttribute('Nombre'),
        regimen_receptor: translate('RegimenFiscal', receptor?.getAttribute('RegimenFiscalReceptor')),
        cp_receptor: receptor?.getAttribute('DomicilioFiscalReceptor'),
        subtotal: parseFloat(comp?.getAttribute('SubTotal') || '0'),
        iva: totalT,
        total: parseFloat(comp?.getAttribute('Total') || '0'),
        moneda: comp?.getAttribute('Moneda'),
        sello: sCFD,
        conceptos_str: conceptosRaw.map((c) => `[${c.Clave}] ${c.Desc}`).join(' | '),
        fecha_cert: fTimbrado,
        cert_sat: nCertSAT,
        sello_sat: sSAT,
        cadena_original: cadenaOriginal,
        excel_row: {
          UUID: uuid,
          'RFC Emisor': emisor?.getAttribute('Rfc'),
          'Nombre Emisor': emisor?.getAttribute('Nombre'),
          'Régimen Emisor': translate('RegimenFiscal', emisor?.getAttribute('RegimenFiscal')),
          'Lugar Exp': comp?.getAttribute('LugarExpedicion'),
          'RFC Receptor': receptor?.getAttribute('Rfc'),
          'Nombre Receptor': receptor?.getAttribute('Nombre'),
          'Método Pago': translate('MetodoPago', comp?.getAttribute('MetodoPago')),
          'Forma Pago': translate('FormaPago', comp?.getAttribute('FormaPago')),
          'Tipo Comprobante': translate('TipoDeComprobante', tipoRaw),
          Subtotal: parseFloat(comp?.getAttribute('SubTotal') || '0'),
          IVA: totalT,
          Total: parseFloat(comp?.getAttribute('Total') || '0'),
          Moneda: comp?.getAttribute('Moneda'),
          Fecha: comp?.getAttribute('Fecha'),
        },
      };

      return {
        id,
        fileName: file.name,
        tipo: translate('TipoDeComprobante', tipoRaw),
        tipoRaw,
        version,
        uuid,
        fecha: comp?.getAttribute('Fecha') || '',
        subtotal: fullData.subtotal,
        iva: fullData.iva,
        total: fullData.total,
        status: 'ready',
        fullData,
      };
    } catch (error) {
      return {
        id,
        fileName: file.name,
        tipo: 'Error',
        tipoRaw: '',
        version: '',
        uuid: '',
        fecha: '',
        subtotal: 0,
        iva: 0,
        total: 0,
        status: 'error',
        errorMessage: 'Error al procesar archivo',
        fullData: null,
      };
    }
  };

  const handleFiles = useCallback(async (newFiles: File[]) => {
    const xmlFiles = newFiles.filter((f) => f.name.toLowerCase().endsWith('.xml'));
    if (xmlFiles.length === 0) return;

    // Add files as processing
    const processingFiles: ParsedFile[] = xmlFiles.map((f) => ({
      id: `${f.name}-${Date.now()}`,
      fileName: f.name,
      tipo: '',
      tipoRaw: '',
      version: '',
      uuid: '',
      fecha: '',
      subtotal: 0,
      iva: 0,
      total: 0,
      status: 'processing' as const,
      fullData: null,
    }));

    setFiles((prev) => [...prev, ...processingFiles]);

    // Parse files
    const parsedFiles = await Promise.all(xmlFiles.map(parseXML));

    setFiles((prev) => {
      const newState = prev.filter((f) => !processingFiles.some((pf) => pf.id === f.id));
      return [...newState, ...parsedFiles];
    });
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

  const handleExcel = async () => {
    setLoading(true);
    try {
      const readyFiles = files.filter((f) => f.status === 'ready' && f.fullData);
      await downloadExcel(readyFiles.map((f) => f.fullData.excel_row));
    } catch (error) {
      console.error('Error generating Excel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = async () => {
    setLoading(true);
    try {
      const zip = new JSZip();
      const readyFiles = files.filter((f) => f.status === 'ready' && f.fullData);
      
      for (const item of readyFiles) {
        const pdfBlob = await generateInvoicePDF(item.fullData);
        zip.file(`${item.uuid}.pdf`, pdfBlob);
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `Facturas_Xtracta_${Date.now()}.zip`;
      link.click();
    } catch (error) {
      console.error('Error generating PDFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const readyCount = files.filter((f) => f.status === 'ready').length;

  return (
    <div className="min-h-screen" data-testid="xml-converter">
      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 pb-40">
        {/* Header */}
        <header className="mb-12 pt-8">
          <h1 className="text-4xl md:text-[48px] font-bold tracking-tight text-[#1d1d1f] mb-2">
            Convertidor de CFDI - XML a PDF y Excel
          </h1>
          <p className="text-[17px] text-[#86868b] font-medium max-w-3xl">
            Convierte tus comprobantes fiscales digitales de XML a PDF o Excel de forma masiva, segura y rápida.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                relative rounded-[2.5rem] p-12 md:p-16 flex flex-col items-center text-center
                border-2 border-dashed transition-all duration-300 cursor-pointer
                bg-white/70 backdrop-blur-xl
                shadow-[0_8px_32px_rgba(0,0,0,0.04)]
                ${dragActive
                  ? 'border-[#0071e3] bg-blue-50/50'
                  : 'border-black/10 hover:border-[#0071e3] hover:bg-blue-50/30'
                }
              `}
              data-testid="drop-zone"
            >
              <input
                type="file"
                multiple
                accept=".xml"
                onChange={(e) => {
                  if (e.target.files) {
                    handleFiles(Array.from(e.target.files));
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                data-testid="file-input"
              />
              
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[46px] text-[#0071e3]">upload_file</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#1d1d1f]">
                {dragActive ? 'Suelta tus archivos aquí' : 'Arrastra tus archivos XML aquí'}
              </h3>
              <p className="text-sm text-[#86868b] mb-8 max-w-xs">
                Soporta carga masiva de archivos .xml o carpetas comprimidas .zip
              </p>
              <button
                className="bg-[#0071e3] text-white px-8 py-3 rounded-full text-[15px] font-semibold 
                  hover:bg-[#0077ed] transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                Seleccionar XML
              </button>
            </div>

            {/* Files Table */}
            <AnimatePresence>
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
                >
                  <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
                    <h4 className="font-bold text-[17px] text-[#1d1d1f]">Archivos cargados</h4>
                    <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">
                      {files.length} Archivo{files.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50/50">
                        <tr>
                          <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            Nombre del Archivo
                          </th>
                          <th className="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            Tipo
                          </th>
                          <th className="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-8 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {files.map((file) => (
                          <motion.tr
                            key={file.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-gray-50/80 transition-colors group"
                          >
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-400">description</span>
                                <span className="text-[14px] font-medium text-[#1d1d1f] truncate max-w-[200px]">
                                  {file.fileName}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-5">
                              <span className="text-[13px] text-gray-500">
                                {file.status === 'ready' ? `${file.tipo} (${file.version})` : '-'}
                              </span>
                            </td>
                            <td className="px-4 py-5">
                              <div className="flex items-center gap-2">
                                {file.status === 'ready' && (
                                  <>
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="text-[13px] font-medium text-green-600">Listo</span>
                                  </>
                                )}
                                {file.status === 'processing' && (
                                  <>
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="text-[13px] font-medium text-blue-600">Procesando</span>
                                  </>
                                )}
                                {file.status === 'error' && (
                                  <>
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <span className="text-[13px] font-medium text-red-600">
                                      {file.errorMessage || 'Error'}
                                    </span>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <button
                                onClick={() => removeFile(file.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
              <h4 className="text-[11px] uppercase tracking-[0.15em] font-bold text-black/90 mb-8 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#0071e3] rounded-full" />
                Resumen de Lote
              </h4>
              
              <div className="space-y-8">
                <div>
                  <p className="text-[13px] text-[#86868b] font-medium mb-1">Total Comprobantes</p>
                  <p className="text-[32px] font-bold text-[#1d1d1f]">{totals.count}</p>
                </div>

                <div className="pt-6 border-t border-gray-50 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[14px] text-[#86868b]">Subtotal</span>
                    <span className="text-[16px] font-bold text-[#1d1d1f]">{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[14px] text-[#86868b]">IVA (16%)</span>
                    <span className="text-[16px] font-bold text-[#0071e3]">{formatCurrency(totals.iva)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                    <span className="text-[15px] font-bold text-[#1d1d1f]">Total</span>
                    <span className="text-[20px] font-extrabold text-[#1d1d1f]">{formatCurrency(totals.total)}</span>
                  </div>
                </div>

                <div className="p-5 bg-[#f5f5f7] rounded-2xl flex items-start gap-4 mt-6">
                  <span className="material-symbols-outlined text-[#0071e3]">info</span>
                  <p className="text-[12px] leading-relaxed text-gray-600 font-medium">
                    El procesamiento masivo respeta los sellos digitales originales. 
                    Asegúrese de que todos los archivos pertenezcan al mismo ejercicio fiscal.
                  </p>
                </div>
              </div>
            </div>

            {files.length > 0 && (
              <div className="mt-6 px-4">
                <button
                  onClick={clearAllFiles}
                  className="w-full py-4 text-center text-[13px] font-bold text-gray-400 
                    hover:text-red-500 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
                  Limpiar archivos cargados
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Action Bar */}
      <AnimatePresence>
        {readyCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 py-6 
              bg-white/85 backdrop-blur-xl border-t border-black/5"
          >
            <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-green-500">check_circle</span>
                <p className="text-[14px] font-medium text-[#1d1d1f]">
                  {readyCount} comprobante{readyCount !== 1 ? 's' : ''} validado{readyCount !== 1 ? 's' : ''} y listo{readyCount !== 1 ? 's' : ''} para exportación
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={handleDownloadAll}
                  disabled={loading}
                  data-testid="download-zip-button"
                  className="px-8 py-3 rounded-full border border-gray-200 text-[14px] font-bold 
                    hover:bg-gray-50 transition-all flex items-center gap-2
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">download</span>
                  )}
                  Descargar Todo (ZIP)
                </button>
                <button
                  onClick={handleExcel}
                  disabled={loading}
                  data-testid="excel-button"
                  className="px-8 py-3 bg-[#1d1d1f] text-white rounded-full text-[14px] font-bold 
                    hover:bg-black transition-all flex items-center gap-2
                    shadow-[0_8px_32px_rgba(0,0,0,0.15)]
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">table_view</span>
                  )}
                  Exportar a Excel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
