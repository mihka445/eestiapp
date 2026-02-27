
import React, { useState, useEffect, useCallback } from 'react';
import qrCodeImage from '@/assets/qr-code.png';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CreditCard, 
  Car, 
  Plane, 
  Eye, 
  EyeOff,
  User,
  ArrowLeft,
  Edit,
  Check,
  X,
  Camera,
  Copy,
  ScanLine
} from 'lucide-react';

interface DocumentData {
  id: string;
  type: 'id-card' | 'passport' | 'drivers-license';
  title: string;
  subtitle: string;
  validUntil: string;
  status: 'active' | 'expiring' | 'expired';
  personalCode?: string;
  documentNumber: string;
  issuedBy: string;
  icon: any;
  gradient: string;
  flagColors: string[];
  data: Record<string, string>;
  photo?: string;
}

const defaultDocuments: DocumentData[] = [
  {
    id: '1',
    type: 'id-card',
    title: 'ID-kaart',
    subtitle: 'Isikutunnistus',
    validUntil: '2029-12-15',
    status: 'active',
    personalCode: '30303039914',
    documentNumber: 'AC2002136',
    issuedBy: 'Politsei- ja Piirivalveamet',
    icon: CreditCard,
    gradient: 'from-[#d6e6f5] to-[#e8f0f8]',
    flagColors: ['#0072CE', '#000000', '#FFFFFF'],
    data: {
      'PEREKONNANIMI': 'VIHRA',
      'EESNIMI': 'TOM',
      'SUGU': 'Mees',
      'ISIKUKOOD': '30303039914',
      'SÜNNIAEG': '03.03.1903',
      'KEHTIB KUNI': '16.11.2026',
      'DOKUMENDI NUMBER': 'AC2002136'
    }
  },
  {
    id: '2',
    type: 'passport',
    title: 'Pass',
    subtitle: 'Euroopa Liidu pass',
    validUntil: '2028-06-20',
    status: 'active',
    documentNumber: 'ES0000000',
    issuedBy: 'Politsei- ja Piirivalveamet',
    icon: Plane,
    gradient: 'from-[#6b2d7b] to-[#4a1a5e]',
    flagColors: ['#0072CE', '#000000', '#FFFFFF'],
    data: {
      'PEREKONNANIMI': 'VIHRA',
      'EESNIMI': 'TOM',
      'PASSI NUMBER': 'ES0000000',
      'SÜNNIAEG': '03.03.1903',
      'SUGU': 'Mees',
      'KODAKONDSUS': 'EST',
      'KEHTIB KUNI': '20.06.2028',
      'VÄLJASTAJA': 'Politsei- ja Piirivalveamet'
    }
  },
  {
    id: '3',
    type: 'drivers-license',
    title: 'Juhiluba',
    subtitle: 'Kategooria B',
    validUntil: '2032-03-10',
    status: 'active',
    documentNumber: 'EE0000000',
    issuedBy: 'Maanteeamet',
    icon: Car,
    gradient: 'from-[#f0b8c8] to-[#e8a0b5]',
    flagColors: ['#003399', '#FFCC00'],
    data: {
      'PEREKONNANIMI': 'VIHRA',
      'EESNIMI': 'TOM',
      'JUHILOA NUMBER': 'EE0000000',
      'SÜNNIAEG': '03.03.1903',
      'KATEGOORIAD': 'B',
      'VÄLJASTATUD': '10.03.2022',
      'KEHTIB KUNI': '10.03.2032',
      'VÄLJASTAJA': 'Maanteeamet'
    }
  }
];

const loadDocuments = (): DocumentData[] => {
  try {
    const saved = localStorage.getItem('eesti-app-documents');
    if (saved) {
      const parsed = JSON.parse(saved);
      const iconMap: Record<string, any> = { 'id-card': CreditCard, 'passport': Plane, 'drivers-license': Car };
      return parsed.map((doc: any, i: number) => ({ 
        ...defaultDocuments[i], 
        ...doc, 
        icon: iconMap[doc.type] || CreditCard 
      }));
    }
  } catch {}
  return defaultDocuments;
};

const saveDocuments = (docs: DocumentData[]) => {
  try {
    const toSave = docs.map(({ icon, ...rest }) => rest);
    localStorage.setItem('eesti-app-documents', JSON.stringify(toSave));
  } catch {}
};

// Estonian flag component
const EstonianFlag = ({ className = "w-10 h-7" }: { className?: string }) => (
  <div className={`${className} rounded-sm overflow-hidden border border-black/10 flex flex-col`}>
    <div className="flex-1 bg-[#0072CE]" />
    <div className="flex-1 bg-[#000000]" />
    <div className="flex-1 bg-[#FFFFFF]" />
  </div>
);

