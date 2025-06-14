
import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
}

const SEO = ({ 
  title = "神笔作文（ShenBi-Essay）- 让每个学生都能写出优秀的作文",
  description = "神笔作文是专为中小学生打造的作文学习平台，提供智能批改、题目解析、范文学习、个性化指导等功能，助力学生提升写作水平。",
  keywords = "作文学习,作文批改,作文题目,小学作文,初中作文,高中作文,智能批改,写作指导,作文范文",
  canonical,
  ogImage = "/assets/logo.png",
  ogType = "website",
  noindex = false
}: SEOProps) => {
  useEffect(() => {
    // 设置页面标题
    document.title = title;

    // 更新或创建 meta 标签
    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) || 
                 document.querySelector(`meta[property="${name}"]`);
      
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    // 基础 SEO 标签
    updateMeta('description', description);
    updateMeta('keywords', keywords);
    
    // Open Graph 标签
    updateMeta('og:title', title);
    updateMeta('og:description', description);
    updateMeta('og:type', ogType);
    updateMeta('og:image', ogImage);
    updateMeta('og:url', window.location.href);
    updateMeta('og:site_name', '神笔作文');

    // Twitter Card 标签
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', ogImage);

    // 设置 canonical URL
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (canonicalLink) {
        canonicalLink.href = canonical;
      } else {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        canonicalLink.href = canonical;
        document.head.appendChild(canonicalLink);
      }
    }

    // 设置 robots meta 标签
    const robotsContent = noindex ? 'noindex,nofollow' : 'index,follow';
    updateMeta('robots', robotsContent);

    // 添加结构化数据 (JSON-LD)
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "神笔作文",
      "description": description,
      "url": "https://shenbi.zhangjh.cn",
      "logo": `https://shenbi.zhangjh.cn${ogImage}`,
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "zhangjh_initial@126.com",
        "contactType": "customer service"
      },
      "areaServed": "CN",
      "availableLanguage": "zh-CN"
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (scriptTag) {
      scriptTag.textContent = JSON.stringify(structuredData);
    } else {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.textContent = JSON.stringify(structuredData);
      document.head.appendChild(scriptTag);
    }
  }, [title, description, keywords, canonical, ogImage, ogType, noindex]);

  return null;
};

export default SEO;
