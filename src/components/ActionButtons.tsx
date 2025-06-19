
import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';

interface ActionButtonsProps {
  onExport: () => void;
  onNewGrading: () => void;
}

const ActionButtons = ({ onExport, onNewGrading }: ActionButtonsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 justify-center pt-3 sm:pt-4 pb-4 sm:pb-6 lg:pb-8 px-2 sm:px-0">
      <Button 
        variant="outline" 
        onClick={onExport} 
        className="shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto text-sm sm:text-base"
        size="sm"
      >
        <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
        导出报告
      </Button>
      <Button 
        onClick={onNewGrading} 
        className="gradient-bg text-white shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto text-sm sm:text-base"
        size="sm"
      >
        <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
        批改新作文
      </Button>
    </div>
  );
};

export default ActionButtons;
