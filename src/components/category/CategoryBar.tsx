//src/components/category/CategoryBar.tsx
// Definimos lo que recibe el componente (Props)
interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categorias = ["Todas", "SAT", "Nómina", "Impuestos", "Casos de Éxito", "Tecnología Contable", "Noticias", "Guías Prácticas"];

export default function CategoryBar({ selectedCategory, onSelectCategory }: CategoryBarProps) {
  return (
    <div className="w-full mb-12">
      <div className="flex items-center justify-center gap-2 md:gap-4 overflow-x-auto py-4 no-scrollbar flex-wrap">
        {categorias.map((cat) => {
           // Ahora comparamos con la prop que viene del padre
           const isActive = cat === selectedCategory;
           
           return (
            <button
                key={cat}
                onClick={() => onSelectCategory(cat)} // Al hacer clic, avisamos al padre
                className={`
                  text-sm font-semibold whitespace-nowrap px-6 py-2 rounded-full transition-all duration-300 ease-out
                  ${isActive 
                    ? "bg-blue-600 text-white shadow-md scale-105" 
                    : "text-gray-600 bg-transparent hover:bg-blue-600 hover:text-white hover:scale-110"
                  }
                `}
            >
                {cat}
            </button>
           );
        })}
      </div>
    </div>
  );
}