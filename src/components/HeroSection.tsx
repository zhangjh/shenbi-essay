
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Users, FileText, Edit } from 'lucide-react';

const HeroSection = () => {
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
      icon: <Users className="w-6 h-6 text-white" />,
      title: "个性指导",
      description: "针对不同年级提供个性化的写作指导方案",
      color: "bg-indigo-500"
    }
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-bg opacity-10"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2338bdf8' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '30px 30px'
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            让写作变得
            <span className="gradient-text"> 简单有趣</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            专为中小学生打造的作文学习平台，提供全方位的写作指导与练习，
            从题目解析到范文学习，从智能批改到个性指导，助力每一位学生提升写作水平。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-bg text-white px-8 py-6 text-lg rounded-full hover:shadow-xl transition-all duration-300">
              开始写作之旅
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-full border-2 hover:shadow-lg transition-all duration-300">
              查看题目库
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-white/90 backdrop-blur-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
