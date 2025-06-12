
import axios from 'axios';

export interface ApiEssayTopic {
  id: string;
  title: string;
  level: number; // 3-12 表示三年级至高三
  difficulty: number; // 0-2 表示简单，中等，困难
  category: number; // 0-6 表示不同类型
  description: string;
  tags: string[];
}

export interface EssayTopic {
  id: string;
  title: string;
  type: string;
  grade: string;
  difficulty: string;
  description: string;
  tags: string[];
}

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
    description: apiData.description,
    tags: apiData.tags
  };
};

export const fetchEssayTopics = async (): Promise<EssayTopic[]> => {
  try {
    const response = await axios.get<ApiEssayTopic[]>(`${API_BASE_URL}/topic?important=1`);
    return response.data.map(transformApiDataToEssayTopic);
  } catch (error) {
    console.error('Failed to fetch essay topics:', error);
    throw new Error('获取作文题目失败');
  }
};
