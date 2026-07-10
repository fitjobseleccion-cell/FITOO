import React from 'react';
import { Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';

const LANGUAGES = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' }
];

const FitoLanguageSelector = ({ currentLang, onLanguageChange }) => {
  const { user } = useAuth();

  const handleChange = async (langCode) => {
    onLanguageChange(langCode);
    sessionStorage.setItem('fitoLanguage', langCode);
    
    if (user?.id) {
      try {
        await pb.collection('users').update(user.id, {
          idioma_preferido: langCode
        }, { $autoCancel: false });
      } catch (err) {
        console.error('Failed to save language preference:', err);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <Select value={currentLang} onValueChange={handleChange}>
        <SelectTrigger className="h-8 w-[110px] text-xs bg-card border-none shadow-none focus:ring-0">
          <SelectValue placeholder="Idioma" />
        </SelectTrigger>
        <SelectContent zIndex={99999}>
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="text-xs">
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FitoLanguageSelector;