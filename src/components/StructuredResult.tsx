
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface StructuredResultProps {
  score?: number;
  totalScore?: number;
  grade?: string;
  strengths?: string[];
  improvements?: string[];
  detailedFeedback?: string;
}

const StructuredResult = ({ 
  score, 
  totalScore, 
  grade, 
  strengths, 
  improvements, 
  detailedFeedback 
}: StructuredResultProps) => {
  const percentage = score && totalScore ? (score / totalScore) * 100 : 0;
  
  const getGradeColor = (grade?: string) => {
    if (!grade) return 'bg-gray-500';
    if (grade.startsWith('A')) return 'bg-green-500';
    if (grade.startsWith('B')) return 'bg-blue-500';
    if (grade.startsWith('C')) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className={`w-20 h-20 rounded-full ${getGradeColor(grade)} flex items-center justify-center text-white text-2xl font-bold`}>
              {grade}
            </div>
          </div>
          <CardTitle className="text-2xl">
            {score} / {totalScore} 分
          </CardTitle>
          <Progress value={percentage} className="w-full mt-4" />
          <p className="text-gray-600 mt-2">总体评分：{percentage.toFixed(1)}%</p>
        </CardHeader>
      </Card>

      {/* Strengths and Improvements */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <CheckCircle className="w-5 h-5 mr-2" />
              优点亮点
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {strengths?.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 mr-2 mt-0.5">
                    {index + 1}
                  </Badge>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-orange-600">
              <AlertCircle className="w-5 h-5 mr-2" />
              改进建议
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {improvements?.map((improvement, index) => (
                <li key={index} className="flex items-start">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 mr-2 mt-0.5">
                    {index + 1}
                  </Badge>
                  <span className="text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>详细评语</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{detailedFeedback}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StructuredResult;
