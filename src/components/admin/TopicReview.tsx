
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  CheckCircle, 
  Eye
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { searchEssayTopics, EssayTopic, auditTopic } from '@/services/topicService';

const TopicReview = () => {
  const [topics, setTopics] = useState<EssayTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    loadPendingTopics();
  }, [currentPage]);

  const loadPendingTopics = async () => {
    setLoading(true);
    try {
      const result = await searchEssayTopics({
        page: currentPage,
        pageSize,
        audit: 2
      });
      setTopics(result.data);
      setTotalPages(Math.ceil(result.total / pageSize));
    } catch (error) {
      toast.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const result = await auditTopic(id);
      if (result.success) {
        loadPendingTopics();
        toast.success('题目审核通过');
      } else {
        toast.error(result.errorMsg || '操作失败');
      }
    } catch (error) {
      toast.error('操作失败');
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="w-5 h-5" />
          <span>用户提交题目审核</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>题目</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>年级</TableHead>
              <TableHead>难度</TableHead>
              <TableHead>提交时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.map((topic) => (
              <TableRow key={topic.id}>
                <TableCell className="max-w-xs">
                  <div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" className="p-0 h-auto font-medium text-left">
                          {topic.title.length > 20 ? `${topic.title.substring(0, 20)}...` : topic.title}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{topic.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>类型：{topic.type}</span>
                            <span>年级：{topic.grade}</span>
                            <span>难度：{topic.difficulty}</span>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">题目描述：</h4>
                            <p className="text-sm leading-relaxed">{topic.description}</p>
                          </div>
                          {topic.tags.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">标签：</h4>
                              <div className="flex flex-wrap gap-2">
                                {topic.tags.map(tag => (
                                  <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {topic.guide && (
                            <div>
                              <h4 className="font-medium mb-2">写作指导：</h4>
                              <p className="text-sm leading-relaxed">{topic.guide}</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    <div className="text-sm text-gray-500 truncate">{topic.description}</div>
                    {topic.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {topic.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-1 rounded">
                            {tag}
                          </span>
                        ))}
                        {topic.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{topic.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{topic.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{topic.grade}</Badge>
                </TableCell>
                <TableCell>{topic.difficulty}</TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {formatDateTime(new Date().toISOString())}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApprove(topic.id)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    通过
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {topics.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            暂无待审核题目
          </div>
        )}

        {/* 分页控制 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-gray-600">
              第 {currentPage} 页，共 {totalPages} 页
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                下一页
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopicReview;
