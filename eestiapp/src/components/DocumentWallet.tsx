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
    id: '3',
    type: 'drivers-license',
    title: 'Juhiluba',
    subtitle: 'Kategooria B',
    validUntil: '2032-03-10',
    status: 'active',
    documentNumber: 'EE0000000',
    issuedBy: 'Maanteeamet',
    icon: Car,
    gradient: 'from-[#d98fa8] to-[#e8b8d0]',
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
    gradient: 'from-[#5a2d42] to-[#7a3f5a]',
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
    gradient: 'from-[#9ed6f0] to-[#c8e6f5]',
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
      <div className="w-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-b from-[#1a3a5c] to-[#0f2847] text-white mb-6">
          <div className="flex items-center gap-4 px-5 py-4">
            <Button
              variant="ghost"
              onClick={() => { setSelectedDocument(null); setIsEditing(false); }}
              className="text-white hover:bg-white/10 p-0 h-auto"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <p className="text-xs text-white/70">Dokumentid</p>
              <h1 className="text-lg font-semibold">{doc.title}</h1>
            </div>
          </div>
        </div>

        {/* White card container */}
        <div className="bg-white rounded-3xl shadow-lg p-6 space-y-6">
          {/* Document header with flags */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-[#1a3a5c] tracking-wide">EESTI VABARIIK</p>
              <EstonianFlag className="w-10 h-7" />
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-[#1a3a5c] tracking-wide">ISIKUTUNNISTUS</p>
              <p className="text-xs text-gray-500">Identity Card</p>
            </div>
          </div>

          {/* Photo + Name section */}
          <div className="flex gap-6">
            <div
              className="w-20 h-24 bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center flex-shrink-0 cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden"
              onClick={handlePhotoUpload}
            >
              {doc.photo ? (
                <img src={doc.photo} alt="Dokumendi foto" className="w-full h-full object-cover" />
              ) : (
                <>
                  <User className="w-8 h-8 text-gray-300" />
                  <span className="text-[9px] text-[#0073e6] mt-1 font-medium text-center">Avan foto</span>
                </>
              )}
            </div>
            <div className="flex-1 space-y-3">
              {nameFields.map(field => {
                const val = displayData[field];
                if (!val) return null;
                return (
                  <div key={field}>
                    <p className="text-xs font-semibold text-[#0073e6] uppercase tracking-widest">{field}</p>
                    {isEditing ? (
                      <Input value={val} onChange={(e) => handleInputChange(field, e.target.value)} className="h-7 text-sm mt-1" />
                    ) : (
                      <p className="text-base font-bold text-[#1a3a5c]">{val}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status badge - centered */}
          <div className="flex justify-center py-2">
            {getStatusBadge(doc.status, doc.validUntil)}
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200" />

          {/* Data fields in two columns */}
          <div className="grid grid-cols-2 gap-6 gap-y-5">
            {otherFields.map(([key, value]) => {
              const isSensitive = sensitiveFields.includes(key);
              const displayValue = showSensitiveInfo || !isSensitive ? value : '••••••••••';
              return (
                <div key={key} className="flex flex-col">
                  <p className="text-xs font-semibold text-[#0073e6] uppercase tracking-widest mb-1">{key}</p>
                  <div className="flex items-start gap-2">
                    {isEditing ? (
                      <Input value={value} onChange={(e) => handleInputChange(key, e.target.value)} className="h-7 text-sm flex-1" />
                    ) : (
                      <p className="text-sm font-medium text-gray-900">{displayValue}</p>
                    )}
                    {isSensitive && !isEditing && showSensitiveInfo && (
                      <button
                        onClick={() => handleCopy(value, key)}
                        className="p-1 text-gray-400 hover:text-[#0073e6] transition-colors flex-shrink-0"
                        title="Kopeeri"
                      >
                        {copiedField === key ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reveal sensitive data button */}
          <div className="flex justify-center pt-2">
            <Button
              onClick={() => setShowSensitiveInfo(prev => !prev)}
              className="w-full h-12 bg-[#0073e6] hover:bg-[#0056b3] text-white font-semibold rounded-full"
            >
              {showSensitiveInfo ? 'Peida isikuandmed' : 'Kuva isikutuvastuse kood'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── LIST VIEW (Wallet Stack) ───
  return (
    <div className="w-full">
      {/* White card container */}
      <div className="bg-white rounded-3xl shadow-lg p-6 space-y-6">
        {/* Stacked document cards */}
        <div className="relative" style={{ height: `${140 + (documents.length - 1) * 100}px` }}>
          {documents.map((doc, index) => {
            const isIdCard = doc.type === 'id-card';
            const isPassport = doc.type === 'passport';
            const isDL = doc.type === 'drivers-license';
            const textColor = isPassport ? 'text-white' : 'text-gray-900';

            return (
              <div
                key={doc.id}
                className={`absolute left-0 right-0 rounded-2xl cursor-pointer transition-all duration-200 hover:translate-y-[-4px] bg-gradient-to-br ${doc.gradient} shadow-md hover:shadow-lg overflow-hidden`}
                style={{
                  top: `${index * 100}px`,
                  zIndex: documents.length - index,
                  height: '140px',
                }}
                onClick={() => setSelectedDocument(doc.id)}
              >
                {/* Diagonal wave overlay */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 140">
                  <path d="M 0 40 Q 100 0 200 40 T 400 40 L 400 0 L 0 0 Z" fill="rgba(255, 255, 255, 0.1)" />
                </svg>

                <div className="flex items-center h-full px-6 justify-between relative z-10">
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold ${isPassport ? 'text-white' : 'text-[#1a3a5c]'}`}>{doc.title}</h3>
                  </div>
                  <div className="flex-shrink-0">
                    {isIdCard && <EstonianFlag className="w-12 h-8" />}
                    {isPassport && <PassportIcon className="w-12 h-8" />}
                    {isDL && <EUFlag className="w-12 h-8" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scan documents button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setShowQR(true)}
          className="flex items-center justify-center gap-2 text-[#1a3a5c] hover:text-[#0f2847] transition-colors py-3 font-medium text-sm"
        >
          <ScanLine className="w-4 h-4" />
          <span>Skaneeri dokumenti</span>
        </button>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setShowQR(false)}>
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
