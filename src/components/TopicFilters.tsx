import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

export interface FilterState {
  title: string;
  level: number | undefined;
  category: number | undefined;
  sub_category: number | undefined;
  important: number | undefined;
  source: string;
  difficulty: number | undefined;
}

interface TopicFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onSearch: () => void;
  onReset: () => void;
}

const gradeOptions = [
  { value: 'all', label: '全部年级' },
  { value: '3', label: '三年级' },
  { value: '4', label: '四年级' },
  { value: '5', label: '五年级' },
  { value: '6', label: '六年级' },
  { value: '7', label: '初中' },
  { value: '10', label: '高中' },
  { value: '13', label: '高考真题' },
];

const categoryOptions = [
  { value: 'all', label: '全部分类' },
  { value: '0', label: '记叙文' },
  { value: '1', label: '说明文' },
  { value: '2', label: '应用文' },
  { value: '3', label: '议论文' },
  { value: '4', label: '其他' },
];

// 子分类映射关系
const subCategoryMap: Record<number, { value: string; label: string }[]> = {
  0: [
    { value: '0', label: '记人' },
    { value: '1', label: '写景' },
    { value: '2', label: '叙事' },
    { value: '3', label: '状物' },
  ],
  1: [
    { value: '0', label: '实体事物' },
    { value: '1', label: '事理' },
    { value: '2', label: '科学小品' },
  ],
  2: [
    { value: '0', label: '书信' },
    { value: '1', label: '公文' },
    { value: '2', label: '契据' },
  ],
  3: [
    { value: '0', label: '立论' },
    { value: '1', label: '驳论' },
  ],
  4: [
    { value: '0', label: '其他' },
  ],
};

const difficultyOptions = [
  { value: 'all', label: '全部难度' },
  { value: '0', label: '简单' },
  { value: '1', label: '中等' },
  { value: '2', label: '困难' },
];

const importantOptions = [
  { value: 'all', label: '全部题目' },
  { value: '1', label: '精选题目' },
  { value: '0', label: '普通题目' },
];

import { baseSourceOptions, gaokaoSourceOptions } from '@/utils/constants';

const TopicFilters = ({ filters, onFiltersChange, onSearch, onReset }: TopicFiltersProps) => {
  // 获取当前可用的子分类选项
  const getAvailableSubCategories = () => {
    if (filters.category === undefined) {
      return [];
    }
    return subCategoryMap[filters.category] || [];
  };

  const updateFilter = (key: keyof FilterState, value: string | number | undefined) => {
    const newFilters = {
      ...filters,
      [key]: value
    };

    // 如果分类改变，清空子分类
    if (key === 'category') {
      newFilters.sub_category = undefined;
    }

    // 如果年级改变为高考真题或从高考真题改变为其他，重置来源
    if (key === 'level') {
      const oldIsGaokao = filters.level === 13;
      const newIsGaokao = value === 13;
      
      if (oldIsGaokao !== newIsGaokao) {
        newFilters.source = '';
      }
    }

    onFiltersChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.title) count++;
    if (filters.level !== undefined) count++;
    if (filters.category !== undefined) count++;
    if (filters.sub_category !== undefined) count++;
    if (filters.important !== undefined) count++;
    if (filters.source) count++;
    if (filters.difficulty !== undefined) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();
  const availableSubCategories = getAvailableSubCategories();

  return (
    <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* 搜索栏 */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="搜索题目标题..."
              value={filters.title}
              onChange={(e) => updateFilter('title', e.target.value)}
              className="pl-12 h-12 text-base border-gray-200 focus:border-primary focus:ring-primary/20 bg-white/70"
            />
          </div>

          {/* 快捷筛选 - 左对齐 */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={filters.important === 1}
                onCheckedChange={(checked) => updateFilter('important', checked ? 1 : undefined)}
              />
              <Label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                仅显示精选题目
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="system-only"
                checked={filters.source === 'system'}
                onCheckedChange={(checked) => updateFilter('source', checked ? 'system' : '')}
              />
              <Label htmlFor="system-only" className="text-sm font-medium cursor-pointer">
                仅显示系统生成
              </Label>
            </div>
          </div>

          {/* 主要筛选条件 - 左对齐 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">年级</Label>
              <Select
                value={filters.level?.toString() || 'all'}
                onValueChange={(value) => updateFilter('level', value === 'all' ? undefined : parseInt(value))}
              >
                <SelectTrigger className="h-9 bg-white border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {gradeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">分类</Label>
              <Select
                value={filters.category?.toString() || 'all'}
                onValueChange={(value) => updateFilter('category', value === 'all' ? undefined : parseInt(value))}
              >
                <SelectTrigger className="h-9 bg-white border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">子分类</Label>
              <Select
                value={filters.sub_category?.toString() || 'all'}
                onValueChange={(value) => updateFilter('sub_category', value === 'all' ? undefined : parseInt(value))}
                disabled={filters.category === undefined}
              >
                <SelectTrigger className="h-9 bg-white border-gray-200">
                  <SelectValue placeholder={filters.category === undefined ? "先选择分类" : "选择子分类"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部子分类</SelectItem>
                  {availableSubCategories.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">难度</Label>
              <Select
                value={filters.difficulty?.toString() || 'all'}
                onValueChange={(value) => updateFilter('difficulty', value === 'all' ? undefined : parseInt(value))}
              >
                <SelectTrigger className="h-9 bg-white border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficultyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">精选状态</Label>
              <Select
                value={filters.important?.toString() || 'all'}
                onValueChange={(value) => updateFilter('important', value === 'all' ? undefined : parseInt(value))}
              >
                <SelectTrigger className="h-9 bg-white border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {importantOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">题目来源</Label>
              <Select
                value={filters.source || 'all'}
                onValueChange={(value) => updateFilter('source', value === 'all' ? '' : value)}
              >
                <SelectTrigger className="h-9 bg-white border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(filters.level === 13 ? gaokaoSourceOptions : baseSourceOptions).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 操作按钮 - 左对齐 */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              {activeFiltersCount > 0 && (
                <>
                  <Badge variant="secondary" className="bg-primary/10 text-primary h-8 px-3 flex items-center">
                    <Filter className="h-3 w-3 mr-1" />
                    {activeFiltersCount} 个筛选条件
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={onReset}
                    className="h-8 px-3 text-xs hover:bg-gray-50"
                  >
                    <X className="h-3 w-3 mr-1" />
                    清空筛选
                  </Button>
                </>
              )}
            </div>
            <Button 
              onClick={onSearch}
              className="h-10 px-6 bg-primary hover:bg-primary/90 w-full sm:w-auto"
            >
              <Search className="h-4 w-4 mr-2" />
              搜索题目
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicFilters;
