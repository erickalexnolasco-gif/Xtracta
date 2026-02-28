// src/components/post/TableOfContents.tsx
import { List } from 'lucide-react';
import { useState } from 'react';

interface TableOfContentsProps {
  sections: Array<{ id: string; title: string }>;
  activeSection: string;
}

export default function TableOfContents({ sections, activeSection }: TableOfContentsProps) {
  const [clickedSection, setClickedSection] = useState<string | null>(null);

  if (sections.length === 0) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    
    // Feedback visual
    setClickedSection(sectionId);
    setTimeout(() => setClickedSection(null), 600);
    
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Título con icono de lista */}
      <h4 className="text-[16px] font-bold text-black mb-4 flex items-center gap-2">
        <List className="w-3.5 h-3.5 text-blue-600" strokeWidth={2.5} />
        Índice
      </h4>

      {/* Lista de secciones */}
      <nav className="flex flex-col text-[15px] text-[#86868b]">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={(e) => handleClick(e, section.id)}
            className={`toc-item relative pl-1 py-2 border-l-2 font-normal transition-all duration-200 flex items-center group cursor-pointer ${
              activeSection === section.id
                ? 'border-blue-600 text-black font-medium'
                : 'border-transparent hover:text-black hover:border-gray-300'
            } ${
              clickedSection === section.id
                ? 'scale-[1.02] bg-blue-50/50'
                : ''
            }`}
          >
            <span className="toc-indicator absolute left-0 w-0.5 h-full bg-transparent group-hover:bg-blue-600 transition-colors"></span>
            {section.title}
          </a>
        ))}
      </nav>

      {/* Card de info adicional */}
      <div className="p-6 bg-[#f5f5f7] rounded-2xl">
        <p className="text-[12px] font-bold uppercase tracking-wider mb-2 text-black/60">
          Actualización Fiscal
        </p>
        <p className="text-[13px] leading-relaxed mb-4 text-[#1d1d1f]">
          Manténgase informado sobre las últimas resoluciones del SAT.
        </p>
        <button className="text-blue-600 text-[13px] font-bold hover:underline">
          Ver más guías →
        </button>
      </div>
    </div>
  );
}