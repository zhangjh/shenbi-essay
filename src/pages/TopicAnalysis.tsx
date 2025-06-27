import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, Users, FileText, Loader2, Target, Lightbulb, PenTool, Brain, Star, Edit } from 'lucide-react';
import { fetchTopicById, EssayTopic } from '@/services/topicService';
import { fetchEssayByTopic } from '@/services/essayService';
import Header from '@/components/Header';
import WritingGuide from '@/components/WritingGuide';
const MindMap = lazy(() => import('@/components/MindMap'));
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

interface Essay {
  id: string;
  title: string;
  essay: string;
  author?: string;
  score?: number;
}

const TopicAnalysis = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [topic, setTopic] = useState<EssayTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEssayDialog, setShowEssayDialog] = useState(false);

  const [essays, setEssays] = useState<Essay[]>([]);
  const [selectedEssayId, setSelectedEssayId] = useState<string>('');
  const [loadingEssay, setLoadingEssay] = useState(false);
  const [essayError, setEssayError] = useState<string | null>(null);

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
        
        // 设置页面标题，利于SEO
        if (data) {
          document.title = `${data.title} - 题目解析 - 神笔作文`;
          
          // 设置meta描述
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', `${data.title} - ${data.description} - 神笔作文提供专业的作文题目解析`);
          }
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

  const handleStartWriting = () => {
    if (!id) return;
    if (!user) {
      toast.error('请先登录后再开始写作');
      return;
    }
    navigate(`/topic/${id}/write`);
  };

  const handleViewEssay = async () => {
    if (!id) return;
    
    try {
      setLoadingEssay(true);
      setEssayError(null);
      const response = await fetchEssayByTopic(id);
      
      if (response.success && response.data) {
        setEssays(response.data);
        if (response.data.length > 0) {
          setSelectedEssayId(response.data[0].id);
          setShowEssayDialog(true);
        } else {
          setEssayError('暂无范文');
        }
      } else {
        setEssayError(response.errorMsg || '获取范文失败');
      }
    } catch (err) {
      setEssayError('获取范文失败，请稍后重试');
      console.error('Error fetching essay:', err);
    } finally {
      setLoadingEssay(false);
    }
  };

  const selectedEssay = essays.find(essay => essay.id === selectedEssayId);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '简单': return 'bg-green-100 text-green-700';
      case '中等': return 'bg-yellow-100 text-yellow-700';
      case '困难': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case '记叙文': return <BookOpen className="w-5 h-5" />;
      case '议论文': return <Users className="w-5 h-5" />;
      case '说明文': 
      case '应用文': 
      case '其他':
        return <FileText className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-gray-600">正在加载题目详情...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <h1>{topic?.title} - 作文题目解析与写作指导</h1>
      </section>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回按钮 */}
        <div className="flex justify-start mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/topics')}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回题目列表
          </Button>
        </div>

        {/* 题目标题卡片 */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getTypeIcon(topic.type)}
                <Badge variant="outline">{topic.type}</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{topic.grade}</Badge>
                <Badge className={getDifficultyColor(topic.difficulty)}>
                  {topic.difficulty}
                </Badge>
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl">{topic.title}</CardTitle>
            <div className="prose prose-sm max-w-none mt-4 text-left">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {topic.description}
              </ReactMarkdown>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {topic.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardHeader>
        </Card>

        {/* 题目解析和脑图分析 */}
        <Tabs defaultValue="guide" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="guide" className="flex items-center">
              <Lightbulb className="w-4 h-4 mr-2" />
              写作指导
            </TabsTrigger>
            <TabsTrigger value="mind" className="flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              思维导图
            </TabsTrigger>
            <TabsTrigger value="requirements" className="flex items-center">
              <Target className="w-4 h-4 mr-2" />
              写作要求
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guide">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Lightbulb className="w-5 h-5 mr-2 text-primary" />
                  写作指导
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topic.guide ? (
                  <div className="text-left">
                    <WritingGuide content={topic.guide} />
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">暂无写作指导内容</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mind">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Brain className="w-5 h-5 mr-2 text-primary" />
                  思维导图分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topic.mind ? (
                  <Suspense fallback={<div>加载中...</div>}>
                    <MindMap content={topic.mind} />
                  </Suspense>
                ) : (
                  <p className="text-gray-500 text-center py-8">暂无思维导图内容</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements">
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
                    <span>字数不少于{topic.grade === '小学' ? '300' : topic.grade === '初中' ? '600' : '800'}字</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>注意书写工整，标点符号使用正确</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 操作按钮 */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="flex-1 h-12 text-lg" 
              onClick={handleViewEssay}
              disabled={loadingEssay}
            >
              {loadingEssay ? (
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
              ) : (
                <BookOpen className="w-6 h-6 mr-2" />
              )}
              {loadingEssay ? '加载中...' : '查看优秀范文'}
            </Button>
            <Button 
              className="flex-1 h-12 text-lg" 
              variant="secondary"
              onClick={handleStartWriting}
            >
              <PenTool className="w-6 h-6 mr-2" />
              开始写作
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            建议先阅读题目解析和范文，理解写作要求后再开始写作
          </p>
        </div>

        {/* 范文对话框 */}
        <Dialog open={showEssayDialog} onOpenChange={setShowEssayDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>优秀范文</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {essayError ? (
                <p className="text-red-500 text-center py-4">{essayError}</p>
              ) : essays.length > 0 ? (
                <>
                  <Tabs
                    value={selectedEssayId}
                    onValueChange={setSelectedEssayId}
                    className="w-full"
                  >
                    <TabsList className="w-full flex-wrap h-auto gap-2 bg-transparent">
                      {essays.map((essay) => (
                        <TabsTrigger
                          key={essay.id}
                          value={essay.id}
                          className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          <span>{essay.title || `范文${essays.indexOf(essay) + 1}`}</span>
                          {essay.score && (
                            <div className="flex items-center text-yellow-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="ml-1">{essay.score}</span>
                            </div>
                          )}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {selectedEssay && (
                      <div className="mt-4">
                        {/* {selectedEssay.author && (
                          <p className="text-sm text-muted-foreground mb-4">
                            作者：{selectedEssay.author}
                          </p>
                        )} */}
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {selectedEssay.essay}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </Tabs>
                </>
              ) : null}
            </div>
          </DialogContent>
        </Dialog>
        
      </div>
    </div>
  );
};

export default TopicAnalysis;
