import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Download, Maximize } from 'lucide-react';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkHtml from 'remark-html';
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge"

interface GradingResultProps {
  result: {
    // 新的 markdown 格式结果
    markdownContent?: string;
    isMarkdown?: boolean;
    // 旧的结构化结果（向后兼容）
    score?: number;
    totalScore?: number;
    grade?: string;
    strengths?: string[];
    improvements?: string[];
    detailedFeedback?: string;
  };
  onNewGrading: () => void;
  imageUrl?: string;
}

// 全屏图片预览遮罩组件
const ImageFullscreenPreview = ({
  src,
  alt,
  show,
  onClose,
}: {
  src: string;
  alt?: string;
  show: boolean;
  onClose: () => void;
}) => {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-[120] bg-black/80 flex items-center justify-center transition animate-fade-in"
      onClick={onClose}
      style={{ cursor: 'zoom-out' }}
    >
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full rounded-lg shadow-2xl border-4 border-white"
        onClick={e => e.stopPropagation()}
        style={{ objectFit: 'contain' }}
      />
      <button
        className="absolute top-6 right-8 text-white bg-black/60 rounded-full p-3 hover:bg-black/90 transition"
        onClick={onClose}
        aria-label="关闭预览"
      >
        <svg width={26} height={26} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m18 6-6 6m0 0-6-6m6 6 6 6m-6-6-6 6"/></svg>
      </button>
    </div>
  );
};


const GradingResult = ({ result, onNewGrading, imageUrl }: GradingResultProps) => {
  // 控制图片全屏预览
  const [showPreview, setShowPreview] = useState(false);

  const exportResult = () => {
    let content = '';
    if (result.isMarkdown && result.markdownContent) {
      content = result.markdownContent;
    } else {
      content = `
作文批改报告
=============

总分：${result.score}/${result.totalScore} (${result.grade})

优点：
${result.strengths?.map(item => `• ${item}`).join('\n')}

改进建议：
${result.improvements?.map(item => `• ${item}`).join('\n')}

详细评语：
${result.detailedFeedback}

生成时间：${new Date().toLocaleString()}
      `;
    }
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

  // 判断是markdown批改结果
  if (result.isMarkdown && result.markdownContent) {
    return (
      <div className="space-y-8">
        {/* 图片预览区，仅有图片时显示 */}
        {imageUrl && (
          <>
            <div className="flex flex-col items-center mb-6">
              <div
                tabIndex={0}
                title="点击可放大/全屏查看"
                className="relative rounded-xl overflow-hidden shadow-md border border-blue-100 bg-slate-50 w-full max-w-md aspect-[4/3] group cursor-zoom-in transition hover:scale-[1.02] hover:shadow-xl"
                style={{ outline: 'none' }}
                onClick={() => setShowPreview(true)}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setShowPreview(true)}
              >
                <img
                  src={imageUrl}
                  alt="上传的作文预览"
                  className="object-contain w-full h-full transition"
                  style={{ maxHeight: 360 }}
                  draggable={false}
                />
                {/* 放大icon */}
                <div className="absolute right-3 bottom-3 bg-white/80 rounded-full p-2 shadow group-hover:bg-white group-hover:scale-110 transition-all">
                  <Maximize className="w-5 h-5 text-sky-700" />
                </div>
                {/* 蒙版 */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-blue-50/60 via-white/20 to-transparent" />
              </div>
              <div className="text-xs text-gray-400 mt-1">上传图片预览（点击可放大全屏）</div>
            </div>
            {/* 全屏预览遮罩 */}
            <ImageFullscreenPreview
              src={imageUrl}
              alt={'上传的作文图片大图'}
              show={showPreview}
              onClose={() => setShowPreview(false)}
            />
          </>
        )}

        {/* 渲染 markdown 内容，支持HTML标签 */}
        <Card className="shadow-xl border-blue-100 p-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-center gradient-text">智能批改结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-slate max-w-none prose-img:rounded-lg prose-img:shadow prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: result.markdownContent
                  .replace(/<span style=['"]color:red['"]>/g, '<span class="text-red-600 font-semibold bg-red-50 px-1 rounded">')
                  .replace(/<span style=['"]color:blue['"]>/g, '<span class="text-blue-600 font-semibold bg-blue-50 px-1 rounded">')
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-blue-800">$1</strong>')
                  .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 mt-8 text-blue-700 border-b border-blue-100 pb-1">$1</h2>')
                  .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mb-2 mt-6 text-blue-600">$1</h3>')
                  .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 mt-8 text-sky-900 border-b pb-2">$1</h1>')
                  .replace(/^\* (.*$)/gim, '<li class="text-gray-700 leading-6 mb-1">$1</li>')
                  .replace(/^\d+\. (.*$)/gim, '<li class="text-gray-700 leading-6 mb-1">$1</li>')
                  .replace(/^([^#*\d\n<].*$)/gim, '<p class="my-2 text-gray-800 leading-relaxed">$1</p>')
                  .replace(/(<li[^>]*>.*<\/li>)/gs, '<ul class="list-disc pl-6 mb-4 space-y-1">$1</ul>')
              }}
            />
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
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
  }

  const percentage = result.score && result.totalScore ? (result.score / result.totalScore) * 100 : 0;
  
  const getGradeColor = (grade?: string) => {
    if (!grade) return 'bg-gray-500';
    if (grade.startsWith('A')) return 'bg-green-500';
    if (grade.startsWith('B')) return 'bg-blue-500';
    if (grade.startsWith('C')) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* 图片预览区，仅有图片上传时显示 */}
      {imageUrl && (
        <>
          <div className="flex flex-col items-center mb-4">
            <div
              tabIndex={0}
              title="点击可放大/全屏查看"
              className="relative rounded-xl overflow-hidden shadow-md border border-blue-100 bg-slate-50 w-full max-w-md aspect-[4/3] group cursor-zoom-in transition hover:scale-[1.02] hover:shadow-xl"
              style={{ outline: 'none' }}
              onClick={() => setShowPreview(true)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setShowPreview(true)}
            >
              <img
                src={imageUrl}
                alt="上传的作文预览"
                className="object-contain w-full h-full transition"
                style={{ maxHeight: 360 }}
                draggable={false}
              />
              {/* 放大icon */}
              <div className="absolute right-3 bottom-3 bg-white/80 rounded-full p-2 shadow group-hover:bg-white group-hover:scale-110 transition-all">
                <Maximize className="w-5 h-5 text-sky-700" />
              </div>
              {/* 蒙版 */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-blue-50/60 via-white/20 to-transparent" />
            </div>
            <div className="text-xs text-gray-400 mt-1">上传图片预览（点击可放大全屏）</div>
          </div>
          {/* 全屏预览遮罩 */}
          <ImageFullscreenPreview
            src={imageUrl}
            alt={'上传的作文图片大图'}
            show={showPreview}
            onClose={() => setShowPreview(false)}
          />
        </>
      )}

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
