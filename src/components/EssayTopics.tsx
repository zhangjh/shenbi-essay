
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, FileText } from 'lucide-react';

interface EssayTopic {
  id: string;
  title: string;
  type: string;
  grade: string;
  difficulty: string;
  description: string;
  tags: string[];
}

const mockTopics: EssayTopic[] = [
  {
    id: '1',
    title: '我的理想',
    type: '记叙文',
    grade: '小学',
    difficulty: '简单',
    description: '写一篇关于自己理想的作文，表达对未来的憧憬和努力方向。',
    tags: ['理想', '未来', '成长']
  },
  {
    id: '2',
    title: '环境保护的重要性',
    type: '议论文',
    grade: '初中',
    difficulty: '中等',
    description: '论述环境保护的重要性，提出具体的保护措施和建议。',
    tags: ['环保', '议论文', '社会责任']
  },
  {
    id: '3',
    title: '科技改变生活',
    type: '说明文',
    grade: '高中',
    difficulty: '困难',
    description: '分析科技发展对现代生活的影响，举例说明科技带来的变化。',
    tags: ['科技', '生活', '说明文']
  },
  {
    id: '4',
    title: '难忘的一天',
    type: '记叙文',
    grade: '小学',
    difficulty: '简单',
    description: '记录一个特别难忘的日子，描述具体的事件和感受。',
    tags: ['记叙', '回忆', '情感']
  }
];

interface EssayTopicsProps {
  selectedGrade: string;
}

const EssayTopics = ({ selectedGrade }: EssayTopicsProps) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const filteredTopics = selectedGrade === 'all' 
    ? mockTopics 
    : mockTopics.filter(topic => {
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
      case '说明文': return <FileText className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

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
                  <Button className="w-full" size="sm">
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
