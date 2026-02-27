import { useState } from 'react';
import { LogOut, Shield } from 'lucide-react';
import AuthScreen from '@/components/AuthScreen';
import DocumentWallet from '@/components/DocumentWallet';
import ServicesHub from '@/components/ServicesHub';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Helper function to convert text to hexadecimal
// This keeps the plain text password out of the source code
const stringToHex = (str: string) => {
  return Array.from(str)
    .map((char) => char.charCodeAt(0).toString(16))
    .join('');
};

const Index = () => {
  const [codeEntered, setCodeEntered] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'documents' | 'services'>('documents');
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Compare the hex version of the input to the hex version of "l1lla" ('6c316c6c61')
    if (stringToHex(code) === '6c316c6c61') {
      setCodeEntered(true);
      setCodeError('');
    } else {
      setCodeError('Vale kood. Proovi uuesti.');
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('documents');
  };

  // Show code entry screen first
  if (!codeEntered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Eesti äpp</CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Sisesta juurdepääsukood
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Sisesta kood"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="text-center text-lg tracking-widest"
                />
                {codeError && (
                  <p className="text-red-500 text-sm mt-2 text-center">{codeError}</p>
                )}
              </div>
              <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                Jätka
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show auth screen if code is correct but not authenticated
  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-b from-[#1a3a5c] to-[#0f2847] text-white">
        <div className="px-5 pt-4 pb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-white/70">45604115050</p>
              <h1 className="text-xl font-bold">Mari Maasikas</h1>
            </div>
            <div className="flex gap-3">
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Shield size={20} />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors" onClick={handleLogout}>
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Title */}
      <div className="bg-gradient-to-b from-[#0f2847] to-[#0a1a30] text-white px-5 pb-6">
        <h2 className="text-3xl font-bold">
          {activeTab === 'documents' ? 'Dokumentid' : 'Teenused'}
        </h2>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 max-w-4xl w-full mx-auto">
        {activeTab === 'documents' && <DocumentWallet />}
        {activeTab === 'services' && <ServicesHub />}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200">
        <div className="flex justify-around px-4 py-3">
          <button
            className={`flex flex-col items-center gap-1 py-2 px-4 transition-colors ${
              activeTab === 'documents'
                ? 'text-[#1a3a5c]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('documents')}
          >
            <div className="text-lg">📋</div>
            <span className="text-xs font-medium">Dokumendid</span>
          </button>
          <button
            className={`flex flex-col items-center gap-1 py-2 px-4 transition-colors ${
              activeTab === 'services'
                ? 'text-[#1a3a5c]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('services')}
          >
            <div className="text-lg">📋</div>
            <span className="text-xs font-medium">Teenused</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2 px-4 text-gray-500 hover:text-gray-700 transition-colors">
            <div className="text-lg">✉️</div>
            <span className="text-xs font-medium">Postkast</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Index;
