// src/components/ui/ProgressBar.tsx
interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-50 z-50">
      <div 
        className="h-full bg-[#0071e3] transition-all duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}