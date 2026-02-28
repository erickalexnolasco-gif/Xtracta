// src/components/ui/ProgressBar.tsx
interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-50 z-50">
      <div 
        className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 transition-all duration-300 shadow-sm"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}