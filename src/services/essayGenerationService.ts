
export const generateEssayByImage = async (base64Image: string): Promise<ReadableStream<Uint8Array>> => {
  try {
    const response = await fetch('https://tx.zhangjh.cn/shenbi/essay/generateByImg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileImg: base64Image
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    return response.body;
  } catch (error) {
    console.error('生成范文失败:', error);
    throw error;
  }
};

export const readStreamAsText = async (stream: ReadableStream<Uint8Array>): Promise<string> => {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
    }
    return result;
  } finally {
    reader.releaseLock();
  }
};
