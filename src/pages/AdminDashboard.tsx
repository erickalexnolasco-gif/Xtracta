//src/pages/AdminDashboard.tsx
import {
  useState,
  useEffect,
  type ChangeEvent,
  type ReactNode,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Calendar as CalendarIcon,
  Send,
  Upload,
  Image as ImageIcon,
  Copy,
  Check,
  Plus,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  List,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner"; // Usamos tu librería de notificaciones

// --- INTERFACES DE BASE DE DATOS ---
interface DbItem {
  id: string | number;
  name: string;
}
interface AuthorItem {
  id: string | number;
  name: string;
  username: string;
}

// --- COMPONENTES DE UI LOCALES ---
const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  ...props
}: any) => {
  const variants: any = {
    primary: "bg-[#1819FF] text-white hover:opacity-90",
    outline: "border border-black/10 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "hover:bg-black/5 text-gray-600",
    publish: "bg-[#30D158] text-white hover:bg-[#30D158]/90",
    scheduled: "bg-[#0A84FF] text-white hover:bg-[#0A84FF]/90",
  };
  const sizes: any = {
    sm: "h-8 px-3 text-[13px]",
    md: "h-10 px-4 text-sm",
    icon: "w-8 h-8",
  };
  return (
    <button
      disabled={loading}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? <span className="animate-pulse">...</span> : children}
    </button>
  );
};

const Switch = ({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) => (
  <button
    type="button"
    onClick={() => onCheckedChange(!checked)}
    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${checked ? "bg-[#30D158]" : "bg-gray-200"}`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? "translate-x-4" : "translate-x-1"}`}
    />
  </button>
);

