
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, 
  FileText, 
  Users, 
  CheckCircle, 
  Star,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import TopicGenerator from '@/components/admin/TopicGenerator';
import EssayGenerator from '@/components/admin/EssayGenerator';
import TopicReview from '@/components/admin/TopicReview';
import EssayReview from '@/components/admin/EssayReview';
import FeaturedTopics from '@/components/admin/FeaturedTopics';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('generator');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回首页</span>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900">后台管理</h1>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              管理员模式
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
            <TabsTrigger value="generator" className="flex items-center space-x-2">
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">题目生成</span>
            </TabsTrigger>
            <TabsTrigger value="essay-generator" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">范文生成</span>
            </TabsTrigger>
            <TabsTrigger value="topic-review" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">题目审核</span>
            </TabsTrigger>
            <TabsTrigger value="essay-review" className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span className="hidden sm:inline">范文审核</span>
            </TabsTrigger>
            <TabsTrigger value="featured" className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">精选管理</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator">
            <TopicGenerator />
          </TabsContent>

          <TabsContent value="essay-generator">
            <EssayGenerator />
          </TabsContent>

          <TabsContent value="topic-review">
            <TopicReview />
          </TabsContent>

          <TabsContent value="essay-review">
            <EssayReview />
          </TabsContent>

          <TabsContent value="featured">
            <FeaturedTopics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
