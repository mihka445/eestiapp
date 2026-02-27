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
  X,
  Users,
  Eye,
  MapPin
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
  Pill, Baby, Car, Shield, Wallet, FileText, Heart, Home, Users, Eye, MapPin
};

const defaultServices: Service[] = [
  {
    id: 'health',
    title: 'Tervis',
    description: 'Terviseteenused',
    iconName: 'Heart',
    status: 'normal'
  },
  {
    id: 'family',
    title: 'Mina ja minu pere',
    description: 'Perekonnaandmed',
    iconName: 'Users',
    status: 'normal'
  },
  {
    id: 'traffic',
    title: 'Liiklus',
    description: 'Liiklusega seotud teenused',
    iconName: 'Car',
    status: 'normal'
  },
  {
    id: 'housing',
    title: 'Eluase ja kinnisvara',
    description: 'Kinnisvaraga seotud teenused',
    iconName: 'Home',
    status: 'normal'
  },
  {
    id: 'notary',
    title: 'Notarialiseed dokumendid',
    description: 'Notarialiseeritud dokumendid',
    iconName: 'FileText',
    status: 'normal'
  },
  {
    id: 'data-tracking',
    title: 'Andmejälgija',
    description: 'Andmete jälgimine',
    iconName: 'Eye',
    status: 'normal'
  },
  {
    id: 'maps',
    title: 'Kaardirakendused',
    description: 'Kaardi rakendused',
    iconName: 'MapPin',
    status: 'normal'
  }
];

const ServicesHub = () => {
  const [services, setServices] = useState<Service[]>(defaultServices);

  return (
    <div className="w-full">
      {/* White card container */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        {/* Services grid - 2x2 layout with 7 items */}
        <div className="grid grid-cols-2 gap-6">
          {services.map((service) => {
            const Icon = iconMap[service.iconName] || Heart;
            return (
              <div key={service.id} className="flex flex-col items-center text-center cursor-pointer group hover:opacity-75 transition-opacity">
                <div className="w-16 h-16 bg-[#e8f0f8] rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#d6e6f5] transition-colors">
                  <Icon className="w-8 h-8 text-[#1a3a5c]" />
                </div>
                <p className="text-sm font-medium text-[#1a3a5c]">{service.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServicesHub;
