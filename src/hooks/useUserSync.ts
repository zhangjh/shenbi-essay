
import { useUser, useAuth } from '@clerk/clerk-react';
import { useEffect, useRef } from 'react';
import { registerUser } from '@/services/userService';
import { toast } from '@/components/ui/sonner';

export const useUserSync = () => {
  const { user, isLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const hasRegistered = useRef(false);

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !isSignedIn || !user || hasRegistered.current) {
        return;
      }

      // 检查用户是否是新注册的（可以通过创建时间判断）
      const now = new Date();
      const createdAt = new Date(user.createdAt);
      const timeDiff = now.getTime() - createdAt.getTime();
      const isNewUser = timeDiff < 60000; // 1分钟内创建的视为新用户

      if (isNewUser) {
        try {
          console.log('新用户注册，同步用户信息到后端...');
          
          const userData = {
            userName: user.username || user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0] || '用户',
            avatar: user.imageUrl || '',
            extId: user.id,
            extType: 'clerk',
            email: user.emailAddresses[0]?.emailAddress || '',
            mobile: user.phoneNumbers[0]?.phoneNumber || '',
            productType: 'shenbi'
          };

          await registerUser(userData);
          hasRegistered.current = true;
          
          toast.success('注册成功', {
            description: '欢迎使用神笔作文！'
          });
        } catch (error) {
          console.error('同步用户信息失败:', error);
          toast.error('注册失败', {
            description: '用户信息同步失败，请稍后重试'
          });
        }
      }
    };

    syncUser();
  }, [user, isLoaded, isSignedIn]);
};