// --- COMPONENTE PRINCIPAL ---
export default function AdminDashboard({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [view, setView] = useState<"editor" | "media">("editor");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // --- ESTADOS DEL EDITOR ---
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // --- ESTADOS RELACIONALES (DB) ---
  const [categories, setCategories] = useState<DbItem[]>([]);
  const [types, setTypes] = useState<DbItem[]>([]);
  const [authors, setAuthors] = useState<AuthorItem[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [authorId, setAuthorId] = useState("");

  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const [uploading, setUploading] = useState(false);
  const [mediaItems, setMediaItems] = useState<{ name: string; url: string }[]>(
    [],
  );
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // 1. CARGAR RELACIONES DESDE SUPABASE
  useEffect(() => {
    async function loadDatabaseRelations() {
      const [catsRes, typesRes, authsRes] = await Promise.all([
        supabase.from("categories").select("id, name"),
        supabase.from("types").select("id, name"),
        supabase.from("authors").select("id, name, username"),
      ]);

      if (catsRes.data) setCategories(catsRes.data);
      if (typesRes.data) setTypes(typesRes.data);
      if (authsRes.data) {
        setAuthors(authsRes.data);
        const currentAuthor = authsRes.data.find((a) => a.id === user?.id);
        if (currentAuthor) setAuthorId(currentAuthor.id.toString());
      }
    }
    loadDatabaseRelations();
  }, [user]);

  // 2. LÓGICA DE LA BARRA DE HERRAMIENTAS (INYECCIÓN HTML)
  const applyFormat = (
    startTag: string,
    endTag: string,
    defaultText: string,
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const textToWrap = selectedText || defaultText;

    const newContent =
      content.substring(0, start) +
      startTag +
      textToWrap +
      endTag +
      content.substring(end);
    setContent(newContent);

    // Regresar el foco al textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + startTag.length,
        start + startTag.length + textToWrap.length,
      );
    }, 0);
  };

  // NUEVA FUNCIÓN: Lógica especial para listas <ul><li>
  const applyListFormat = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let newText = "";
    if (selectedText) {
      // Si el usuario seleccionó texto, separamos por saltos de línea y creamos los <li>
      const listItems = selectedText
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => `  <li>${line}</li>`)
        .join('\n');
      newText = `<ul>\n${listItems}\n</ul>\n`;
    } else {
      // Si no seleccionó nada, ponemos una plantilla básica
      newText = "<ul>\n  <li>Elemento 1</li>\n  <li>Elemento 2</li>\n</ul>\n";
    }

    const newContent =
      content.substring(0, start) +
      newText +
      content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + newText.length, start + newText.length);
    }, 0);
  };

  // 3. FUNCIONES DE CREACIÓN RÁPIDA (+)
  const handleCreateCategory = async () => {
    const name = window.prompt("Nombre de la nueva categoría (ej. Fiscal):");
    if (!name) return;
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name }])
      .select()
      .single();
    if (data && !error) {
      setCategories([...categories, data]);
      setCategoryId(data.id.toString());
      toast.success("Categoría creada");
    } else toast.error("Error al crear categoría");
  };

  const handleCreateType = async () => {
    const name = window.prompt("Nombre del nuevo tipo de post (ej. Artículo):");
    if (!name) return;
    const { data, error } = await supabase
      .from("types")
      .insert([{ name }])
      .select()
      .single();
    if (data && !error) {
      setTypes([...types, data]);
      setTypeId(data.id.toString());
      toast.success("Tipo creado");
    } else toast.error("Error al crear tipo");
  };

  // 4. PUBLICAR POST
  const handlePublish = async () => {
    if (!title || !content || !authorId || !categoryId || !typeId) {
      toast.error(
        "Faltan campos obligatorios (Título, Contenido, Autor, Categoría, Tipo)",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // Cálculo del tiempo de lectura (200 palabras por minuto)
      const plainText = content.replace(/<[^>]+>/g, ""); // Quitamos etiquetas HTML para contar
      const wordCount = plainText.trim().split(/\s+/).length;
      const calculatedReadTime = `${Math.max(1, Math.ceil(wordCount / 200))} min`;

      const slug = title.replaceAll(" ", "_");
      const { error } = await supabase.from("posts").insert([
        {
          title: title,
          summary: summary,
          content: content,
          image_url: imageUrl,
          slug: slug,
          id_category: categoryId, // ¿Se llama categories en supabase?
          id_type_post: typeId, // ¿Se llama types en supabase?
          id_author: authorId, // ¿Se llama authors en supabase?
          is_published: true,
          read_time: calculatedReadTime,
          published_at: scheduleEnabled
            ? `${scheduleDate}T${scheduleTime}:00`
            : new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      toast.success("¡Post publicado exitosamente!");
      onClose();
    } catch (error: any) {
      toast.error("Error al publicar: " + error.message);
    }
    setIsSubmitting(false);
    
  };

// 5. BIBLIOTECA DE MEDIOS
  const fetchMedia = async () => {
    try {
      // 👇 1. El bucket es "blog-images" y listamos dentro de "img_posts"
      const { data, error } = await supabase.storage
        .from("blog-images")
        .list("img_posts");
      
      if (error) {
        console.error("Error de Supabase al cargar imágenes:", error);
        toast.error("No se pudieron cargar las imágenes");
        return;
      }

      if (data) {
        const items = data
          .filter((file) => file.name !== ".emptyFolderPlaceholder")
          .map((file) => ({
            name: file.name,
            // 👇 2. La URL pública debe incluir la ruta de la carpeta "img_posts/"
            url: supabase.storage
              .from("blog-images")
              .getPublicUrl(`img_posts/${file.name}`).data.publicUrl,
          }));
        setMediaItems(items);
      }
    } catch (err) {
      console.error("Error inesperado en fetchMedia:", err);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files?.[0]) return;
      const file = e.target.files[0];
      
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const fileName = `${Date.now()}-${cleanFileName}`;
      
      // 👇 3. Subimos al bucket "blog-images" dentro de la carpeta "img_posts"
      const { error } = await supabase.storage
        .from("blog-images")
        .upload(`img_posts/${fileName}`, file);
      
      if (error) {
        console.error("Error de Supabase al subir:", error);
        throw error; 
      }
      
      toast.success("Imagen subida a la biblioteca");
      fetchMedia(); 
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error al subir imagen"); 
    }
      setUploading(false);
    
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-9999 bg-[#F5F5F7] flex flex-col overflow-hidden text-[#1D1D1F]"
    >
      {/* HEADER BAR */}
      <div className="h-14 border-b border-black/10 bg-white/70 backdrop-blur-xl flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex bg-gray-100 p-1 rounded-lg gap-1">
            <button
              onClick={() => setView("editor")}
              className={`px-4 py-1 text-[11px] font-bold rounded-md transition-all ${view === "editor" ? "bg-white shadow-sm" : "text-gray-500"}`}
            >
              EDITOR
            </button>
            <button
              onClick={() => setView("media")}
              className={`px-4 py-1 text-[11px] font-bold rounded-md transition-all ${view === "media" ? "bg-white shadow-sm" : "text-gray-500"}`}
            >
              BIBLIOTECA
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-[13px]">
            <Save className="w-3.5 h-3.5 mr-2" /> Guardar Borrador
          </Button>
          <Button
            loading={isSubmitting}
            onClick={handlePublish}
            variant={scheduleEnabled ? "scheduled" : "publish"}
            size="sm"
            className="text-[13px]"
          >
            {scheduleEnabled ? (
              <CalendarIcon className="w-3.5 h-3.5 mr-2" />
            ) : (
              <Send className="w-3.5 h-3.5 mr-2" />
            )}
            {scheduleEnabled ? "Programar" : "Publicar Ahora"}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <AnimatePresence mode="wait">
          {view === "editor" ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex overflow-hidden"
            >
              {/* PANEL IZQUIERDO - EDITOR HTML */}
              <div className="flex-1 overflow-y-auto p-8 bg-white">
                <div className="max-w-3xl mx-auto space-y-6">
                  <input
                    placeholder="Título del post…"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-[32px] font-bold border-0 p-0 focus:outline-none placeholder:text-[#6E6E73] bg-transparent"
                  />
                  <textarea
                    placeholder="Resumen breve o extracto (Aparecerá en las tarjetas y al inicio del post)…"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full min-h-15 text-[15px] border-0 p-0 focus:outline-none resize-none placeholder:text-[#6E6E73] bg-transparent"
                  />

                  {/* TOOLBAR HTML FUNCIONAL */}
                  <div className="flex items-center gap-2 pb-3 border-b border-black/10">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        applyFormat("<strong>", "</strong>", "Negrita")
                      }
                      title="Negrita"
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => applyFormat("<em>", "</em>", "Cursiva")}
                      title="Cursiva"
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => applyFormat("<u>", "</u>", "Subrayado")}
                      title="Subrayado"
                    >
                      <Underline className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-4 bg-black/10 mx-1" />
                    {/* H2 ES VITAL PARA TU TABLA DE CONTENIDOS */}
                    <Button
                      variant="ghost"
                      className="text-[13px] font-bold px-2"
                      onClick={() =>
                        applyFormat("<h2>", "</h2>", "Subtítulo (Sección)")
                      }
                      title="Subtítulo Principal (H2)"
                    >
                      H2
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-[13px] font-bold px-2"
                      onClick={() =>
                        applyFormat("<h3>", "</h3>", "Subtítulo menor")
                      }
                      title="Subtítulo Secundario (H3)"
                    >
                      H3
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-[13px] font-bold px-2"
                      onClick={() =>
                        applyFormat("<p>", "</p>", "Párrafo de texto")
                      }
                      title="Párrafo (P)"
                    >
                      P
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={applyListFormat}
                      title="Lista con viñetas"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-4 bg-black/10 mx-1" />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        applyFormat(
                          '<a href="URL_AQUI" target="_blank" class="text-blue-600 underline">',
                          "</a>",
                          "Texto del enlace",
                        )
                      }
                      title="Enlace"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        applyFormat(
                          '<img src="URL_AQUI" alt="Descripción" class="w-full rounded-xl my-4" />',
                          "",
                          "",
                        )
                      }
                      title="Insertar Imagen"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                  </div>

                  <textarea
                    ref={textareaRef}
                    placeholder="Escribe el contenido HTML aquí. Usa la barra de herramientas para agregar <h2> (necesario para el índice), párrafos y negritas..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full min-h-125 text-[15px] border-0 p-0 focus:outline-none resize-none font-mono bg-transparent text-gray-700 leading-relaxed"
                  />
                </div>
              </div>

              {/* PANEL DERECHO - INSPECTOR DINÁMICO */}
              <div className="w-80 border-l border-black/10 bg-white/70 backdrop-blur-xl overflow-y-auto p-6 space-y-6">
                {/* AUTOR */}
                <section>
                  <label htmlFor="author-select" className="text-[12px] font-bold mb-2 block uppercase text-gray-500 tracking-wider">
                    Autor del Post
                  </label>
                  <select
                    id="author-select"
                    value={authorId}
                    onChange={(e) => setAuthorId(e.target.value)}
                    className="w-full h-9 border border-black/10 rounded-md px-2 text-[13px] bg-white outline-none"
                  >
                    <option value="">Seleccionar autor...</option>
                    {authors.map((author) => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </section>

                {/* CATEGORÍA Y TIPO */}
                <section className="border-t border-black/5 pt-6 space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="category-select" className="text-[12px] font-bold uppercase text-gray-500 tracking-wider">
                        Categoría
                      </label>
                      <button
                        onClick={handleCreateCategory}
                        className="text-[#1819FF] hover:bg-blue-50 p-1 rounded"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <select
                      id="category-select"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full h-9 border border-black/10 rounded-md px-2 text-[13px] bg-white outline-none"
                    >
                      <option value="">Seleccionar categoría...</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="type-select" className="text-[12px] font-bold uppercase text-gray-500 tracking-wider">
                        Tipo de Post
                      </label>
                      <button
                        onClick={handleCreateType}
                        className="text-[#1819FF] hover:bg-blue-50 p-1 rounded"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <select
                      id="type-select"
                      value={typeId}
                      onChange={(e) => setTypeId(e.target.value)}
                      className="w-full h-9 border border-black/10 rounded-md px-2 text-[13px] bg-white outline-none"
                    >
                      <option value="">Seleccionar tipo...</option>
                      {types.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </section>

                {/* IMAGEN DE PORTADA */}
                <section className="border-t border-black/5 pt-6">
                  <label htmlFor="image-url-input" className="text-[12px] font-bold mb-2 block uppercase text-gray-500 tracking-wider">
                    Imagen Destacada
                  </label>
                  <input
                    id="image-url-input"
                    placeholder="Pega la URL de la biblioteca..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full h-9 border border-black/10 rounded-md px-3 text-[13px] outline-none"
                  />
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt=""
                      className="mt-3 w-full h-32 object-cover rounded-lg shadow-sm border border-black/5"
                    />
                  )}
                </section>

                {/* PROGRAMACIÓN */}
                <section className="border-t border-black/5 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[13px] font-semibold">
                      Programar publicación
                    </span>
                    <Switch
                      checked={scheduleEnabled}
                      onCheckedChange={setScheduleEnabled}
                    />
                  </div>
                  {scheduleEnabled && (
                    <div className="space-y-2">
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full h-9 border border-black/10 rounded-md px-3 text-[13px] outline-none"
                      />
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full h-9 border border-black/10 rounded-md px-3 text-[13px] outline-none"
                      />
                    </div>
                  )}
                </section>
              </div>
            </motion.div>
          ) : (
            // PANEL DE BIBLIOTECA
            <motion.div
              key="media"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 p-8 overflow-y-auto"
            >
              <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-[28px] font-semibold">Media Library</h1>
                  <label className="cursor-pointer bg-[#1819FF] text-white px-6 py-2 rounded-lg font-bold text-[13px] hover:opacity-90 flex items-center gap-2">
                    <Upload className="w-4 h-4" />{" "}
                    {uploading ? "Subiendo..." : "Upload Media"}
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
                  {mediaItems.map((item, index) => (
                    <div
                      key={index}
                      className="group relative bg-white rounded-xl overflow-hidden border border-black/5 shadow-sm"
                    >
                      <img
                        src={item.url}
                        alt=""
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button
                          className="text-white hover:scale-110 transition-transform p-2 bg-white/20 rounded-full"
                          onClick={() => {
                            navigator.clipboard.writeText(item.url);
                            toast.success("URL copiada al portapapeles");
                            setCopiedIndex(index);
                            setTimeout(() => setCopiedIndex(null), 2000);
                          }}
                        >
                          {copiedIndex === index ? (
                            <Check className="w-5 h-5 text-green-400" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}