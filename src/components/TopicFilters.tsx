
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

export interface FilterState {
  title: string;
  level: number | undefined;
  category: number | undefined;
  sub_category: number | undefined;
  important: number | undefined;
  source: string;
}

interface TopicFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onSearch: () => void;
  onReset: () => void;
}

const gradeOptions = [
  { value: undefined, label: '全部年级' },
  { value: 3, label: '三年级' },
  { value: 4, label: '四年级' },
  { value: 5, label: '五年级' },
  { value: 6, label: '六年级' },
  { value: 7, label: '七年级' },
  { value: 8, label: '八年级' },
  { value: 9, label: '九年级' },
  { value: 10, label: '高一' },
  { value: 11, label: '高二' },
  { value: 12, label: '高三' },
];

const categoryOptions = [
  { value: undefined, label: '全部分类' },
  { value: 0, label: '记叙文' },
  { value: 1, label: '说明文' },
  { value: 2, label: '应用文' },
  { value: 3, label: '议论文' },
  { value: 4, label: '散文' },
  { value: 5, label: '小说' },
  { value: 6, label: '其他' },
];

const importantOptions = [
  { value: undefined, label: '全部题目' },
  { value: 1, label: '精选题目' },
  { value: 0, label: '普通题目' },
];

const sourceOptions = [
  { value: '', label: '全部来源' },
  { value: 'system', label: '系统生成' },
  { value: 'user', label: '用户共享' },
];

const TopicFilters = ({ filters, onFiltersChange, onSearch, onReset }: TopicFiltersProps) => {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.title) count++;
    if (filters.level !== undefined) count++;
    if (filters.category !== undefined) count++;
    if (filters.sub_category !== undefined) count++;
    if (filters.important !== undefined) count++;
    if (filters.source) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* 标题搜索 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="title">题目标题</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="title"
                  placeholder="输入题目标题关键词..."
                  value={filters.title}
                  onChange={(e) => updateFilter('title', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* 筛选条件 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>年级</Label>
              <Select
                value={filters.level?.toString() || ''}
                onValueChange={(value) => updateFilter('level', value ? parseInt(value) : undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择年级" />
                </SelectTrigger>
                <SelectContent>
                  {gradeOptions.map((option) => (
                    <SelectItem key={option.label} value={option.value?.toString() || ''}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>分类</Label>
              <Select
                value={filters.category?.toString() || ''}
                onValueChange={(value) => updateFilter('category', value ? parseInt(value) : undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.label} value={option.value?.toString() || ''}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>精选状态</Label>
              <Select
                value={filters.important?.toString() || ''}
                onValueChange={(value) => updateFilter('important', value ? parseInt(value) : undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  {importantOptions.map((option) => (
                    <SelectItem key={option.label} value={option.value?.toString() || ''}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>题目来源</Label>
              <Select
                value={filters.source}
                onValueChange={(value) => updateFilter('source', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择来源" />
                </SelectTrigger>
                <SelectContent>
                  {sourceOptions.map((option) => (
                    <SelectItem key={option.label} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Filter className="h-3 w-3" />
                  {activeFiltersCount} 个筛选条件
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onReset} disabled={activeFiltersCount === 0}>
                <X className="h-4 w-4 mr-2" />
                重置
              </Button>
              <Button onClick={onSearch}>
                <Search className="h-4 w-4 mr-2" />
                搜索
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicFilters;
