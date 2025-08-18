'use client';

import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import { UploadCloud, Loader2, File as FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type FormValues = {
  invoiceFile: File | null;
  blFile: File | null;
};

interface DocufillFormProps {
  onSubmit: (values: FormValues) => void;
  isLoading: boolean;
}

const FileUploadArea = ({
  file,
  onFileChange,
  id,
  title,
}: {
  file: File | null;
  onFileChange: (file: File) => void;
  id: string;
  title: string;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{title}</Label>
      <label
        htmlFor={id}
        className={cn(
          "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors",
          isDragging ? "border-primary" : "border-border"
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {file ? (
            <>
              <FileIcon className="w-10 h-10 mb-3 text-primary" />
              <p className="mb-2 text-sm text-foreground">
                <span className="font-semibold">{file.name}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </>
          ) : (
            <>
              <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">PDF, DOCX, XLSX, PNG, or JPG</p>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          id={id}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
        />
      </label>
    </div>
  );
};


export function DocufillForm({ onSubmit, isLoading }: DocufillFormProps) {
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [blFile, setBlFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ invoiceFile, blFile });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Upload Your Documents</CardTitle>
          <CardDescription>Upload an Invoice and Bill of Lading to begin extraction.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploadArea
                id="invoice-upload"
                title="Invoice File"
                file={invoiceFile}
                onFileChange={setInvoiceFile}
              />
              <FileUploadArea
                id="bl-upload"
                title="Bill of Lading File"
                file={blFile}
                onFileChange={setBlFile}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={!invoiceFile || !blFile || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : "Process Documents"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