// EU flag component  
const EUFlag = ({ className = "w-10 h-7" }: { className?: string }) => (
  <div className={`${className} rounded-sm overflow-hidden border border-black/10 bg-[#003399] flex items-center justify-center`}>
    <div className="relative w-5 h-5">
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = 10 + 8 * Math.cos(angle);
        const y = 10 + 8 * Math.sin(angle);
        return (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 text-[#FFCC00]"
            style={{ left: `${x}px`, top: `${y}px`, fontSize: '6px' }}
          >
            ★
          </div>
        );
      })}
    </div>
  </div>
);

// Passport icon (biometric)
const PassportIcon = ({ className = "w-10 h-7" }: { className?: string }) => (
  <div className={`${className} rounded-sm overflow-hidden border border-white/30 bg-white/20 flex items-center justify-center`}>
    <div className="w-4 h-4 rounded-full border-2 border-white/80 flex items-center justify-center">
      <div className="w-1 h-2 border border-white/80 rounded-sm" />
    </div>
  </div>
);

const DocumentWallet = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<DocumentData[]>(loadDocuments);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    saveDocuments(documents);
  }, [documents]);

  // Reset sensitive info visibility when opening a document
  useEffect(() => {
    if (!selectedDocument) return;
    setShowSensitiveInfo(false);
  }, [selectedDocument]);

  const getStatusBadge = (status: string, validUntil: string) => {
    const daysUntilExpiry = Math.ceil(
      (new Date(validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilExpiry < 0) {
      return <Badge variant="destructive" className="rounded-full px-4 py-1.5 text-sm">Aegunud</Badge>;
    } else if (daysUntilExpiry < 90) {
      return <Badge variant="outline" className="rounded-full px-4 py-1.5 text-sm text-orange-600 border-orange-300 bg-orange-50">Aegub varsti</Badge>;
    }
    return <Badge className="rounded-full px-4 py-1.5 text-sm bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9] hover:bg-[#e8f5e9]">✓ Kehtiv</Badge>;
  };

  const handleEdit = () => {
    const document = documents.find(d => d.id === selectedDocument)!;
    setEditedData({ ...document.data });
    setIsEditing(true);
  };

  const handleSave = () => {
    // Prevent saving empty name fields - revert to original values
    const doc = documents.find(d => d.id === selectedDocument)!;
    const finalData = { ...editedData };
    if (!finalData['PEREKONNANIMI']?.trim()) finalData['PEREKONNANIMI'] = doc.data['PEREKONNANIMI'];
    if (!finalData['EESNIMI']?.trim()) finalData['EESNIMI'] = doc.data['EESNIMI'];
    setDocuments(prev => prev.map(d => 
      d.id === selectedDocument 
        ? { ...d, data: finalData }
        : d
    ));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData({});
    setIsEditing(false);
  };

  const handleInputChange = (key: string, value: string) => {
    // Prevent clearing name fields entirely
    if ((key === 'PEREKONNANIMI' || key === 'EESNIMI') && value.trim() === '') {
      return;
    }
    setEditedData(prev => ({ ...prev, [key]: value }));
  };

  const handlePhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const photoData = event.target?.result as string;
          setDocuments(prev => prev.map(doc => 
            doc.id === selectedDocument 
              ? { ...doc, photo: photoData }
              : doc
          ));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const sensitiveFields = ['ISIKUKOOD', 'DOKUMENDI NUMBER', 'PASSI NUMBER', 'JUHILOA NUMBER'];

  // ─── DETAIL VIEW ───
  if (selectedDocument) {
    const doc = documents.find(d => d.id === selectedDocument)!;
    const displayData = isEditing ? editedData : doc.data;
    const nameFields = ['PEREKONNANIMI', 'EESNIMI'];
    const otherFields = Object.entries(displayData).filter(([k]) => !nameFields.includes(k));
    
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-[#1a3a5c] text-white">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={() => { setSelectedDocument(null); setIsEditing(false); }}
                className="text-white hover:bg-white/10 p-2 h-auto"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <p className="text-xs text-white/70">Dokumendid</p>
                <h1 className="text-base font-semibold">Isikutuvastus</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="text-white hover:bg-white/10 h-auto p-2"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              ) : (
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={handleCancel} className="text-white hover:bg-white/10 h-auto p-2">
                    <X className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleSave} className="text-white hover:bg-white/10 h-auto p-2">
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Document card header */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-[#1a3a5c] tracking-wide">EESTI VABARIIK</p>
              <EstonianFlag className="w-8 h-5" />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-[#1a3a5c] tracking-wide">ISIKUTUNNISTUS</p>
              <p className="text-[10px] text-gray-400 italic">Identity Card</p>
            </div>
          </div>

          {/* Photo + Name */}
          <div className="flex gap-5 mb-4">
            <div 
              className="w-24 h-28 bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center flex-shrink-0 cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden"
              onClick={handlePhotoUpload}
            >
              {doc.photo ? (
                <img src={doc.photo} alt="Dokumendi foto" className="w-full h-full object-cover" />
              ) : (
                <>
                  <User className="w-10 h-10 text-gray-300" />
                  <span className="text-[10px] text-blue-500 mt-1">Avan foto</span>
                </>
              )}
            </div>
            <div className="flex-1 pt-1">
              {nameFields.map(field => {
                const val = displayData[field];
                if (!val) return null;
                return (
                  <div key={field} className="mb-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">{field}</p>
                    {isEditing ? (
                      <Input value={val} onChange={(e) => handleInputChange(field, e.target.value)} className="h-8 text-sm mt-0.5" />
                    ) : (
                      <p className="text-lg font-bold text-[#1a3a5c]">{val}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status badge */}
          <div className="flex justify-center mb-3">
            {getStatusBadge(doc.status, doc.validUntil)}
          </div>

          {/* Reveal sensitive data button */}
          <div className="flex justify-center mb-5">
            <Button
              variant={showSensitiveInfo ? "outline" : "default"}
              size="sm"
              onClick={() => setShowSensitiveInfo(prev => !prev)}
              className="rounded-full px-5 gap-2 text-xs"
            >
              {showSensitiveInfo ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showSensitiveInfo ? 'Peida isikuandmed' : 'Kuva isikuandmed'}
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 mx-5" />

        {/* Data fields */}
        <div className="px-5 py-4 space-y-4">
          {otherFields.map(([key, value]) => {
            const isSensitive = sensitiveFields.includes(key);
            const displayValue = showSensitiveInfo || !isSensitive ? value : '••••••••••';
            return (
              <div key={key} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">{key}</p>
                  {isEditing ? (
                    <Input value={value} onChange={(e) => handleInputChange(key, e.target.value)} className="h-8 text-sm mt-0.5" />
                  ) : (
                    <p className="text-sm font-semibold text-[#1a3a5c] mt-0.5">{displayValue}</p>
                  )}
                </div>
                {isSensitive && !isEditing && showSensitiveInfo && (
                  <button
                    onClick={() => handleCopy(value, key)}
                    className="ml-3 p-1.5 text-gray-400 hover:text-[#1a3a5c] transition-colors"
                    title="Kopeeri"
                  >
                    {copiedField === key ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── LIST VIEW (Wallet Stack) ───
  return (
    <div className="min-h-screen bg-[#1a3a5c]">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-white">Dokumendid</h1>
      </div>

      {/* Stacked wallet cards */}
      <div className="px-5 pb-6">
        <div className="relative" style={{ height: `${80 + (documents.length - 1) * 72 + 20}px` }}>
          {documents.map((doc, index) => {
            const isIdCard = doc.type === 'id-card';
            const isPassport = doc.type === 'passport';
            const isDL = doc.type === 'drivers-license';
            const textColor = isPassport ? 'text-white' : 'text-[#1a3a5c]';

            return (
              <div
                key={doc.id}
                className={`absolute left-0 right-0 rounded-2xl cursor-pointer transition-all duration-300 hover:translate-y-[-2px] bg-gradient-to-br ${doc.gradient} shadow-lg`}
                style={{ 
                  top: `${index * 72}px`,
                  zIndex: index + 1,
                  height: '80px',
                }}
                onClick={() => setSelectedDocument(doc.id)}
              >
                <div className="flex items-center h-full px-5">
                  <h3 className={`text-lg font-semibold ${textColor}`}>{doc.title}</h3>
                  <div className="flex-1 flex justify-center">
                    {isIdCard && <EstonianFlag />}
                    {isPassport && <PassportIcon />}
                    {isDL && <EUFlag />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scan button */}
      <div className="px-5 pb-8">
        <button 
          onClick={() => setShowQR(true)}
          className="flex items-center justify-center gap-2 w-full text-white/80 hover:text-white transition-colors py-3"
        >
          <ScanLine className="w-5 h-5" />
          <span className="text-sm font-medium">Skaneeri dokumenti</span>
        </button>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={() => setShowQR(false)}>
          <div className="bg-white rounded-2xl p-6 mx-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#1a3a5c]">Skaneeri dokumenti</h2>
              <button onClick={() => setShowQR(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-center">
              <img src={qrCodeImage} alt="QR Code" className="w-64 h-64 object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentWallet;
