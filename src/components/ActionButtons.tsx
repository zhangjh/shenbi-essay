
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';

interface ActionButtonsProps {
  onExport: () => void;
  onNewGrading: () => void;
}

const ActionButtons = ({ onExport, onNewGrading }: ActionButtonsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 pb-6 sm:pb-8">
      <Button variant="outline" onClick={onExport} className="shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto">
        <Download className="w-4 h-4 mr-2" />
        导出报告
      </Button>
      <Button onClick={onNewGrading} className="gradient-bg text-white shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto">
        <RefreshCw className="w-4 h-4 mr-2" />
        批改新作文
      </Button>
    </div>
  );
};

export default ActionButtons;
