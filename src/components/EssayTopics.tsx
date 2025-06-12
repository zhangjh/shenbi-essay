import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, FileText, Loader2 } from 'lucide-react';
import { fetchEssayTopics, EssayTopic } from '@/services/topicService';

interface EssayTopicsProps {
  selectedGrade: string;
}

const EssayTopics = ({ selectedGrade }: EssayTopicsProps) => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [topics, setTopics] = useState<EssayTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEssayTopics();
        setTopics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败');
        console.error('Error loading topics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTopics();
  }, []);

  const filteredTopics = selectedGrade === 'all' 
    ? topics 
    : topics.filter(topic => {
        if (selectedGrade === 'elementary') return topic.grade === '小学';
        if (selectedGrade === 'middle') return topic.grade === '初中';
        if (selectedGrade === 'high') return topic.grade === '高中';
        return true;
      });

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
      case '记叙文': return <BookOpen className="w-4 h-4" />;
      case '议论文': return <Users className="w-4 h-4" />;
      case '说明文': 
      case '应用文': 
      case '散文':
      case '小说':
      case '其他':
        return <FileText className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const handleTopicClick = (topicId: string) => {
    navigate(`/topic/${topicId}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">精选作文题目</h2>
          <p className="text-gray-600">根据年级筛选，找到最适合的练习题目</p>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">正在加载题目...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">精选作文题目</h2>
          <p className="text-gray-600">根据年级筛选，找到最适合的练习题目</p>
        </div>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>重新加载</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">精选作文题目</h2>
        <p className="text-gray-600">根据年级筛选，找到最适合的练习题目</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => (
          <Card 
            key={topic.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
              selectedTopic === topic.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(topic.type)}
                  <Badge variant="outline">{topic.type}</Badge>
                </div>
                <Badge className={getDifficultyColor(topic.difficulty)}>
                  {topic.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-lg">{topic.title}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{topic.grade}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3 leading-relaxed">
                {topic.description}
              </CardDescription>
              <div className="flex flex-wrap gap-1 mb-4">
                {topic.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              {selectedTopic === topic.id && (
                <div className="space-y-2 animate-fade-in">
                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTopicClick(topic.id);
                    }}
                  >
                    查看题目解析
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    查看范文
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EssayTopics;
