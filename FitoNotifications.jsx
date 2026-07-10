import React, { useEffect, useState } from 'react';
import { Bell, Check, Trash2, Megaphone, FileSignature, BookOpen, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { FITO_TRANSLATIONS } from '@/lib/fitoTranslations.js';
import { cn } from '@/lib/utils.js';

const getIconForType = (type) => {
  switch (type) {
    case 'nueva_oferta_compatible': return <Megaphone className="w-4 h-4 text-blue-500" />;
    case 'cambio_candidatura': return <FileSignature className="w-4 h-4 text-green-500" />;
    case 'curso_recomendado': return <BookOpen className="w-4 h-4 text-purple-500" />;
    case 'recordatorio_entrevista': return <Clock className="w-4 h-4 text-amber-500" />;
    case 'cv_incompleto': return <AlertTriangle className="w-4 h-4 text-red-500" />;
    default: return <Bell className="w-4 h-4 text-primary" />;
  }
};

const FitoNotifications = ({ language = 'es', onBack }) => {
  const t = FITO_TRANSLATIONS[language]?.notifications || FITO_TRANSLATIONS['es'].notifications;
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const records = await pb.collection('notificaciones_fito').getFullList({
          filter: `usuario_id = "${user.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        setNotifications(records);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    const unsubscribe = pb.collection('notificaciones_fito').subscribe('*', (e) => {
      if (e.action === 'create' && e.record.usuario_id === user.id) {
        setNotifications(prev => [e.record, ...prev]);
      } else if (e.action === 'update' && e.record.usuario_id === user.id) {
        setNotifications(prev => prev.map(n => n.id === e.record.id ? e.record : n));
      } else if (e.action === 'delete') {
        setNotifications(prev => prev.filter(n => n.id !== e.record.id));
      }
    });

    return () => {
      pb.collection('notificaciones_fito').unsubscribe('*');
    };
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await pb.collection('notificaciones_fito').update(id, { leida: true }, { $autoCancel: false });
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.leida);
    for (const n of unread) {
      await markAsRead(n.id);
    }
  };

  const clearOld = async () => {
    const read = notifications.filter(n => n.leida);
    for (const n of read) {
      try {
        await pb.collection('notificaciones_fito').delete(n.id, { $autoCancel: false });
      } catch (err) {
        console.error('Error deleting notification:', err);
      }
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full">
        <Bell className="w-12 h-12 text-muted mb-4" />
        <p className="text-muted-foreground text-sm">Debes iniciar sesión para ver tus notificaciones.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background animate-fade-in z-50 relative">
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 rounded-full">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="font-bold text-foreground">{t.title}</h2>
        </div>
        <div className="flex gap-2">
          {notifications.some(n => !n.leida) && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
              <Check className="w-3 h-3 mr-1" /> {t.markAllRead}
            </Button>
          )}
          {notifications.some(n => n.leida) && (
            <Button variant="ghost" size="sm" onClick={clearOld} className="h-8 text-xs text-destructive hover:text-destructive">
              <Trash2 className="w-3 h-3 mr-1" /> {t.clearOld}
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Bell className="w-8 h-8 mb-3 opacity-20" />
            <p className="text-sm">{t.empty}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={cn(
                  "p-3 rounded-xl border transition-colors flex gap-3",
                  n.leida ? "bg-card border-border" : "bg-primary/5 border-primary/20"
                )}
              >
                <div className="mt-1 flex-shrink-0">
                  {getIconForType(n.tipo)}
                </div>
                <div className="flex-1">
                  <p className={cn("text-sm", n.leida ? "text-muted-foreground" : "text-foreground font-medium")}>
                    {n.mensaje}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(n.created).toLocaleString(language)}
                  </p>
                </div>
                {!n.leida && (
                  <Button variant="ghost" size="icon" onClick={() => markAsRead(n.id)} className="h-6 w-6 rounded-full flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

// Simple ChevronLeft to avoid extra imports if not available globally
const ChevronLeft = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6"/></svg>
);

export default FitoNotifications;