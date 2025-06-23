import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, BookOpen, Save, Eye, PenTool, Target, Lightbulb, Brain } from 'lucide-react';
import { fetchTopicById, EssayTopic } from '@/services/topicService';
import Header from '@/components/Header';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Writing = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<EssayTopic | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [showMindMap, setShowMindMap] = useState(false);

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
    // 计算字数（中文字符和英文单词分别计数）
    const text = content.trim();
    // 匹配中文字符
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    // 匹配英文单词（包括带连字符和数字的单词）
    const englishWords = text
      .replace(/[\u4e00-\u9fa5]/g, '') // 去除中文字符
      .split(/\s+/) // 按空白字符分割
      .filter(word => /[a-zA-Z0-9]/.test(word)).length; // 只计算包含字母或数字的单词

    setWordCount(chineseChars + englishWords);
  }, [content]);

  const handleSave = async () => {
    if (!content.trim()) return;
    
    try {
      setSaving(true);
      // TODO: 实现保存功能
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟保存
      // await saveEssay(id, content);
    } catch (err) {
      console.error('Error saving essay:', err);
    } finally {
      setSaving(false);
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
                onClick={handleSave}
                disabled={saving || !content.trim()}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? '保存中...' : '保存草稿'}
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
                  <Button size="sm" variant="outline" className="shrink-0" onClick={() => setShowExamples(true)}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    查看范文
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

      <Dialog open={showExamples} onOpenChange={setShowExamples}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>范文示例</DialogTitle>
          </DialogHeader>
          <div className="prose max-h-[60vh] overflow-y-auto">
            {/* 范文内容将从API获取 */}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showMindMap} onOpenChange={setShowMindMap}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>思维导图</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {/* 思维导图内容将从API获取 */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Writing; 