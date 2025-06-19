import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, FileText, CheckSquare, Eye } from 'lucide-react'; //新增了Eye图标
import { toast } from 'sonner';
import { searchEssayTopics, EssayTopic } from '@/services/topicService';
import { generateEssayBatch, fetchEssayCountByTopic, fetchEssayPreviewByTopic } from '@/services/essayService';

interface TopicWithEssayCount extends EssayTopic {
  essayCount?: number;
  countLoading?: boolean;
}

const EssayGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<TopicWithEssayCount[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    loadTopics();
  }, [currentPage]);

  const loadTopics = async () => {
    try {
      const result = await searchEssayTopics({ 
        page: currentPage, 
        pageSize 
      });
      const topicsWithCount = result.data.map(topic => ({
        ...topic,
        essayCount: 0,
        countLoading: true
      }));
      setTopics(topicsWithCount);
      setTotalPages(Math.ceil(result.total / pageSize));
      
      // 异步加载每个题目的范文数量
      loadEssayCountsForTopics(topicsWithCount);
    } catch (error) {
      toast.error('加载题目失败');
    }
  };

  const loadEssayCountsForTopics = async (topicsToLoad: TopicWithEssayCount[]) => {
    for (const topic of topicsToLoad) {
      try {
        const countResult = await fetchEssayCountByTopic(topic.id);
        if (countResult.success) {
          setTopics(prevTopics => 
            prevTopics.map(t => 
              t.id === topic.id 
                ? { ...t, essayCount: countResult.total || 0, countLoading: false }
                : t
            )
          );
        } else {
          setTopics(prevTopics => 
            prevTopics.map(t => 
              t.id === topic.id 
                ? { ...t, essayCount: 0, countLoading: false }
                : t
            )
          );
        }
      } catch (error) {
        setTopics(prevTopics => 
          prevTopics.map(t => 
            t.id === topic.id 
              ? { ...t, essayCount: 0, countLoading: false }
              : t
          )
        );
      }
    }
  };

  const handleTopicSelect = (topicId: string, checked: boolean) => {
    if (checked) {
      setSelectedTopics(prev => [...prev, topicId]);
    } else {
      setSelectedTopics(prev => prev.filter(id => id !== topicId));
    }
  };

  const handleSelectAll = () => {
    if (selectedTopics.length === topics.length) {
      setSelectedTopics([]);
    } else {
      setSelectedTopics(topics.map(topic => topic.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTopics.length === 0) {
      toast.error('请至少选择一个题目');
      return;
    }

    setLoading(true);
    const topicCount = selectedTopics.length;
    
    try {
      // 显示开始生成的提示
      toast.info(`开始生成 ${topicCount} 篇范文，请稍候...`);
      
      // 开始生成范文，服务端会确保所有任务完成后才返回
      const result = await generateEssayBatch(selectedTopics);
      
      // 检查返回结果是否表示成功
      if (result && result !== '生成范文失败') {
        // 清空选中状态
        setSelectedTopics([]);
        toast.success(`成功生成 ${topicCount} 篇范文`);
        
        // 重新加载题目列表以更新范文数量
        loadTopics();
      } else {
        toast.error('生成失败，请重试');
      }
    } catch (error) {
      toast.error('生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleEssayPreview = async (topic: TopicWithEssayCount) => {
    if (topic.essayCount === 0) {
      toast.error('该题目暂无范文');
      return;
    }

    setPreviewLoading(true);
    setPreviewTitle(topic.title);
    setShowPreviewDialog(true);
    
    try {
      const result = await fetchEssayPreviewByTopic(topic.id);
      if (result.success && result.data) {
        setPreviewContent(result.data[0].essay);
      } else {
        setPreviewContent('获取范文内容失败');
        toast.error(result.errorMsg || '获取范文失败');
      }
    } catch (error) {
      setPreviewContent('获取范文内容失败');
      toast.error('获取范文失败，请重试');
    } finally {
      setPreviewLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>范文生成工具</span>
              </CardTitle>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  已选择 {selectedTopics.length} 个题目
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="flex items-center space-x-1"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>{selectedTopics.length === topics.length ? '取消全选' : '全选'}</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topics.map(topic => (
                <div key={topic.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    checked={selectedTopics.includes(topic.id)}
                    onCheckedChange={(checked) => handleTopicSelect(topic.id, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h4 
                          className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => handleEssayPreview(topic)}
                          title="点击预览范文内容"
                        >
                          {topic.title}
                        </h4>
                        {topic.essayCount > 0 && (
                          <span title="预览范文">
                            <Eye 
                              className="w-4 h-4 text-blue-500 cursor-pointer hover:text-blue-700"
                              onClick={() => handleEssayPreview(topic)}
                            />
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {topic.grade}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {topic.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {topic.difficulty}
                        </Badge>
                        {topic.countLoading ? (
                          <Badge variant="outline" className="text-xs flex items-center space-x-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>统计中...</span>
                          </Badge>
                        ) : (
                          <Badge 
                            variant={topic.essayCount === 0 ? "destructive" : "default"} 
                            className="text-xs"
                          >
                            已有范文: {topic.essayCount}篇
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{topic.description}</p>
                    {topic.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {topic.tags.map(tag => (
                          <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* 分页控制 */}
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

              <form onSubmit={handleSubmit}>
                <Button 
                  type="submit" 
                  disabled={loading || selectedTopics.length === 0} 
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      生成范文 ({selectedTopics.length}个题目)
                    </>
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 追加预览范文dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>范文预览</DialogTitle>
            <DialogDescription>
              题目：{previewTitle}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {previewLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>加载中...</span>
              </div>
            ) : (
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {previewContent}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EssayGenerator;
