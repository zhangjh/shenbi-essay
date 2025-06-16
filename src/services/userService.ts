
interface RegisterUserData {
  userName: string;
  avatar: string;
  extId: string;
  extType: string;
  email: string;
  mobile: string;
  productType: string;
}

const API_BASE_URL = import.meta.env.VITE_BIZ_DOMAIN;
export const registerUser = async (userData: RegisterUserData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('用户注册成功:', result);
    return result;
  } catch (error) {
    console.error('用户注册失败:', error);
    throw error;
  }
};
