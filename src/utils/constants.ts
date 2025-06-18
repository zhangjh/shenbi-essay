// 基础来源选项
export const baseSourceOptions = [
  { value: 'all', label: '全部来源' },
  { value: 'system', label: '系统生成' },
  { value: 'user', label: '用户共享' },
];

// 高考真题来源选项
export const gaokaoSourceOptions = [
  { value: 'all', label: '全部来源' },
  { value: 'gaokao1', label: '全国卷I' },
  { value: 'gaokao2', label: '全国卷II' },
  { value: 'quanguo3', label: '全国卷III' }, 
  { value: 'gaokao', label: '全国卷' },
  { value: 'quanguojia', label: '全国甲卷' },
  { value: 'quanguoyi', label: '全国乙卷' },
  { value: 'xinkb', label: '新课标卷' },
  { value: 'quanguoxinkb1', label: '全国新课标I卷' },
  { value: 'quanguoxinkb2', label: '全国新课标II卷' },
  { value: 'quanguoxingk1', label: '全国新高考I卷' },
  { value: 'quanguoxingk2', label: '全国新高考II卷' },
  { value: 'beijing', label: '北京卷' },
  { value: 'tianjin', label: '天津卷' },
  { value: 'shanghai', label: '上海卷' },
  { value: 'zhejiang', label: '浙江卷' },
  { value: 'jiangsu', label: '江苏卷' },
  { value: 'shandong', label: '山东卷' },
  { value: 'fujian', label: '福建卷' },
  { value: 'hubei', label: '湖北卷' },
  { value: 'chongqing', label: '重庆卷' },
  { value: 'henan', label: '河南卷' },
  { value: 'hunan', label: '湖南卷' },
  { value: 'anhui', label: '安徽卷' },
  { value: 'sichuan', label: '四川卷' },
  { value: 'guangdong', label: '广东卷' },
  { value: 'liaoning', label: '辽宁卷' },
  { value: 'jiangxi', label: '江西卷' },
  { value: 'hainan', label: '海南卷' },
  { value: 'shaanxi', label: '陕西卷' },
  { value: 'guangxi', label: '广西卷' },
  { value: 'hebei', label: '河北卷' },
  { value: 'ningxia', label: '宁夏卷' },
  { value: 'xinjiang', label: '新疆卷' },
  { value: 'heilongjiang', label: '黑龙江卷' }
];

// 所有来源选项的映射关系
export const sourceMap = new Map<string, string>();

// 初始化映射关系
baseSourceOptions.forEach(option => {
  if (option.value !== 'all') {
    sourceMap.set(option.value, option.label);
  }
});

gaokaoSourceOptions.forEach(option => {
  if (option.value !== 'all') {
    sourceMap.set(option.value, option.label);
  }
});

// 获取来源显示名称的辅助函数
export const getSourceLabel = (source: string): string => {
  return sourceMap.get(source) || '其他来源';
};