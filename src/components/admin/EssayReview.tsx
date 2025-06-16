
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
  Filter,
  FileText
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { auditEssay } from '@/services/essayService';

interface PendingEssay {
  id: string;
  title: string;
  topicTitle: string;
  author: string;
  content: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  score?: number;
}

const EssayReview = () => {
  const [essays, setEssays] = useState<PendingEssay[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadPendingEssays();
  }, []);

  const loadPendingEssays = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockEssays: PendingEssay[] = [
        {
          id: '1',
          title: '我的家乡之美',
          topicTitle: '我的家乡',
          author: '小明',
          content: '我的家乡是一个美丽的小城市，坐落在青山绿水之间。春天的时候，山花烂漫，溪水潺潺；夏天的时候，绿树成荫，凉风习习...',
          submittedBy: '用户123',
          submittedAt: '2025-01-10 14:30:25',
          status: 'pending',
          score: 85
        },
        {
          id: '2',
          title: '科技的双刃剑',
          topicTitle: '科技改变生活',
          author: '小红',
          content: '随着科技的飞速发展，我们的生活发生了翻天覆地的变化。科技给我们带来了便利，但同时也带来了一些挑战...',
          submittedBy: '用户456',
          submittedAt: '2025-01-09 16:45:12',
          status: 'pending',
          score: 92
        }
      ];
      setEssays(mockEssays);
    } catch (error) {
      toast.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const result = await auditEssay(id);
      if (result.success) {
        setEssays(prev => prev.map(essay => 
          essay.id === id ? { ...essay, status: 'approved' as const } : essay
        ));
        toast.success('范文审核通过');
      } else {
        toast.error(result.errorMsg || '操作失败');
      }
    } catch (error) {
      toast.error('操作失败');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setEssays(prev => prev.map(essay => 
        essay.id === id ? { ...essay, status: 'rejected' as const } : essay
      ));
      toast.success('范文已拒绝');
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

  const filteredEssays = essays.filter(essay => 
    statusFilter === 'all' || essay.status === statusFilter
  );

  if (loading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>用户提交范文审核</span>
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
              <TableHead>作文标题</TableHead>
              <TableHead>所属题目</TableHead>
              <TableHead>作者</TableHead>
              <TableHead>提交者</TableHead>
              <TableHead>提交时间</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEssays.map((essay) => (
              <TableRow key={essay.id}>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="p-0 h-auto font-medium text-left">
                        {essay.title}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{essay.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>作者：{essay.author}</span>
                          <span>题目：{essay.topicTitle}</span>
                          {essay.score && <span>评分：{essay.score}分</span>}
                        </div>
                        <div className="prose max-w-none">
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {essay.content}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{essay.topicTitle}</Badge>
                </TableCell>
                <TableCell>{essay.author}</TableCell>
                <TableCell>{essay.submittedBy}</TableCell>
                <TableCell>{formatDateTime(essay.submittedAt)}</TableCell>
                <TableCell>{getStatusBadge(essay.status)}</TableCell>
                <TableCell>
                  {essay.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(essay.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(essay.id)}
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
        {filteredEssays.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            暂无{statusFilter !== 'all' ? getStatusBadge(statusFilter)?.props.children[1] : ''}范文
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EssayReview;
