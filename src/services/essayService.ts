
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
    const response = await fetch(`${API_BASE_URL}/essay/?topic_id=${topicId}`);
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

export const generateEssayBatch = async (topicIds: string[]): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/essay/generateBatch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ topicIds })
    });
    
    const res = await response.text();
    return res;
  } catch (error) {
    console.error('Failed to generate essays:', error);
    return '生成范文失败';
  }
};

export const auditEssay = async (essayId: string): Promise<EssayAuditResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/essay/audit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ essayId })
    });
    
    const res = await response.json();
    return res;
  } catch (error) {
    console.error('Failed to audit essay:', error);
    return {
      success: false,
      errorMsg: '审核失败'
    };
  }
};

export const shareEssay = async (essayId: string): Promise<EssayShareResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/essay/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ essayId })
    });
    
    const res = await response.json();
    return res;
  } catch (error) {
    console.error('Failed to share essay:', error);
    return {
      success: false,
      errorMsg: '共享失败'
    };
  }
};
