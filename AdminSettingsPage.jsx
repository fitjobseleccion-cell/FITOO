import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import CsvImportModal from '@/components/admin/CsvImportModal.jsx';

const AdminSettingsPage = () => {
  const { user } = useAuth();
  const [importModalOpen, setImportModalOpen] = useState(false);

  const canImportCsv = user?.email === 'frangonzalezfitjob@gmail.com';

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">Ajustes generales del portal.</p>
      </div>

      <Card className="shadow-sm border-border opacity-75">
        <CardHeader>
          <CardTitle>Notificaciones por Email</CardTitle>
          <CardDescription>Configura los correos automáticos enviados a candidatos (Próximamente)</CardDescription>
        </CardHeader>
        <CardContent>
          <Button disabled>Editar plantillas</Button>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border opacity-75">
        <CardHeader>
          <CardTitle>Permisos de Equipo</CardTitle>
          <CardDescription>Gestión de roles y accesos para reclutadores (Próximamente)</CardDescription>
        </CardHeader>
        <CardContent>
          <Button disabled>Gestionar usuarios</Button>
        </CardContent>
      </Card>

      {canImportCsv && (
        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle>Importación de Datos</CardTitle>
            <CardDescription>Importa candidatos masivamente usando un archivo CSV.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setImportModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importar CSV
            </Button>
          </CardContent>
        </Card>
      )}

      <CsvImportModal 
        open={importModalOpen} 
        onOpenChange={setImportModalOpen} 
      />
    </div>
  );
};

export default AdminSettingsPage;