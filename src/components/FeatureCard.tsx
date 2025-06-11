
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  buttonText: string;
  onButtonClick: () => void;
  gradient?: string;
}

const FeatureCard = ({ 
  title, 
  description, 
  icon, 
  buttonText, 
  onButtonClick,
  gradient = "gradient-bg"
}: FeatureCardProps) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-2">
        <div className={`w-16 h-16 ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <CardTitle className="text-xl font-bold text-gray-800">{title}</CardTitle>
        <CardDescription className="text-gray-600 leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button 
          onClick={onButtonClick}
          className="w-full gradient-bg text-white hover:shadow-lg transition-all duration-200"
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
