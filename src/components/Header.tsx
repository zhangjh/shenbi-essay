
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, User, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  SignedIn, 
  SignedOut,
  UserButton 
} from "@clerk/clerk-react";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    navigate('/');
  };

  // 判断是否在题目列表页显示搜索框
  const shouldShowSearch = location.pathname === '/topics';

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <img src="/assets/logo.png" alt="Logo" className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">神笔作文</h1>
              <p className="text-xs text-gray-500">ShenBi Essay</p>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <SignedOut>
              <Button variant="outline" size="sm" onClick={() => navigate("/signin")}>
                <User className="w-4 h-4 mr-2" />
                登录
              </Button>
              <Button size="sm" className="gradient-bg text-white" onClick={() => navigate("/signup")}>
                免费注册
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Top row with logo and menu button */}
          <div className="flex items-center justify-between h-16">
            <div 
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleLogoClick}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="/assets/logo.png" alt="Logo" className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold gradient-text">神笔作文</h1>
                <p className="text-xs text-gray-500">ShenBi Essay</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <SignedIn>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </SignedIn>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-2">
                <SignedOut>
                  <Button variant="outline" size="sm" onClick={() => navigate("/signin")}>
                    <User className="w-4 h-4 mr-2" />
                    登录
                  </Button>
                  <Button size="sm" className="gradient-bg text-white" onClick={() => navigate("/signup")}>
                    免费注册
                  </Button>
                </SignedOut>
              </div>
            </div>
          )}

          {/* Search bar row - only show on relevant pages */}
          {shouldShowSearch && (
            <div className="pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="搜索作文题目..."
                  className="pl-10 pr-4 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
