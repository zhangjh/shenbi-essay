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