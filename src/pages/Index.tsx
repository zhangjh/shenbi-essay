
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import GradeSelector from '@/components/GradeSelector';
import EssayTopics from '@/components/EssayTopics';
import FeatureCard from '@/components/FeatureCard';
import SEO from '@/components/SEO';
import { Search, Camera, Edit } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [selectedGrade, setSelectedGrade] = useState('elementary');

  const mainFeatures = [
    {
      title: "题目解析",
      description: "获得详细的题目分析和思维导图，理解写作要求和思路",
      icon: <Search className="w-8 h-8 text-white" />,
      buttonText: "开始解析",
      onButtonClick: () => navigate('/topics')
    },
    {
      title: "智能批改",
      description: "上传作文照片或文档，获得专业的AI批改意见和改进建议",
      icon: <Edit className="w-8 h-8 text-white" />,
      buttonText: "智能批改",
      onButtonClick: () => navigate('/grading')
    },
    {
      title: "拍照生成范文",
      description: "拍照上传题目图片，AI智能生成高质量范文，快速学习写作技巧",
      icon: <Camera className="w-8 h-8 text-white" />,
      buttonText: "拍照生成",
      onButtonClick: () => navigate('/photo-essay')
    }
  ];

  // 首页SEO参数
  const seoTitle = "神笔作文 - 中小学生作文学习平台 | 智能批改 题目解析 写作指导";
  const seoDesc = "神笔作文是专为中小学生打造的作文学习平台，提供智能批改、题目解析、范文学习、拍照生成范文等功能。涵盖小学、初中、高中各年级，助力学生提升写作水平。";
  const seoKeywords = "作文学习,作文批改,作文题目,小学作文,初中作文,高中作文,智能批改,写作指导,作文范文,记叙文,议论文,说明文";
  const canonicalUrl = window.location.origin + '/';

  return (
    <>
      {/* SEO标签渲染 */}
      <SEO
        title={seoTitle}
        description={seoDesc}
        keywords={seoKeywords}
        canonical={canonicalUrl}
        ogImage={'/assets/logo.png'}
        ogType="website"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <Header />

        <HeroSection />

        {/* Main Features Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-2 md:mb-4">核心功能</h2>
              <p className="text-gray-600 text-lg">全方位的作文学习支持，让写作更轻松</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              {mainFeatures.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </section>

        {/* Grade Selection Section */}
        <section className="py-12 md:py-16 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-2 md:mb-4">选择年级段</h2>
              <p className="text-gray-600 text-lg">不同年级，不同要求，个性化学习更有效</p>
            </div>
            
            <GradeSelector 
              selectedGrade={selectedGrade} 
              onGradeChange={setSelectedGrade} 
            />
          </div>
        </section>

        {/* Essay Topics Section */}
        <section className="py-12 md:py-20 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <EssayTopics selectedGrade={selectedGrade} />
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            {/* Desktop: 4 columns, Mobile: 2 columns */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {/* Logo and description - spans 2 columns on mobile */}
              <div className="col-span-2 lg:col-span-1">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white">
                    <img src="/assets/logo.png" alt="Logo" className="w-6 h-6" />
                  </div>
                  <span className="text-lg font-bold">神笔作文</span>
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
                  <li>拍照生成</li>
                </ul>
              </div>
              
              {/* Grade coverage column */}
              <div className="col-span-1">
                <h4 className="font-semibold mb-4 text-sm">年级覆盖</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>小学作文</li>
                  <li>初中作文</li>
                  <li>高中作文</li>
                  <li>高考真题</li>
                </ul>
              </div>
              
              {/* Contact info - spans 2 columns on mobile */}
              <div className="col-span-2 lg:col-span-1">
                <h4 className="font-semibold mb-4 text-sm">联系我们</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="break-words">邮箱：zhangjh_initial@126.com</li>
                  <li>
                    <button 
                      onClick={() => navigate('/admin')}
                      className="text-gray-400 hover:text-white transition-colors underline"
                    >
                      管理入口
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p className="text-sm">&copy; 2025 神笔作文. 保留所有权利.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
