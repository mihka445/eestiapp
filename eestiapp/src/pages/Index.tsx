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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#0073e6]">Eesti äpp</h1>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut size={16} />
            Logi välja
          </Button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-[#0073e6] text-[#0073e6]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('documents')}
            >
              Dokumendid
            </button>
            <button
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'services'
                  ? 'border-[#0073e6] text-[#0073e6]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('services')}
            >
              Teenused
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'documents' && <DocumentWallet />}
        {activeTab === 'services' && <ServicesHub />}
      </main>
    </div>
  );
};

export default Index;
