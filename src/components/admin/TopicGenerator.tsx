import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Plus, Trash2, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateTopics } from '@/services/topicService';

const TopicGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [generatedTopics, setGeneratedTopics] = useState<Array<{ title: string }>>([]);
  const [formData, setFormData] = useState({
    title: '',
    level: '',
    category: '',
    difficulty: '',
    description: '',
    source: '',
    tags: [] as string[],
    count: '1'
  });
  const [newTag, setNewTag] = useState('');

  const gradeOptions = [
    { value: '3', label: '三年级' },
    { value: '4', label: '四年级' },
    { value: '5', label: '五年级' },
    { value: '6', label: '六年级' },
    { value: '7', label: '初中' },
    { value: '10', label: '高中' },
    { value: '13', label: '高考真题' },
  ];

  const categoryOptions = [
    { value: '0', label: '记叙文' },
    { value: '1', label: '说明文' },
    { value: '2', label: '应用文' },
    { value: '3', label: '议论文' },
    { value: '4', label: '其他' }
  ];

  const difficultyOptions = [
    { value: '0', label: '简单' },
    { value: '1', label: '中等' },
    { value: '2', label: '困难' }
  ];

  const sourceOptions = [
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

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const count = parseInt(formData.count);
    if (isNaN(count) || count < 1 || count > 50) {
      toast.error('生成数量必须为1-50之间的数字');
      return;
    }

    setLoading(true);

    try {
      const params = {
        ...(formData.title && { title: formData.title }),
        ...(formData.level && { level: parseInt(formData.level) }),
        ...(formData.category && { category: parseInt(formData.category) }),
        ...(formData.difficulty && { difficulty: parseInt(formData.difficulty) }),
        ...(formData.description && { description: formData.description }),
        ...(formData.source && { source: formData.source }),
        ...(formData.tags.length > 0 && { tags: formData.tags }),
        count
      };

      const result = await generateTopics(params);
      
      if (result.success && result.data) {
        setGeneratedTopics(result.data);
        setShowResultDialog(true);
        toast.success(`成功生成 ${result.data.length} 个题目`);
        
        // 重置表单
        setFormData({
          title: '',
          level: '',
          category: '',
          difficulty: '',
          description: '',
          source: '',
          tags: [],
          count: '1'
        });
      } else {
        toast.error(result.errorMsg || '生成失败，请重试');
      }
    } catch (error) {
      toast.error('生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wand2 className="w-5 h-5" />
            <span>作文题目生成工具</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">题目标题（可选）</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="请输入作文题目"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">年级（可选）</Label>
                <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择年级" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">文体类型（可选）</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择文体类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">难度等级（可选）</Label>
                <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择难度等级" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="count">生成数量</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.count}
                  onChange={(e) => {
                    const value = e.target.value;
                    // 确保输入的是有效数字且在范围内
                    if (value === '' || (Number(value) >= 1 && Number(value) <= 50)) {
                      setFormData(prev => ({ ...prev, count: value }));
                    }
                  }}
                  placeholder="输入生成数量(1-50)"
                />
              </div>

              {formData.level === '13' && (
                <div className="space-y-2">
                  <Label htmlFor="source">试卷来源（可选）</Label>
                  <Select value={formData.source} onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择试卷来源" />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">题目描述（可选）</Label>
              <Textarea
                id="description"
                placeholder="请输入题目描述和要求"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>标签（可选）</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="添加标签"
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline" size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  生成题目
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>题目生成成功</DialogTitle>
            <DialogDescription>
              成功生成 {generatedTopics.length} 个题目
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="font-medium">生成的题目：</p>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {generatedTopics.map((topic) => (
                <div key={topic.title} className="text-sm bg-gray-100 p-2 rounded">
                  {topic.title}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TopicGenerator;
