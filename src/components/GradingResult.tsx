
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, RefreshCw, Download } from 'lucide-react';

interface GradingResultProps {
  result: {
    score: number;
    totalScore: number;
    grade: string;
    strengths: string[];
    improvements: string[];
    detailedFeedback: string;
  };
  onNewGrading: () => void;
}

const GradingResult = ({ result, onNewGrading }: GradingResultProps) => {
  const percentage = (result.score / result.totalScore) * 100;
  
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-500';
    if (grade.startsWith('B')) return 'bg-blue-500';
    if (grade.startsWith('C')) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const exportResult = () => {
    const content = `
作文批改报告
=============

总分：${result.score}/${result.totalScore} (${result.grade})

优点：
${result.strengths.map(item => `• ${item}`).join('\n')}

改进建议：
${result.improvements.map(item => `• ${item}`).join('\n')}

详细评语：
${result.detailedFeedback}

生成时间：${new Date().toLocaleString()}
    `;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `作文批改报告_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className={`w-20 h-20 rounded-full ${getGradeColor(result.grade)} flex items-center justify-center text-white text-2xl font-bold`}>
              {result.grade}
            </div>
          </div>
          <CardTitle className="text-2xl">
            {result.score} / {result.totalScore} 分
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
              {result.strengths.map((strength, index) => (
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
              {result.improvements.map((improvement, index) => (
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
          <p className="text-gray-700 leading-relaxed">{result.detailedFeedback}</p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" onClick={exportResult}>
          <Download className="w-4 h-4 mr-2" />
          导出报告
        </Button>
        <Button onClick={onNewGrading} className="gradient-bg text-white">
          <RefreshCw className="w-4 h-4 mr-2" />
          批改新作文
        </Button>
      </div>
    </div>
  );
};

export default GradingResult;
