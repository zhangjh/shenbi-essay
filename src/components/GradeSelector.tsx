import { Button } from '@/components/ui/button';

const grades = [
  { id: 'elementary', name: '小学', color: 'bg-education-blue-100 text-education-blue-700' },
  { id: 'middle', name: '初中', color: 'bg-blue-100 text-blue-700' },
  { id: 'high', name: '高中', color: 'bg-slate-100 text-slate-700' },
];

interface GradeSelectorProps {
  selectedGrade: string;
  onGradeChange: (grade: string) => void;
}

const GradeSelector = ({ selectedGrade, onGradeChange }: GradeSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {grades.map((grade) => (
        <Button
          key={grade.id}
          variant={selectedGrade === grade.id ? "default" : "outline"}
          className={`px-6 py-2 rounded-full transition-all duration-200 ${
            selectedGrade === grade.id 
              ? 'gradient-bg text-white shadow-lg' 
              : `${grade.color} hover:scale-105`
          }`}
          onClick={() => onGradeChange(grade.id)}
        >
          {grade.name}
        </Button>
      ))}
    </div>
  );
};

export default GradeSelector;
