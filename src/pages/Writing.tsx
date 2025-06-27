import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, BookOpen, Save, Eye, PenTool, Target, Lightbulb, Brain, Send, Share2, Loader2 } from 'lucide-react';
import { fetchTopicById, EssayTopic } from '@/services/topicService';
import Header from '@/components/Header';
import WritingGuide from '@/components/WritingGuide';
const MindMap = lazy(() => import('@/components/MindMap'));
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { useUser } from '@clerk/clerk-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const API_BASE_URL = import.meta.env.VITE_BIZ_DOMAIN;

const Writing = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [topic, setTopic] = useState<EssayTopic | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [grading, setGrading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showMindMap, setShowMindMap] = useState(false);
  const [showGradingResult, setShowGradingResult] = useState(false);
  const [gradingResult, setGradingResult] = useState('');
  const [essayId, setEssayId] = useState<string | null>(null);

  useEffect(() => {
    const loadTopic = async () => {
      if (!id) {
        setError('无效的题目ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await fetchTopicById(id);
        setTopic(data);
        
        // 从localStorage加载草稿
        const savedContent = localStorage.getItem(`essay_draft_${id}`);
        if (savedContent) {
          setContent(savedContent);
        }
        
        // 设置页面标题
        if (data) {
          document.title = `${data.title} - 写作 - 神笔作文`;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取题目详情失败');
        console.error('Error loading topic:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTopic();
  }, [id]);

  useEffect(() => {
    // 计算字数（统计所有可见字符，排除空白字符）
    const text = content.replace(/\s/g, ''); // 去除所有空白字符
    setWordCount(text.length);
  }, [content]);

  const handleSaveDraft = async () => {
    if (!content.trim()) return;
    
    try {
      setSaving(true);
      localStorage.setItem(`essay_draft_${id}`, content);
      toast.success('草稿已保存到本地');
    } catch (err) {
      console.error('Error saving draft:', err);
      toast.error('保存草稿失败');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('请先输入作文内容');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // 1. 提交作文
      const submitResponse = await fetch(`${API_BASE_URL}/shenbi/essay/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic_id: id,
          source: 'user',
          author: user?.id || 'anonymous',
          shared: 0,
          essay: content
        })
      });
      
      const submitData = await submitResponse.json();
      if (!submitData.success) {
        throw new Error('提交失败');
      }
      
      setEssayId(submitData.data.id);
      toast.success('作文提交成功！');
      localStorage.removeItem(`essay_draft_${id}`);
      
      // 2. 请求评阅
      setGrading(true);
      const gradingResponse = await fetch(`${API_BASE_URL}/shenbi/essay/grading`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          essay: content,
          title: topic?.title,
          description: topic?.description,
          level: topic?.grade,
          weight: 100
        })
      });
      
      if (gradingResponse.ok) {
        const gradingText = await gradingResponse.text();
        setGradingResult(gradingText);
        setShowGradingResult(true);
      } else {
        toast.error('评阅失败，但作文已提交成功');
      }
      
    } catch (err) {
      console.error('Error submitting essay:', err);
      toast.error('提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
      setGrading(false);
    }
  };
  
  const handleShare = async () => {
    if (!essayId) return;
    
    try {
      setSharing(true);
      const response = await fetch(`${API_BASE_URL}/shenbi/essay/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          essayId: essayId
        })
      });
      
      if (response.ok) {
        toast.success('作文已分享到社区！');
      } else {
        throw new Error('分享失败');
      }
    } catch (err) {
      console.error('Error sharing essay:', err);
      toast.error('分享失败，请稍后重试');
    } finally {
      setSharing(false);
    }
  };

  const getRequiredWords = () => {
    if (!topic) return 800;
    switch (topic.grade) {
      case '小学': return 300;
      case '初中': return 600;
      case '高中': return 800;
      default: return 800;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <Header />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-20">
            <PenTool className="w-8 h-8 animate-pulse text-primary" />
            <span className="ml-2 text-gray-600">正在加载题目...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <Header />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error || '题目不存在'}</p>
            <Button onClick={() => navigate('/')}>返回首页</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <Header />
      
      {/* SEO H1 */}
      <section className="sr-only">
        <h1>{topic?.title} - 在线写作编辑器</h1>
      </section>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回按钮和标题 */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/topic/${id}`)}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回题目
          </Button>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{topic.grade}</Badge>
            <Badge variant="outline">{topic.type}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧写作区域 */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>{topic.title}</CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="在这里开始写作..."
                    className="min-h-[500px] resize-none text-base leading-relaxed"
                  />
                  <div className="absolute bottom-4 right-4 flex items-center space-x-4">
                    <span className={`text-sm ${
                      wordCount < getRequiredWords() 
                        ? 'text-red-500' 
                        : 'text-green-500'
                    }`}>
                      {wordCount} / {getRequiredWords()}字
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <Button 
                className="flex-1" 
                variant="outline"
                onClick={handleSaveDraft}
                disabled={saving || !content.trim()}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? '保存中...' : '保存草稿'}
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleSubmit}
                disabled={submitting || grading || !content.trim()}
              >
                {(submitting || grading) ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {submitting ? '提交中...' : grading ? '评阅中...' : '提交作文'}
              </Button>
            </div>
          </div>

          {/* 右侧辅助区域 */}
          <div className="space-y-6">
            {/* 写作要求 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Target className="w-5 h-5 mr-2 text-primary" />
                  写作要求
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>紧扣题目主题，内容要具体生动</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>结构完整，层次清晰，语言流畅</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>字数不少于{getRequiredWords()}字</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>书写工整，标点符号使用正确</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* 写作提示 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Lightbulb className="w-5 h-5 mr-2 text-primary" />
                  写作提示
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Button size="sm" variant="outline" className="shrink-0" onClick={() => setShowGuide(true)}>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    写作指导
                  </Button>
                  <Button size="sm" variant="outline" className="shrink-0" onClick={() => setShowMindMap(true)}>
                    <Brain className="w-4 h-4 mr-2" />
                    思维导图
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>写作指导</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {topic?.guide ? (
              <div className="text-left">
                <WritingGuide content={topic.guide} />
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">暂无写作指导内容</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showMindMap} onOpenChange={setShowMindMap}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>思维导图</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {topic?.mind ? (
              <Suspense fallback={<div className="text-center py-4">加载中...</div>}>
                <MindMap content={topic.mind} />
              </Suspense>
            ) : (
              <p className="text-gray-500 text-center py-8">暂无思维导图内容</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* 评阅结果对话框 */}
      <Dialog open={showGradingResult} onOpenChange={setShowGradingResult}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>作文评阅结果</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {gradingResult}
              </ReactMarkdown>
            </div>
            <div className="flex justify-between pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowGradingResult(false)}
              >
                关闭
              </Button>
              <Button 
                onClick={handleShare}
                disabled={sharing}
              >
                {sharing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Share2 className="w-4 h-4 mr-2" />
                )}
                {sharing ? '分享中...' : '分享到社区'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Writing; 