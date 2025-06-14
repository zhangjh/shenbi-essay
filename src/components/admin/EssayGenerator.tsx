
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, FileText, Search } from 'lucide-react';
import { toast } from 'sonner';
import { searchEssayTopics, EssayTopic } from '@/services/topicService';

const EssayGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<EssayTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<EssayTopic | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [essayContent, setEssayContent] = useState('');
  const [author, setAuthor] = useState('');
  const [score, setScore] = useState('');

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const result = await searchEssayTopics({ pageSize: 100 });
      setTopics(result.data);
    } catch (error) {
      toast.error('加载题目失败');
    }
  };

  const filteredTopics = topics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTopicSelect = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    setSelectedTopic(topic || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopic || !essayContent.trim()) {
      toast.error('请选择题目并填写范文内容');
      return;
    }

    setLoading(true);
    try {
      // 这里调用后端API保存范文
      await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟API调用
      toast.success('范文生成成功！');
      setEssayContent('');
      setAuthor('');
      setScore('');
    } catch (error) {
      toast.error('生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>范文生成工具</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 题目选择 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>搜索题目</Label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="输入题目关键词搜索"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>选择题目</Label>
              <Select onValueChange={handleTopicSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择一个题目" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {filteredTopics.map(topic => (
                    <SelectItem key={topic.id} value={topic.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{topic.title}</span>
                        <div className="flex space-x-1 ml-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">
                            {topic.grade}
                          </span>
                          <span className="text-xs bg-green-100 text-green-700 px-1 rounded">
                            {topic.type}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTopic && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <h4 className="font-medium text-blue-900 mb-2">{selectedTopic.title}</h4>
                  <p className="text-sm text-blue-700 mb-2">{selectedTopic.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedTopic.tags.map(tag => (
                      <span key={tag} className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">作者</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="范文作者（可选）"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="score">评分</Label>
                <Input
                  id="score"
                  type="number"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="范文评分（可选）"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">范文内容</Label>
              <Textarea
                id="content"
                value={essayContent}
                onChange={(e) => setEssayContent(e.target.value)}
                placeholder="请输入范文内容..."
                rows={12}
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading || !selectedTopic || !essayContent.trim()} 
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  保存范文
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EssayGenerator;
