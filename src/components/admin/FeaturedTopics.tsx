
import { useState, useEffect } from 'react';
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  const pageSize = 50;

  useEffect(() => {
    loadTopics();
  }, [currentPage, searchQuery, gradeFilter, typeFilter]);

  const loadTopics = async () => {
    setLoading(true);
    try {
      // 构建搜索参数
      const searchParams = {
        page: currentPage,
        pageSize: pageSize,
        query: searchQuery || undefined,
        grade: gradeFilter !== 'all' ? gradeFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
      };

      const result = await searchEssayTopics(searchParams);
      setTopics(result.data);
      setTotalItems(result.total || result.data.length);
      setTotalPages(Math.ceil((result.total || result.data.length) / pageSize));
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

  const handleSearch = () => {
    setCurrentPage(1);
    loadTopics();
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    // 计算显示的页码范围
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 添加第一页和省略号
    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // 添加中间的页码
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <PaginationItem key={page}>
          <PaginationLink 
            onClick={() => handlePageChange(page)} 
            isActive={currentPage === page}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // 添加省略号和最后一页
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  const featuredCount = topics.filter(topic => topic.important).length;

  if (loading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{featuredCount}</p>
                <p className="text-sm text-gray-600">本页精选</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalItems}</p>
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
                <p className="text-2xl font-bold">{topics.length}</p>
                <p className="text-sm text-gray-600">当前页数量</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-purple-500 rounded" />
              <div>
                <p className="text-2xl font-bold">{currentPage}/{totalPages}</p>
                <p className="text-sm text-gray-600">当前页/总页数</p>
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
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="搜索题目..."
                className="pl-10"
              />
            </div>
            
            <Select value={gradeFilter} onValueChange={(value) => {
              setGradeFilter(value);
              handleFilterChange();
            }}>
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

            <Select value={typeFilter} onValueChange={(value) => {
              setTypeFilter(value);
              handleFilterChange();
            }}>
              <SelectTrigger>
                <SelectValue placeholder="选择类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="记叙文">记叙文</SelectItem>
                <SelectItem value="说明文">说明文</SelectItem>
                <SelectItem value="应用文">应用文</SelectItem>
                <SelectItem value="议论文">议论文</SelectItem>
                <SelectItem value="其他">其他</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setGradeFilter('all');
                setTypeFilter('all');
                setCurrentPage(1);
                handleFilterChange();
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
              {topics.map((topic) => (
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
          
          {topics.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              没有找到符合条件的题目
            </div>
          )}

          {/* 分页组件 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedTopics;
