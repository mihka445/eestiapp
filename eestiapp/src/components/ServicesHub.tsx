
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Heart, 
  Baby, 
  Car, 
  Shield, 
  Pill, 
  FileText, 
  Home,
  Wallet,
  ArrowRight,
  Bell,
  CheckCircle,
  Plus,
  Trash2,
  X
} from 'lucide-react';

interface ServiceItem {
  title: string;
  value: string;
  status?: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
  notifications?: number;
  status: 'active' | 'attention' | 'normal';
  items?: ServiceItem[];
}

const iconMap: Record<string, any> = {
  Pill, Baby, Car, Shield, Wallet, FileText, Heart, Home
};

const defaultServices: Service[] = [
  {
    id: 'prescriptions',
    title: 'Retseptid',
    description: 'Aktiivsed ja kasutatud retseptid',
    iconName: 'Pill',
    badge: '3 aktiivset',
    notifications: 1,
    status: 'active',
    items: [
      { title: 'Paratsetamool 500mg', value: '2 tabletti päevas', status: 'active' },
      { title: 'Vitamiin D3', value: '1 kapsel päevas', status: 'active' },
      { title: 'Omega-3', value: 'Uuendamist vajab', status: 'attention' }
    ]
  },
  {
    id: 'children',
    title: 'Lapsed',
    description: 'Laste andmed ja teenused',
    iconName: 'Baby',
    badge: '1 laps',
    status: 'normal',
    items: [
      { title: 'Anna Maasikas', value: '15 aastat', status: 'normal' },
      { title: 'Kool', value: 'Tallinna Reaalgümnaasium', status: 'normal' },
      { title: 'Tervisekontroll', value: 'Järgmine: 15.02.2025', status: 'normal' }
    ]
  },
  {
    id: 'vehicles',
    title: 'Sõidukid',
    description: 'Registreeritud sõidukid ja kindlustus',
    iconName: 'Car',
    badge: '2 sõidukit',
    notifications: 1,
    status: 'attention',
    items: [
      { title: 'Toyota Corolla 2020', value: 'ABC123', status: 'normal' },
      { title: 'Liikluskindlustus', value: 'Aegub 20.02.2025', status: 'attention' }
    ]
  },
  {
    id: 'insurance',
    title: 'Kindlustused',
    description: 'Tervis- ja liikluskindlustus',
    iconName: 'Shield',
    status: 'normal',
    items: [
      { title: 'Tervisekindlustus', value: 'Aktiivne', status: 'active' },
      { title: 'Hambaravi hüvitis', value: '120€ aastas', status: 'normal' }
    ]
  },
  {
    id: 'benefits',
    title: 'Toetused',
    description: 'Aktiivsed toetused ja hüvitised',
    iconName: 'Wallet',
    badge: 'Uus avaldus',
    notifications: 1,
    status: 'active',
    items: [
      { title: 'Lapsetoetus', value: '80€/kuu', status: 'active' },
      { title: 'Eluasemetoetus', value: 'Läbivaatamisel', status: 'attention' }
    ]
  },
  {
    id: 'documents',
    title: 'Dokumendid',
    description: 'Ametlikud tõendid ja avaldused',
    iconName: 'FileText',
    status: 'normal',
    items: [
      { title: 'Töötõend', value: 'Väljastatud 10.01.2025', status: 'normal' },
      { title: 'Sissetulekutõend', value: 'Väljastatud 05.01.2025', status: 'normal' }
    ]
  }
];

const ServicesHub = () => {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'attention': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'attention': return <Bell className="w-4 h-4 text-orange-500" />;
      default: return null;
    }
  };

  // Estonian grammar: 1 teenus, 2+ teenust
  const serviceCountLabel = (count: number) => count === 1 ? '1 teenus' : `${count} teenust`;

  const handleAddService = () => {
    if (!newTitle.trim()) return;
    const newService: Service = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim() || 'Kohandatud teenus',
      iconName: 'Heart',
      status: 'normal',
    };
    setServices(prev => [...prev, newService]);
    setNewTitle('');
    setNewDescription('');
    setShowAddForm(false);
  };

  const handleRemoveService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Minu teenused</h2>
        <Badge variant="outline" className="text-blue-600 border-blue-300">
          {serviceCountLabel(services.length)}
        </Badge>
      </div>

      <div className="grid gap-4">
        {services.map((service) => {
          const Icon = iconMap[service.iconName] || Heart;
          return (
            <Card key={service.id} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      service.status === 'active' ? 'bg-green-100 text-green-600' :
                      service.status === 'attention' ? 'bg-orange-100 text-orange-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{service.title}</CardTitle>
                        {service.notifications && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                      <CardDescription className="text-sm">{service.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {service.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {service.badge}
                      </Badge>
                    )}
                    <button
                      onClick={() => handleRemoveService(service.id)}
                      className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                      title="Eemalda"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              
              {service.items && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {service.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 text-sm">
                        <span className="text-gray-700">{item.title}</span>
                        <div className="flex items-center space-x-2">
                          <span className={getStatusColor(item.status || 'normal')}>
                            {item.value}
                          </span>
                          {getStatusIcon(item.status || 'normal')}
                        </div>
                      </div>
                    ))}
                    {service.items.length > 2 && (
                      <div className="text-xs text-gray-500 pt-2">
                        +{service.items.length - 2} veel
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Add service form */}
      {showAddForm ? (
        <Card className="border-dashed border-2 border-blue-300">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[#1a3a5c]">Lisa uus teenus</h3>
              <button onClick={() => setShowAddForm(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <Input
              placeholder="Teenuse nimi"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Input
              placeholder="Kirjeldus (valikuline)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <Button onClick={handleAddService} className="w-full bg-blue-600 hover:bg-blue-700">
              Lisa teenus
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="outline"
          onClick={() => setShowAddForm(true)}
          className="w-full border-dashed border-2 border-blue-300 text-blue-600 hover:bg-blue-50 gap-2"
        >
          <Plus className="w-4 h-4" />
          Lisa teenus
        </Button>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">Rohkem teenuseid</h3>
              <p className="text-sm text-blue-700">
                Avasta kõiki 50+ riigi digitaalset teenust
              </p>
            </div>
            <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
              Vaata kõiki
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesHub;
