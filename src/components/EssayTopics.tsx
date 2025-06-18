import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { BookOpen, Users, FileText, Loader2 } from 'lucide-react';
import { searchEssayTopics, EssayTopic } from '@/services/topicService';

interface EssayTopicsProps {
  selectedGrade: string;
}

const EssayTopics = ({ selectedGrade }: EssayTopicsProps) => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<EssayTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const pageSize = 9;

  // 检测是否为移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 获取年级对应的level参数
  const getGradeLevel = (grade: string) => {
    if (grade === 'elementary') return [3, 4, 5, 6];
    if (grade === 'middle') return [7];
    if (grade === 'high') return [10];
    return [];
  };

  const loadTopics = useCallback(async (page: number, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const levels = getGradeLevel(selectedGrade);
      if (levels.length === 0) return;
      
      // 修改为传递levels数组而不是单个level
      const data = await searchEssayTopics({
        levels: levels, // 传递整个levels数组
        important: 1,
        page,
        pageSize
      });
      
      if (append) {
        setTopics(prev => [...prev, ...data.data]);
      } else {
        setTopics(data.data);
      }
      
      setTotalPages(Math.ceil(data.total / pageSize));
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败');
      console.error('Error loading topics:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedGrade]);

  // 初始加载
  useEffect(() => {
    setCurrentPage(1);
    setTopics([]);
    loadTopics(1, false);
  }, [selectedGrade, loadTopics]);

  // 桌面端翻页
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadTopics(page, false);
    // 滚动到顶部
    document.querySelector('#essay-topics-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // 移动端下拉加载更多
  const loadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadTopics(nextPage, true);
    }
  };

  // 移动端滚动监听
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // 当滚动到距离底部100px时触发加载
      if (scrollTop + windowHeight >= documentHeight - 100) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, currentPage, totalPages, loadingMore]);

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
      case '其他':
        return <FileText className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  if (loading && topics.length === 0) {
    return (
      <div className="space-y-6" id="essay-topics-section">
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

  if (error && topics.length === 0) {
    return (
      <div className="space-y-6" id="essay-topics-section">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">精选作文题目</h2>
          <p className="text-gray-600">根据年级筛选，找到最适合的练习题目</p>
        </div>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => loadTopics(1, false)}>重新加载</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="essay-topics-section">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">精选作文题目</h2>
        <p className="text-gray-600">根据年级筛选，找到最适合的练习题目</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Card 
            key={topic.id}
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            onClick={() => navigate(`/topic/${topic.id}`)}
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
              <div className="flex flex-wrap gap-1">
                {topic.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 移动端加载更多指示器 */}
      {isMobile && currentPage < totalPages && (
        <div className="flex justify-center py-6">
          {loadingMore ? (
            <div className="flex items-center">
              <Loader2 className="w-5 h-5 animate-spin text-primary mr-2" />
              <span className="text-gray-600">正在加载更多...</span>
            </div>
          ) : (
            <Button 
              variant="outline" 
              onClick={loadMore}
              className="px-6"
            >
              加载更多
            </Button>
          )}
        </div>
      )}

      {/* 桌面端分页器 */}
      {!isMobile && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                >
                  上一页
                </PaginationPrevious>
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNum)}
                      isActive={currentPage === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                >
                  下一页
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* 移动端到达底部提示 */}
      {isMobile && currentPage >= totalPages && topics.length > 0 && (
        <div className="text-center py-6 text-gray-500">
          已加载全部内容
        </div>
      )}
    </div>
  );
};

export default EssayTopics;
