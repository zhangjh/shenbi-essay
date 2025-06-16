
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

export const fetchEssayByTopic = async (topicId: string): Promise<EssayResponse> => {
  try {
    const response = await fetch(`https://tx.zhangjh.cn/shenbi/essay/queryByTopic/${topicId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      errorMsg: '获取范文失败，请稍后重试'
    };
  }
};

export const generateEssayBatch = async (topicIds: string[]): Promise<EssayGenerateResponse> => {
  try {
    const response = await fetch('https://tx.zhangjh.cn/shenbi/essay/generateBatch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ topicIds })
    });
    
    const res = await response.json();
    return res;
  } catch (error) {
    console.error('Failed to generate essays:', error);
    return {
      success: false,
      errorMsg: '生成范文失败'
    };
  }
};

export const auditEssay = async (essayId: string): Promise<EssayAuditResponse> => {
  try {
    const response = await fetch('https://tx.zhangjh.cn/shenbi/essay/audit', {
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
