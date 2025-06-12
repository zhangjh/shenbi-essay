
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Users, FileText, Loader2, Target, Lightbulb, PenTool } from 'lucide-react';
import { fetchTopicById, EssayTopic } from '@/services/topicService';
import Header from '@/components/Header';

const TopicAnalysis = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<EssayTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      case '散文':
      case '小说':
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回按钮 */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回题目列表
        </Button>

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
            <CardDescription className="text-base leading-relaxed mt-4">
              {topic.description}
            </CardDescription>
            <div className="flex flex-wrap gap-2 mt-4">
              {topic.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardHeader>
        </Card>

        {/* 解析内容 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                  <span>字数不少于{topic.grade === '小学' ? '300' : topic.grade === '初中' ? '600' : '800'}字</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>注意书写工整，标点符号使用正确</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* 写作思路 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Lightbulb className="w-5 h-5 mr-2 text-primary" />
                写作思路
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="font-semibold text-primary mr-2">1.</span>
                  <span>仔细审题，把握关键词和写作重点</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-primary mr-2">2.</span>
                  <span>确定文章中心思想和要表达的情感</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-primary mr-2">3.</span>
                  <span>列出写作提纲，安排文章结构</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-primary mr-2">4.</span>
                  <span>选择合适的表达方式和修辞手法</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* 操作按钮 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button className="h-12">
            <PenTool className="w-5 h-5 mr-2" />
            查看优秀范文
          </Button>
          <Button variant="outline" className="h-12">
            <FileText className="w-5 h-5 mr-2" />
            下载题目解析
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopicAnalysis;
