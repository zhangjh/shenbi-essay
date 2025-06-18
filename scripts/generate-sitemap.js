import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const API_BASE_URL = process.env.VITE_BIZ_DOMAIN || 'https://tx.zhangjh.cn';
const SITE_URL = 'https://shenbi.zhangjh.cn';
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');
const CURRENT_DATE = new Date().toISOString().split('T')[0];

// 获取所有题目
async function fetchAllTopics() {
  try {
    // 先获取总数
    const countResponse = await fetch(`${API_BASE_URL}/shenbi/topic?pageSize=1`);
    const countData = await countResponse.json();
    const totalTopics = countData.total || 0;
    
    // 获取所有题目
    const response = await fetch(`${API_BASE_URL}/shenbi/topic?pageSize=${totalTopics}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.errorMsg || '获取题目失败');
    }
    
    return data.data.map(topic => ({
      id: topic.id,
      title: topic.title
    }));
  } catch (error) {
    console.error('获取题目失败:', error);
    return [];
  }
}

// 生成sitemap.xml
async function generateSitemap() {
  // 获取所有题目
  const topics = await fetchAllTopics();
  console.log(`获取到 ${topics.length} 个题目`);
  
  // 基础URL
  const staticUrls = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/topics', changefreq: 'daily', priority: '0.9' },
    { url: '/grading', changefreq: 'weekly', priority: '0.8' },
    { url: '/photo-essay', changefreq: 'monthly', priority: '0.7' },
    { url: '/signin', changefreq: 'monthly', priority: '0.5' },
    { url: '/signup', changefreq: 'monthly', priority: '0.5' }
  ];
  
  // 生成XML
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // 添加静态页面
  staticUrls.forEach(page => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${SITE_URL}${page.url}</loc>\n`;
    sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${page.priority}</priority>\n`;
    sitemap += `    <lastmod>${CURRENT_DATE}</lastmod>\n`;
    sitemap += '  </url>\n';
  });
  
  // 添加题目页面
  topics.forEach(topic => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${SITE_URL}/topic/${topic.id}</loc>\n`;
    sitemap += '    <changefreq>weekly</changefreq>\n';
    sitemap += '    <priority>0.7</priority>\n';
    sitemap += `    <lastmod>${CURRENT_DATE}</lastmod>\n`;
    sitemap += '  </url>\n';
  });
  
  sitemap += '</urlset>';
  
  // 写入文件
  fs.writeFileSync(SITEMAP_PATH, sitemap);
  console.log(`成功生成sitemap.xml，包含 ${staticUrls.length + topics.length} 个URL`);
}

// 执行生成
generateSitemap().catch(error => {
  console.error('生成sitemap失败:', error);
  process.exit(1);
});