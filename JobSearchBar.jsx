import React, { useState } from 'react';
import { Search, MapPin, Building2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const JobSearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ searchTerm, location });
  };

  const handleClear = () => {
    setSearchTerm('');
    setLocation('');
    onSearch({ searchTerm: '', location: '' });
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-border p-2">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
        <div className="flex-1 relative flex items-center bg-muted/50 rounded-xl px-4 py-2 border border-transparent focus-within:border-primary focus-within:bg-background transition-colors">
          <Search className="w-5 h-5 text-muted-foreground mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Puesto, empresa o palabra clave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 px-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
          />
          {searchTerm && (
            <button type="button" onClick={() => setSearchTerm('')} className="p-1 hover:bg-muted rounded-full">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
        
        <div className="flex-1 relative flex items-center bg-muted/50 rounded-xl px-4 py-2 border border-transparent focus-within:border-primary focus-within:bg-background transition-colors">
          <MapPin className="w-5 h-5 text-muted-foreground mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Ciudad o provincia..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 px-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
          />
          {location && (
            <button type="button" onClick={() => setLocation('')} className="p-1 hover:bg-muted rounded-full">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <Button type="submit" size="lg" className="px-8 font-bold rounded-xl whitespace-nowrap h-full">
            Buscar
          </Button>
          {(searchTerm || location) && (
            <Button type="button" variant="outline" size="icon" onClick={handleClear} className="rounded-xl h-full aspect-square md:hidden">
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default JobSearchBar;