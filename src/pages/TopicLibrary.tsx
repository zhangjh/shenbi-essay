import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { BookOpen, Users, FileText, Loader2, Star } from 'lucide-react';
import { searchEssayTopics, EssayTopic } from '@/services/topicService';
import TopicFilters, { FilterState } from '@/components/TopicFilters';
import Header from '@/components/Header';
import SEO from '@/components/SEO';

const TopicLibrary = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // 从URL参数初始化筛选条件
  const [filters, setFilters] = useState<FilterState>({
    title: searchParams.get('title') || '',
    level: searchParams.get('level') ? parseInt(searchParams.get('level')!) : undefined,
    category: searchParams.get('category') ? parseInt(searchParams.get('category')!) : undefined,
    sub_category: searchParams.get('sub_category') ? parseInt(searchParams.get('sub_category')!) : undefined,
    important: searchParams.get('important') ? parseInt(searchParams.get('important')!) : undefined,
    source: searchParams.get('source') || '',
    difficulty: searchParams.get('difficulty') ? parseInt(searchParams.get('difficulty')!) : undefined,
  });
  
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const pageSize = 20;

  // 更新URL参数
  const updateSearchParams = (newFilters: FilterState, page: number = 1) => {
    const params = new URLSearchParams();
    
    if (newFilters.title) params.set('title', newFilters.title);
    if (newFilters.level !== undefined) params.set('level', newFilters.level.toString());
    if (newFilters.category !== undefined) params.set('category', newFilters.category.toString());
    if (newFilters.sub_category !== undefined) params.set('sub_category', newFilters.sub_category.toString());
    if (newFilters.important !== undefined) params.set('important', newFilters.important.toString());
    if (newFilters.source) params.set('source', newFilters.source);
    if (newFilters.difficulty !== undefined) params.set('difficulty', newFilters.difficulty.toString());
    if (page > 1) params.set('page', page.toString());
    
    setSearchParams(params);
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['searchTopics', filters, currentPage],
    queryFn: () => searchEssayTopics({
      ...filters,
      page: currentPage,
      pageSize
    }),
  });

  // 生成SEO标题和描述
  const generateSEOTitle = () => {
    let title = '作文题目库';
    if (filters.title) {
      title = `"${filters.title}" 相关作文题目`;
    }
    return `${title} - 神笔作文`;
  };

  const generateSEODescription = () => {
    let description = '海量优质作文题目库，涵盖小学、初中、高中各年级，包含记叙文、议论文、说明文等多种类型';
    if (filters.title) {
      description = `搜索"${filters.title}"相关的作文题目，${description}`;
    }
    return `${description}，助力学生提升写作能力。`;
  };

  useEffect(() => {
    // 设置页面标题和SEO
    document.title = generateSEOTitle();
    
    // 添加meta描述
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', generateSEODescription());
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = generateSEODescription();
      document.head.appendChild(meta);
    }

    // 添加关键词
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', '作文题目,作文题库,小学作文,初中作文,高中作文,记叙文,议论文,说明文,写作练习,作文搜索');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = '作文题目,作文题库,小学作文,初中作文,高中作文,记叙文,议论文,说明文,写作练习,作文搜索';
      document.head.appendChild(meta);
    }
  }, []);

  const handleFiltersChange = (newFilters: FilterState) => {
    setCurrentPage(1);
    setFilters(newFilters);
  };

  const handleSearch = () => {
    updateSearchParams(filters, 1);
    refetch();
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      title: '',
      level: undefined,
      category: undefined,
      sub_category: undefined,
      important: undefined,
      source: '',
      difficulty: undefined,
    };
    setFilters(resetFilters);
    setCurrentPage(1);
    updateSearchParams(resetFilters, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateSearchParams(filters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <>
      <SEO 
        title={generateSEOTitle()}
        description={generateSEODescription()}
        keywords="作文题目,作文题库,小学作文,初中作文,高中作文,记叙文,议论文,说明文,写作练习,作文搜索"
        canonical={`https://shenbi.zhangjh.cn/topics${window.location.search}`}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">作文题目库</h1>
            <p className="text-gray-600 text-lg">海量优质题目，激发写作灵感</p>
          </div>

          {/* 筛选器 */}
          <TopicFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onSearch={handleSearch}
            onReset={handleReset}
          />

          {/* 加载状态 */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-600">正在搜索题目...</span>
            </div>
          )}

          {/* 错误状态 */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error instanceof Error ? error.message : '搜索失败'}</p>
              <Button onClick={() => refetch()}>重新搜索</Button>
            </div>
          )}

          {/* 搜索结果 */}
          {data && (
            <>
              {/* 结果统计 */}
              <div className="mb-6">
                <p className="text-gray-600">
                  共找到 <span className="font-semibold text-primary">{data.total}</span> 个题目
                  {currentPage > 1 && (
                    <span className="ml-2">
                      第 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, data.total)} 个
                    </span>
                  )}
                </p>
              </div>

              {/* 题目列表 */}
              {data.data.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">没有找到符合条件的题目</p>
                  <Button variant="outline" onClick={handleReset}>
                    清空筛选条件
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {data.data.map((topic: EssayTopic) => (
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
                            {topic.important && (
                              <Badge className="bg-yellow-100 text-yellow-700">
                                <Star className="w-3 h-3 mr-1" />
                                精选
                              </Badge>
                            )}
                          </div>
                          <Badge className={getDifficultyColor(topic.difficulty)}>
                            {topic.difficulty}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg line-clamp-2">{topic.title}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{topic.grade}</Badge>
                          <Badge variant="outline" className="text-xs">
                            {topic.source === 'system' ? '系统生成' : '用户共享'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-3 leading-relaxed line-clamp-3">
                          {topic.description}
                        </CardDescription>
                        {topic.tags && topic.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {topic.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {topic.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{topic.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* 分页 */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="cursor-pointer"
                          />
                        </PaginationItem>
                      )}
                      
                      {/* 页码显示逻辑 */}
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
                              isActive={pageNum === currentPage}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="cursor-pointer"
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TopicLibrary;
