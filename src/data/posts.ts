// Definimos la estructura de un artículo para que TypeScript no se queje
export interface Post {
  id: number;
  title: string;
  category: string;
  image: string;
  author: string;
  date: string;
  content: string;
}

// Estos son tus 30 artículos de prueba
export const allPosts: Post[] = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  title: [
    "Guía completa: Declaración Anual Personas Morales 2026",
    "Cómo automatizar tu conciliación bancaria con IA",
    "Reformas a la Ley Federal del Trabajo: Lo que debes saber",
    "Los 5 errores más comunes al emitir CFDI 4.0",
    "Estrategias fiscales para Pymes en México",
    "El futuro de la contabilidad y la Inteligencia Artificial",
    "Actualización de tablas de ISR y UMA 2026",
    "Cómo preparar a tu despacho para una auditoría del SAT"
  ][i % 8],
  category: ["Impuestos", "Tecnología", "Laboral", "SAT", "Estrategia", "Futuro", "SAT", "Auditoría"][i % 8],
  image: `https://picsum.photos/seed/${i + 50}/800/450`,
  author: "Marisol Romero",
  date: "11 Ene 2026",
  content: `
    <p>La contabilidad en México está cambiando a un ritmo acelerado. Con la llegada de nuevas tecnologías, los contadores deben adaptarse o quedar rezagados.</p>
    <h2>La importancia de la automatización</h2>
    <p>Hoy en día, herramientas como la IA permiten procesar miles de facturas en segundos, reduciendo el error humano casi a cero.</p>
    <ul>
      <li>Mayor precisión en cálculos.</li>
      <li>Ahorro de tiempo en tareas repetitivas.</li>
      <li>Mejor asesoría estratégica para el cliente.</li>
    </ul>
    <blockquote>"El contador del futuro no solo suma números, interpreta datos para hacer crecer negocios."</blockquote>
    <p>Es vital que los despachos empiecen a invertir en capacitación digital para sus equipos.</p>
  `
}));