
import React, { useState, useEffect } from 'react';
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
  XCircle, 
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { searchEssayTopics, EssayTopic } from '@/services/topicService';

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
      // 调用题目接口，传递audit=2参数
      const result = await searchEssayTopics({
        page: currentPage,
        pageSize,
        // 这里需要在topicService中支持audit参数
        // audit: 2
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
      // 调用审核通过API
      await new Promise(resolve => setTimeout(resolve, 500));
      // 重新加载数据
      loadPendingTopics();
      toast.success('题目审核通过');
    } catch (error) {
      toast.error('操作失败');
    }
  };

  const handleReject = async (id: string) => {
    try {
      // 调用审核拒绝API
      await new Promise(resolve => setTimeout(resolve, 500));
      // 重新加载数据
      loadPendingTopics();
      toast.success('题目已拒绝');
    } catch (error) {
      toast.error('操作失败');
    }
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
                    <div className="font-medium">{topic.title}</div>
                    <div className="text-sm text-gray-500 truncate">{topic.description}</div>
                    {topic.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {topic.tags.map(tag => (
                          <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-1 rounded">
                            {tag}
                          </span>
                        ))}
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
                  {/* 这里显示提交时间，实际项目中从API获取 */}
                  <span className="text-sm text-gray-600">
                    {new Date().toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApprove(topic.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(topic.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
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
