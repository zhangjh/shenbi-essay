
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Star, 
  StarOff, 
  Search,
  Filter
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { searchEssayTopics, EssayTopic } from '@/services/topicService';

const FeaturedTopics = () => {
  const [topics, setTopics] = useState<EssayTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    setLoading(true);
    try {
      const result = await searchEssayTopics({ pageSize: 200 });
      setTopics(result.data);
    } catch (error) {
      toast.error('加载题目失败');
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (topicId: string, currentStatus: boolean) => {
    try {
      // 调用API切换精选状态
      await new Promise(resolve => setTimeout(resolve, 500));
      setTopics(prev => prev.map(topic => 
        topic.id === topicId 
          ? { ...topic, important: !currentStatus }
          : topic
      ));
      toast.success(currentStatus ? '已取消精选' : '已加入精选');
    } catch (error) {
      toast.error('操作失败');
    }
  };

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = gradeFilter === 'all' || topic.grade === gradeFilter;
    const matchesType = typeFilter === 'all' || topic.type === typeFilter;
    
    return matchesSearch && matchesGrade && matchesType;
  });

  const featuredCount = topics.filter(topic => topic.important).length;

  if (loading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{featuredCount}</p>
                <p className="text-sm text-gray-600">精选题目</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{topics.length}</p>
                <p className="text-sm text-gray-600">总题目数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{filteredTopics.length}</p>
                <p className="text-sm text-gray-600">筛选结果</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 主内容 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span>精选题目管理</span>
          </CardTitle>
          
          {/* 筛选区域 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索题目..."
                className="pl-10"
              />
            </div>
            
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="选择年级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部年级</SelectItem>
                <SelectItem value="小学">小学</SelectItem>
                <SelectItem value="初中">初中</SelectItem>
                <SelectItem value="高中">高中</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="选择类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="记叙文">记叙文</SelectItem>
                <SelectItem value="说明文">说明文</SelectItem>
                <SelectItem value="应用文">应用文</SelectItem>
                <SelectItem value="议论文">议论文</SelectItem>
                <SelectItem value="散文">散文</SelectItem>
                <SelectItem value="小说">小说</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setGradeFilter('all');
                setTypeFilter('all');
              }}
            >
              清除筛选
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>题目</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>年级</TableHead>
                <TableHead>难度</TableHead>
                <TableHead>标签</TableHead>
                <TableHead>精选状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTopics.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell className="max-w-xs">
                    <div>
                      <div className="font-medium">{topic.title}</div>
                      <div className="text-sm text-gray-500 truncate">{topic.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{topic.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{topic.grade}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      topic.difficulty === '简单' ? 'bg-green-100 text-green-700' :
                      topic.difficulty === '中等' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {topic.difficulty}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-32">
                      {topic.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {topic.tags.length > 2 && (
                        <span className="text-xs text-gray-500">+{topic.tags.length - 2}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {topic.important ? (
                      <Badge className="bg-yellow-100 text-yellow-700">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        精选
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        <StarOff className="w-3 h-3 mr-1" />
                        普通
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleFeatured(topic.id, topic.important)}
                      className={topic.important ? "text-yellow-600 hover:text-yellow-700" : "text-gray-600 hover:text-gray-700"}
                    >
                      {topic.important ? (
                        <>
                          <StarOff className="w-4 h-4 mr-1" />
                          取消
                        </>
                      ) : (
                        <>
                          <Star className="w-4 h-4 mr-1" />
                          精选
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredTopics.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              没有找到符合条件的题目
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedTopics;
