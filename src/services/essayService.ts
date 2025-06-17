interface Essay {
  id: string;
  title: string;
  essay: string;
  author?: string;
  score?: number;
}

interface EssayResponse {
  success: boolean;
  data?: Essay[];
  errorMsg?: string;
}

interface EssayGenerateResponse {
  success: boolean;
  data?: string[];
  errorMsg?: string;
}

interface EssayAuditResponse {
  success: boolean;
  errorMsg?: string;
}

interface EssayShareResponse {
  success: boolean;
  errorMsg?: string;
}

interface EssayCountResponse {
  success: boolean;
  data?: Essay[];
  total?: number;
  page?: number;
  pageSize?: number;
  errorMsg?: string;
}

interface EssayPreviewResponse {
  success: boolean;
  data?: string;
  errorMsg?: string;
}

const API_BASE_URL = import.meta.env.VITE_BIZ_DOMAIN + '/shenbi';

export const fetchEssayByTopic = async (topicId: string): Promise<EssayResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/essay/queryByTopic/${topicId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      errorMsg: '获取范文失败，请稍后重试'
    };
  }
};

export const fetchEssayCountByTopic = async (topicId: string): Promise<EssayCountResponse> => {
  try {
    const response = await fetch(`https://tx.zhangjh.cn/shenbi/essay/?topic_id=${topicId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch essay count:', error);
    return {
      success: false,
      errorMsg: '获取范文数量失败'
    };
  }
};

export const fetchEssayPreviewByTopic = async (topicId: string): Promise<EssayPreviewResponse> => {
  try {
    const response = await fetch(`https://tx.zhangjh.cn/essay/queryByTopic/${topicId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch essay preview:', error);
    return {
      success: false,
      errorMsg: '获取范文预览失败'
    };
  }
};

// ... keep existing code (generateEssayBatch, auditEssay, shareEssay functions)
