export interface ApiEssayTopic {
  id: string;
  title: string;
  level: number; // 3-12 表示三年级至高三
  difficulty: number; // 0-2 表示简单，中等，困难
  category: number; // 0-6 表示不同类型
  sub_category: number; // 子分类
  description: string;
  tags: string; // 逗号分隔的字符串
  guide?: string; // 写作指导
  mind?: string; // markdown形式的脑图数据
  source: string; // 来源：system 或其他
  important: number; // 是否精选：1表示精选，0表示不精选
}

export interface EssayTopic {
  id: string;
  title: string;
  type: string;
  grade: string;
  difficulty: string;
  description: string;
  tags: string[];
  guide?: string;
  mind?: string;
  source: string;
  important: boolean;
  subCategory: number;
}

export interface TopicSearchParams {
  title?: string;
  level?: number;
  levels?: number[]; // 新增：支持多个level值
  category?: number;
  sub_category?: number;
  important?: number;
  source?: string;
  difficulty?: number;
  audit?: number; // 新增：审核状态参数
  page?: number;
  pageSize?: number;
}

export interface TopicGenerateParams {
  title?: string;
  level?: number;
  category?: number;
  difficulty?: number;
  description?: string;
  tags?: string;
  source?: string;
  count: number;
}

export interface TopicGenerateResponse {
  success: boolean;
  data?: Array<{
    title: string;
    level?: number;
    category?: number;
    sub_category?: number;
    difficulty?: number;
    description?: string;
    guide?: string;
    mind?: string;
  }>;
  errorMsg?: string;
}

const API_BASE_URL = import.meta.env.VITE_BIZ_DOMAIN + '/shenbi';

// 映射函数
const mapLevelToGrade = (level: number): string => {
  if (level >= 3 && level <= 6) return '小学';
  if (level >= 7 && level <= 9) return '初中';
  if (level >= 10 && level <= 12) return '高中';
  return '其他';
};

const mapDifficultyToText = (difficulty: number): string => {
  const difficultyMap = {
    0: '简单',
    1: '中等',
    2: '困难'
  };
  return difficultyMap[difficulty as keyof typeof difficultyMap] || '未知';
};

const mapCategoryToType = (category: number): string => {
  const categoryMap = {
    0: '记叙文',
    1: '说明文',
    2: '应用文',
    3: '议论文',
    4: '其他'
  };
  return categoryMap[category as keyof typeof categoryMap] || '其他';
};

const transformApiDataToEssayTopic = (apiData: ApiEssayTopic): EssayTopic => {
  // Handle tags that might come as a string instead of an array
  let tags = [];
  if (typeof apiData.tags === 'string') {
    tags = apiData.tags.split(',').filter(tag => tag.trim() !== '');
  }

  return {
    id: apiData.id,
    title: apiData.title,
    type: mapCategoryToType(apiData.category),
    grade: mapLevelToGrade(apiData.level),
    difficulty: mapDifficultyToText(apiData.difficulty),
    description: apiData.description,
    tags: tags,
    guide: apiData.guide,
    mind: apiData.mind,
    source: apiData.source,
    important: apiData.important === 1,
    subCategory: apiData.sub_category
  };
};

export const fetchEssayTopics = async (): Promise<EssayTopic[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/topic?important=1&pageSize=27`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const res = await response.json();
    if(!res.success) {
      throw new Error(res.errorMsg);
    }
    return res.data.map(transformApiDataToEssayTopic);
  } catch (error) {
    console.error('Failed to fetch essay topics:', error);
    throw new Error('获取作文题目失败');
  }
};

export const searchEssayTopics = async (params: TopicSearchParams): Promise<{ data: EssayTopic[], total: number }> => {
  try {
    const searchParams = new URLSearchParams();
    
    if (params.title) searchParams.append('title', params.title);
    if (params.level !== undefined) searchParams.append('level', params.level.toString());
    // 新增：支持levels数组参数
    if (params.levels && params.levels.length > 0) {
      searchParams.append('levels', params.levels.join(','));
    }
    if (params.category !== undefined) searchParams.append('category', params.category.toString());
    if (params.sub_category !== undefined) searchParams.append('sub_category', params.sub_category.toString());
    if (params.important !== undefined) searchParams.append('important', params.important.toString());
    if (params.source) searchParams.append('source', params.source);
    if (params.difficulty !== undefined) searchParams.append('difficulty', params.difficulty.toString());
    if (params.audit !== undefined) searchParams.append('audit', params.audit.toString()); // 新增audit参数
    
    searchParams.append('page', (params.page || 1).toString());
    searchParams.append('pageSize', (params.pageSize || 20).toString());

    const response = await fetch(`${API_BASE_URL}/topic?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const res = await response.json();
    if(!res.success) {
      throw new Error(res.errorMsg);
    }
    
    return {
      data: res.data.map(transformApiDataToEssayTopic),
      total: res.total || res.data.length
    };
  } catch (error) {
    console.error('Failed to search essay topics:', error);
    throw new Error('搜索作文题目失败');
  }
};

export const fetchTopicById = async (id: string): Promise<EssayTopic> => {
  try {
    const response = await fetch(`${API_BASE_URL}/topic/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const res = await response.json();
    if(!res.success) {
      throw new Error(res.errorMsg);
    }
    return transformApiDataToEssayTopic(res.data);
  } catch (error) {
    console.error('Failed to fetch topic by id:', error);
    throw new Error('获取题目详情失败');
  }
};

export const generateTopics = async (params: TopicGenerateParams): Promise<TopicGenerateResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/topic/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    
    const res = await response.json();
    return res;
  } catch (error) {
    console.error('Failed to generate topics:', error);
    return {
      success: false,
      errorMsg: '生成题目失败'
    };
  }
};

export const auditTopic = async (topicId: string): Promise<{ success: boolean; errorMsg?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/topic/audit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ topicId })
    });
    
    const res = await response.json();
    return res;
  } catch (error) {
    console.error('Failed to audit topic:', error);
    return {
      success: false,
      errorMsg: '审核失败'
    };
  }
};
