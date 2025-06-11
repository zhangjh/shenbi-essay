
import { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import GradeSelector from '@/components/GradeSelector';
import EssayTopics from '@/components/EssayTopics';
import FeatureCard from '@/components/FeatureCard';
import { BookOpen, Search, Users, Upload, Edit } from 'lucide-react';

const Index = () => {
  const [selectedGrade, setSelectedGrade] = useState('all');

  const mainFeatures = [
    {
      title: "题目解析",
      description: "获得详细的题目分析和思维导图，理解写作要求和思路",
      icon: <Search className="w-8 h-8 text-white" />,
      buttonText: "开始解析",
      onButtonClick: () => console.log("Start analysis")
    },
    {
      title: "上传题目",
      description: "上传自己的作文题目，获得专业的分析指导和范文参考",
      icon: <Upload className="w-8 h-8 text-white" />,
      buttonText: "上传题目",
      onButtonClick: () => console.log("Upload topic")
    },
    {
      title: "作文批改",
      description: "提交您的作文，获得详细的批改意见和改进建议",
      icon: <Edit className="w-8 h-8 text-white" />,
      buttonText: "提交作文",
      onButtonClick: () => console.log("Submit essay")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <HeroSection />

      {/* Grade Selection Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">选择年级段</h2>
            <p className="text-gray-600 text-lg">不同年级，不同要求，个性化学习更有效</p>
          </div>
          
          <GradeSelector 
            selectedGrade={selectedGrade} 
            onGradeChange={setSelectedGrade} 
          />
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">核心功能</h2>
            <p className="text-gray-600 text-lg">全方位的作文学习支持，让写作更轻松</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Essay Topics Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EssayTopics selectedGrade={selectedGrade} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop: 4 columns, Mobile: 2 columns */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Logo and description - spans 2 columns on mobile */}
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">作文助手</span>
              </div>
              <p className="text-gray-400 text-sm">让每个学生都能写出优秀的作文</p>
            </div>
            
            {/* Features column */}
            <div className="col-span-1">
              <h4 className="font-semibold mb-4 text-sm">功能特色</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>题目解析</li>
                <li>范文学习</li>
                <li>智能批改</li>
                <li>个性指导</li>
              </ul>
            </div>
            
            {/* Grade coverage column */}
            <div className="col-span-1">
              <h4 className="font-semibold mb-4 text-sm">年级覆盖</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>小学作文</li>
                <li>初中作文</li>
                <li>高中作文</li>
                <li>专项训练</li>
              </ul>
            </div>
            
            {/* Contact info - spans 2 columns on mobile */}
            <div className="col-span-2 lg:col-span-1">
              <h4 className="font-semibold mb-4 text-sm">联系我们</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>客服热线：400-123-4567</li>
                <li className="break-words">邮箱：help@essay-assistant.com</li>
                <li>QQ群：123456789</li>
              </ul>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p className="text-sm">&copy; 2024 作文助手. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
