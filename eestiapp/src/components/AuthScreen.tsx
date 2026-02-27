
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, CreditCard, Shield, ArrowRight } from 'lucide-react';

const AuthScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  const authMethods = [
    {
      id: 'smart-id',
      name: 'Smart-ID',
      description: 'Logi sisse nutitelefoniga',
      icon: Smartphone,
      available: true,
      primary: true
    },
    {
      id: 'mobile-id',
      name: 'Mobiil-ID',
      description: 'Logi sisse SIM-kaardiga',
      icon: CreditCard,
      available: true,
      primary: false
    },
    {
      id: 'id-card',
      name: 'ID-kaart',
      description: 'Logi sisse ID-kaardiga',
      icon: Shield,
      available: false,
      primary: false
    }
  ];

  const handleLogin = () => {
    if (selectedMethod) {
      // Simulate authentication process
      setTimeout(() => {
        onLogin();
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Eesti äpp</h1>
            <p className="text-gray-600 mt-1">Riigi digitaalsed teenused</p>
          </div>
        </div>

        {/* Authentication Methods */}
        <div className="space-y-3">
          {authMethods.map((method) => {
            const Icon = method.icon;
            return (
              <Card 
                key={method.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedMethod === method.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => method.available && setSelectedMethod(method.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        method.primary ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{method.name}</h3>
                          {method.primary && (
                            <Badge variant="secondary" className="text-xs">Soovitatav</Badge>
                          )}
                          {!method.available && (
                            <Badge variant="outline" className="text-xs">Peagi</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                    {selectedMethod === method.id && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Login Button */}
        <Button 
          onClick={handleLogin}
          disabled={!selectedMethod}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          Jätka sisselogimisega
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 space-y-2">
          <p>Turvaline sisselogimine riigi keskse</p>
          <p>autentimislahendusega</p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
