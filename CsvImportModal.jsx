import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { parseCSV } from '@/lib/csvParser';

const BATCH_SIZE = 50;
const API_BASE = '/hcgi/api';

export default function CsvImportModal({ open, onOpenChange, onImportComplete }) {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState(null);
  const fileInputRef = useRef(null);

  const resetState = () => {
    setProcessing(false);
    setProgress(0);
    setSummary(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessing(true);
    setProgress(0);

    try {
      const text = await file.text();
      const rows = parseCSV(text);

      if (rows.length === 0) {
        toast.error('No valid data found in CSV');
        resetState();
        return;
      }

      const batches = [];
      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        batches.push(rows.slice(i, i + BATCH_SIZE));
      }

      let totalImported = 0;
      let totalSkipped = 0;
      const allErrors = [];

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        try {
          const response = await fetch(`${API_BASE}/admin/import-csv/batch`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${pb.authStore.token}`
            },
            body: JSON.stringify({ batch })
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || 'Batch failed');
          }

          totalImported += result.imported;
          totalSkipped += result.skipped;
          if (result.errors) {
            allErrors.push(...result.errors);
          }
        } catch (err) {
          console.error('Batch error:', err);
          toast.error(`Error processing batch ${i + 1}`);
          allErrors.push(`Batch ${i + 1}: ${err.message}`);
        }

        setProgress(Math.round(((i + 1) / batches.length) * 100));
      }

      const finalSummary = {
        total: rows.length,
        imported: totalImported,
        skipped: totalSkipped,
        errors: allErrors
      };

      setSummary(finalSummary);

      try {
        await fetch(`${API_BASE}/admin/import-csv/log`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${pb.authStore.token}`
          },
          body: JSON.stringify(finalSummary)
        });
      } catch (logErr) {
        console.error('Failed to log import summary:', logErr);
      }

      if (onImportComplete) {
        onImportComplete();
      }

    } catch (error) {
      console.error('CSV read error:', error);
      toast.error('Failed to read CSV file');
      resetState();
    }
  };

  const handleOpenChange = (newOpen) => {
    if (!newOpen && processing && !summary) {
      toast.error('Import in progress. Please wait.');
      return;
    }
    if (!newOpen) {
      resetState();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Candidates from CSV</DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {!processing && !summary && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-muted rounded-full">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a CSV file with candidates data.
                </p>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <Button onClick={() => fileInputRef.current?.click()}>
                  Select CSV File
                </Button>
              </div>
            </div>
          )}

          {processing && !summary && (
            <div className="space-y-4">
              <div className="text-center text-sm font-medium">
                Processing... {progress}%
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {summary && (
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-2 text-primary font-medium">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Import Complete</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-green-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{summary.imported}</div>
                  <div className="text-sm text-green-600/80">Imported</div>
                </div>
                <div className="p-4 bg-amber-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600">{summary.skipped}</div>
                  <div className="text-sm text-amber-600/80">Skipped</div>
                </div>
              </div>

              {summary.errors && summary.errors.length > 0 && (
                <div className="mt-4 p-4 border border-destructive/20 rounded-lg bg-destructive/10">
                  <div className="flex items-center space-x-2 text-destructive font-medium mb-2">
                    <XCircle className="h-4 w-4" />
                    <span>{summary.errors.length} Errors Occurred</span>
                  </div>
                  <ul className="text-sm text-destructive/80 space-y-1 max-h-32 overflow-y-auto">
                    {summary.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-center mt-6">
                <Button variant="outline" onClick={resetState}>
                  Import another file
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}