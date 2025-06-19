import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Users, FileText, Edit, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BookOpen className="w-6 h-6 text-white" />,
      title: "题目解析",
      description: "深入解析各类作文题目，提供思维导图和写作思路",
      color: "bg-education-blue-500"
    },
    {
      icon: <FileText className="w-6 h-6 text-white" />,
      title: "优秀范文",
      description: "精选各年级段优秀作文范例，学习写作技巧",
      color: "bg-blue-500"
    },
    {
      icon: <Edit className="w-6 h-6 text-white" />,
      title: "智能批改",
      description: "AI智能批改系统，提供详细的修改建议",
      color: "bg-slate-500"
    },
    {
      icon: <Camera className="w-6 h-6 text-white" />,
      title: "拍照生成",
      description: "拍照上传题目图片，AI智能生成高质量范文",
      color: "bg-indigo-500"
    }
  ];

  return (
    <section className="relative py-12 md:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-bg opacity-10"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2338bdf8' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '30px 30px'
      }}></div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-800 mb-4 md:mb-6">
            让写作变得
            <span className="gradient-text"> 简单有趣</span>
          </h2>
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8 leading-relaxed px-1">
            专为中小学生打造的作文学习平台，提供全方位的写作指导与练习，
            从题目解析到范文学习，从智能批改到个性指导，助力每一位学生提升写作水平。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Button 
              size="lg" 
              className="gradient-bg text-white px-6 md:px-8 py-5 md:py-6 text-base md:text-lg rounded-full hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
              onClick={() => navigate('/grading')}
            >
              开始智能批改
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-6 md:px-8 py-5 md:py-6 text-base md:text-lg rounded-full border-2 hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
              onClick={() => navigate('/topics')}
            >
              查看题目库
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-white/90 backdrop-blur-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-3 md:p-6 text-center">
                <div className={`w-10 h-10 md:w-12 md:h-12 ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 md:mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
