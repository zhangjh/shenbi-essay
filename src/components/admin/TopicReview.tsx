
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
  Clock, 
  Eye,
  Filter
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface PendingTopic {
  id: string;
  title: string;
  type: string;
  grade: string;
  difficulty: string;
  description: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const TopicReview = () => {
  const [topics, setTopics] = useState<PendingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadPendingTopics();
  }, []);

  const loadPendingTopics = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockTopics: PendingTopic[] = [
        {
          id: '1',
          title: '我的家乡',
          type: '记叙文',
          grade: '小学',
          difficulty: '简单',
          description: '写一篇关于家乡的作文，描述家乡的美景和特色。',
          submittedBy: '用户123',
          submittedAt: '2025-01-10',
          status: 'pending'
        },
        {
          id: '2',
          title: '科技改变生活',
          type: '议论文',
          grade: '高中',
          difficulty: '困难',
          description: '论述科技对现代生活的影响，分析利弊并提出自己的观点。',
          submittedBy: '用户456',
          submittedAt: '2025-01-09',
          status: 'pending'
        }
      ];
      setTopics(mockTopics);
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
      setTopics(prev => prev.map(topic => 
        topic.id === id ? { ...topic, status: 'approved' as const } : topic
      ));
      toast.success('题目审核通过');
    } catch (error) {
      toast.error('操作失败');
    }
  };

  const handleReject = async (id: string) => {
    try {
      // 调用审核拒绝API
      await new Promise(resolve => setTimeout(resolve, 500));
      setTopics(prev => prev.map(topic => 
        topic.id === id ? { ...topic, status: 'rejected' as const } : topic
      ));
      toast.success('题目已拒绝');
    } catch (error) {
      toast.error('操作失败');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-orange-600"><Clock className="w-3 h-3 mr-1" />待审核</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600"><CheckCircle className="w-3 h-3 mr-1" />已通过</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600"><XCircle className="w-3 h-3 mr-1" />已拒绝</Badge>;
      default:
        return null;
    }
  };

  const filteredTopics = topics.filter(topic => 
    statusFilter === 'all' || topic.status === statusFilter
  );

  if (loading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>用户提交题目审核</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="pending">待审核</SelectItem>
                <SelectItem value="approved">已通过</SelectItem>
                <SelectItem value="rejected">已拒绝</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
              <TableHead>提交者</TableHead>
              <TableHead>提交时间</TableHead>
              <TableHead>状态</TableHead>
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
                <TableCell>{topic.difficulty}</TableCell>
                <TableCell>{topic.submittedBy}</TableCell>
                <TableCell>{topic.submittedAt}</TableCell>
                <TableCell>{getStatusBadge(topic.status)}</TableCell>
                <TableCell>
                  {topic.status === 'pending' && (
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
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredTopics.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            暂无{statusFilter !== 'all' ? getStatusBadge(statusFilter)?.props.children[1] : ''}题目
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopicReview;
