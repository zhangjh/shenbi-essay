const API_BASE_URL = import.meta.env.VITE_BIZ_DOMAIN + '/shenbi';
export const generateEssayFromImage = async (imageBase64: string): Promise<ReadableStream> => {
  const response = await fetch(`${API_BASE_URL}/essay/generateByImg`, {
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

  if (!response.body) {
    throw new Error('Response body is null');
  }

  return response.body;
};
