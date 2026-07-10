import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COLORS = ['hsl(var(--primary))', '#3b82f6', '#f59e0b', '#ef4444'];

const Reportes = () => {
  const dataPie = [
    { name: 'Preseleccionados', value: 15 },
    { name: 'En revisión', value: 35 },
    { name: 'Descartados', value: 50 },
  ];

  const dataBar = [
    { name: 'Madrid', candidatos: 400 },
    { name: 'Barcelona', candidatos: 300 },
    { name: 'Valencia', candidatos: 150 },
    { name: 'Sevilla', candidatos: 80 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reportes y Estadísticas</h1>
          <p className="text-slate-500">Analiza el rendimiento de tus procesos de selección.</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" /> Descargar PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Distribución de Estados</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dataPie} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                  {dataPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Candidatos por Provincia</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataBar} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="candidatos" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;