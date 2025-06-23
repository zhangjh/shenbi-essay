const API_BASE_URL = import.meta.env.VITE_BIZ_DOMAIN + '/shenbi';

export const generateTopicFromImage = async (imageBase64: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/topic/generateByImg`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileImg: imageBase64
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.topic;
};

export const generateEssayFromImage = async (topic: string, userId: string): Promise<ReadableStream> => {
  const response = await fetch(`${API_BASE_URL}/essay/generate/${topic}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: userId,
      shared: 1
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (!response.body) {
    throw new Error('Response body is null');
  }

  return response.body;
};
