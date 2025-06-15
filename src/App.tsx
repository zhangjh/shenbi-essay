
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useUserSync } from '@/hooks/useUserSync';
import Index from '@/pages/Index';
import TopicAnalysis from '@/pages/TopicAnalysis';
import Writing from '@/pages/Writing';
import TopicLibrary from '@/pages/TopicLibrary';
import EssayGrading from '@/pages/EssayGrading';
import PhotoEssayGeneration from '@/pages/PhotoEssayGeneration';
import Admin from '@/pages/Admin';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function AppContent() {
  useUserSync(); // 使用用户同步Hook

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/topics" element={<TopicLibrary />} />
        <Route path="/topic/:id" element={<TopicAnalysis />} />
        <Route path="/topic/:id/write" element={<Writing />} />
        <Route path="/grading" element={<EssayGrading />} />
        <Route path="/photo-essay" element={<PhotoEssayGeneration />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
