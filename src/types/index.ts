// Definición profesional de un artículo
export interface Post {
  id: number;
  title: string;
  category: string;
  image: string;
  author: string;
  date: string;
  content: string;
}

// Podremos agregar más tipos aquí después (ej. Usuarios, Comentarios)