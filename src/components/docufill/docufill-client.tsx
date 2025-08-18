'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { runAllAiFlows, type AiFlowResults } from '@/app/actions';
import { DocufillForm, type FormValues } from './docufill-form';
import { ResultsView } from './results-view';


export function DocuFillClient() {
  const [results, setResults] = useState<AiFlowResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const handleProcessDocument = async ({ invoiceFile, blFile }: FormValues) => {
    if (!invoiceFile || !blFile) return;

    setIsLoading(true);
    setResults(null);
    setFileName(invoiceFile.name);

    const fileToDataUrl = (fileToConvert: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(fileToConvert);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    try {
        const invoiceDataUri = await fileToDataUrl(invoiceFile);
        const blDataUri = await fileToDataUrl(blFile);
        const aiResults = await runAllAiFlows(invoiceDataUri, blDataUri, "Invoice");
        setResults(aiResults);
    } catch (error) {
        console.error("Error processing document:", error);
        toast({
            variant: "destructive",
            title: "Processing Failed",
            description: "An AI processing error occurred. Please check the document format or try again.",
        });
        setResults(null);
    } finally {
        setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setIsLoading(false);
    setFileName('');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {isLoading || results ? (
        <ResultsView results={results} isLoading={isLoading} onReset={handleReset} fileName={fileName}/>
      ) : (
        <DocufillForm onSubmit={handleProcessDocument} isLoading={isLoading} />
      )}
    </div>
  );
}
