import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Download, Maximize } from 'lucide-react';
import React, { useState } from 'react';
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

  const processMarkdownContent = (content: string) => {
    return content
      // 处理红色标记（错误）- 移动端优化
      .replace(/<span style=['"]color:red['"]>(.*?)<\/span>/g, '<span class="inline-block bg-red-50 text-red-800 px-2 py-1 mx-0.5 my-0.5 rounded-lg border border-red-200 font-medium shadow-sm text-sm leading-relaxed break-words">$1</span>')
      .replace(/【(.*?)】/g, '<span class="inline-block bg-red-100 text-red-800 px-3 py-2 mx-1 my-1 rounded-xl border-2 border-red-300 font-semibold shadow-md text-sm md:text-base leading-relaxed max-w-full break-words">【$1】</span>')
      // 处理蓝色标记（建议）- 移动端优化
      .replace(/<span style=['"]color:blue['"]>(.*?)<\/span>/g, '<span class="inline-block bg-blue-50 text-blue-800 px-2 py-1 mx-0.5 my-0.5 rounded-lg border border-blue-200 font-medium shadow-sm text-sm leading-relaxed break-words">$1</span>')
      // 处理标题 - 移动端响应式
      .replace(/^## (.*$)/gim, '<h2 class="text-lg md:text-xl font-bold mb-3 md:mb-4 mt-6 md:mt-8 text-blue-800 border-b-2 border-blue-100 pb-2 flex items-center flex-wrap"><span class="w-1 h-4 md:h-6 bg-blue-500 mr-2 md:mr-3 rounded-full flex-shrink-0"></span><span class="break-words">$1</span></h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-base md:text-lg font-semibold mb-2 md:mb-3 mt-4 md:mt-6 text-blue-700 flex items-center flex-wrap"><span class="w-2 h-2 bg-blue-400 mr-2 rounded-full flex-shrink-0"></span><span class="break-words">$1</span></h3>')
      .replace(/^# (.*$)/gim, '<h1 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 mt-6 md:mt-8 text-slate-900 border-b-2 border-slate-200 pb-3 break-words">$1</h1>')
      // 处理列表项 - 移动端优化
      .replace(/^\* (.*$)/gim, '<li class="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-2 pl-3 md:pl-4 border-l-3 border-transparent hover:border-blue-200 transition-colors break-words">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="text-gray-700 text-sm md:text-base leading-6 md:leading-7 mb-2 pl-3 md:pl-4 border-l-3 border-transparent hover:border-blue-200 transition-colors break-words">$1</li>')
      // 处理段落 - 移动端优化
      .replace(/^([^#*\d\n<].*$)/gim, '<p class="my-2 md:my-3 text-gray-800 leading-6 md:leading-7 text-sm md:text-base break-words">$1</p>')
      // 处理粗体 - 移动端优化
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-blue-800 bg-blue-50 px-1 py-0.5 rounded text-sm md:text-base break-words">$1</strong>')
      // 包装列表 - 移动端优化
      .replace(/(<li[^>]*>.*?<\/li>)/gs, '<ul class="list-none pl-0 mb-4 md:mb-6 space-y-2 bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-100 overflow-hidden">$1</ul>');
  };

  // 判断是markdown批改结果
  if (result.isMarkdown && result.markdownContent) {
    return (
      <div className="space-y-6 md:space-y-8">
        {/* 图片预览区，仅有图片时显示 */}
        {imageUrl && (
          <>
            <div className="flex flex-col items-center mb-6 md:mb-8">
              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 w-full max-w-sm md:max-w-md">
                <div
                  tabIndex={0}
                  title="点击可放大/全屏查看"
                  className="relative rounded-xl overflow-hidden shadow-md border border-blue-100 bg-slate-50 w-full aspect-[4/3] group cursor-zoom-in transition hover:scale-[1.02] hover:shadow-xl"
                  style={{ outline: 'none' }}
                  onClick={() => setShowPreview(true)}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setShowPreview(true)}
                >
                  <img
                    src={imageUrl}
                    alt="上传的作文预览"
                    className="object-contain w-full h-full transition"
                    draggable={false}
                  />
                  {/* 放大icon */}
                  <div className="absolute right-2 md:right-3 bottom-2 md:bottom-3 bg-white/90 rounded-full p-1.5 md:p-2 shadow-lg group-hover:bg-white group-hover:scale-110 transition-all">
                    <Maximize className="w-4 h-4 md:w-5 md:h-5 text-sky-700" />
                  </div>
                  {/* 蒙版 */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-blue-50/40 via-white/10 to-transparent" />
                </div>
                <div className="text-xs md:text-sm text-gray-500 mt-2 md:mt-3 text-center font-medium">上传图片预览（点击可放大全屏）</div>
              </div>
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

        {/* 渲染 markdown 内容，优化布局和样式 */}
        <Card className="shadow-xl border-blue-100 bg-white">
          <CardHeader className="pb-3 md:pb-4 bg-gradient-to-r from-blue-50 to-slate-50 rounded-t-lg px-4 md:px-6 py-4 md:py-6">
            <CardTitle className="text-xl md:text-2xl text-center gradient-text flex items-center justify-center flex-wrap">
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-green-500 flex-shrink-0" />
              <span>智能批改结果</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-8">
            <div 
              className="prose prose-slate max-w-none prose-img:rounded-lg prose-img:shadow-lg overflow-hidden"
              style={{ 
                fontSize: '14px',
                lineHeight: '1.6',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
              dangerouslySetInnerHTML={{
                __html: processMarkdownContent(result.markdownContent)
              }}
            />
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mt-6 md:mt-8 pb-6 md:pb-8 px-4 md:px-0">
          <Button variant="outline" onClick={exportResult} className="shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            导出报告
          </Button>
          <Button onClick={onNewGrading} className="gradient-bg text-white shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto">
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
              {result.strengths?.map((strength, index) => (
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
              {result.improvements?.map((improvement, index) => (
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
