// src/utils/satCatalogs.ts
export const SAT_CATALOGS: any = {
    MetodoPago: { PUE: "PUE - Pago en una sola exhibición", PPD: "PPD - Pago en parcialidades o diferido" },

    FormaPago: { "01": "01 - Efectivo" ,"02": "02 - Cheque nominativo" ,"03": "03 - Transferencia electrónica de fondos" ,"04": "04 - Tarjeta de crédito" ,"05": "05 - Monedero electrónico" ,"06": "06 - Dinero electrónico" ,"08": "08 - Vales de despensa" ,"12": "12 - Dación en pago" ,"13": "13 - Pago por subrogación" ,"14": "14 - Pago por consignación" ,"15": "15 - Condonación" ,"17": "17 - Compensación" ,"23": "23 - Novación" ,"24": "24 - Confusión" ,"25": "25 - Remisión de deuda" ,"26": "26 - Prescripción o caducidad" ,"27": "27 - A satisfacción del acreedor" ,"28": "28 - Tarjeta de débito" ,"29": "29 - Tarjeta de servicios" ,"30": "30 - Aplicación de anticipos" ,"31": "31 - Intermediario pagos" ,"99": "99 - Por definir"},
  
  UsoCFDI: { 
    G01: "G01 - Adquisición de mercancías", G03: "G03 - Gastos en general", 
    S01: "S01 - Sin efectos fiscales", CP01: "CP01 - Pagos" 
  },
  RegimenFiscal: { "601": "601 - General de Ley Personas Morales" ,"603": "603 - Personas Morales con Fines no Lucrativos" ,"605": "605 - Sueldos y Salarios e Ingresos Asimilados a Salarios" ,"606": "606 - Arrendamiento" ,"607": "607 - Régimen de Enajenación o Adquisición de Bienes" ,"608": "608 - Demás ingresos" ,"610": "610 - Residentes en el Extranjero sin Establecimiento Permanente en México" ,"611": "611 - Ingresos por Dividendos (socios y accionistas)" ,"612": "612 - Personas Físicas con Actividades Empresariales y Profesionales" ,"614": "614 - Ingresos por intereses" ,"615": "615 - Régimen de los ingresos por obtención de premios" ,"616": "616 - Sin obligaciones fiscales" ,"620": "620 - Sociedades Cooperativas de Producción que optan por diferir sus ingresos" ,"621": "621 - Incorporación Fiscal" ,"622": "622 - Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras" ,"623": "623 - Opcional para Grupos de Sociedades" ,"624": "624 - Coordinados" ,"625": "625 - Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas" ,"626": "626 - Régimen Simplificado de Confianza"},
  TipoDeComprobante: { I: "I - Ingreso", E: "E - Egreso", P: "P - Pago", N: "N - Nómina" }
};

// Función auxiliar para traducir claves de forma segura
export const translate = (catalog: string, key: string | null) => {
  if (!key) return "N/A";
  return SAT_CATALOGS[catalog]?.[key] || key;
};