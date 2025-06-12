export interface ApiEssayTopic {
  id: string;
  title: string;
  level: number; // 3-12 表示三年级至高三
  difficulty: number; // 0-2 表示简单，中等，困难
  category: number; // 0-6 表示不同类型
  desc: string;
  tags: string[];
  guide?: string; // 写作指导
  mind?: string; // markdown形式的脑图数据
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
}

// const API_BASE_URL = import.meta.env.VITE_BIZ_DOMAIN + '/shenbi';
const API_BASE_URL = 'https://tx.zhangjh.cn/shenbi';

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
    4: '散文',
    5: '小说',
    6: '其他'
  };
  return categoryMap[category as keyof typeof categoryMap] || '其他';
};

const transformApiDataToEssayTopic = (apiData: ApiEssayTopic): EssayTopic => {
  return {
    id: apiData.id,
    title: apiData.title,
    type: mapCategoryToType(apiData.category),
    grade: mapLevelToGrade(apiData.level),
    difficulty: mapDifficultyToText(apiData.difficulty),
    description: apiData.desc,
    tags: apiData.tags || [],
    guide: apiData.guide,
    mind: apiData.mind
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
