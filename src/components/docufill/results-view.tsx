'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, AlertTriangle, Download, FileText, Bot, ListChecks, FileSpreadsheet, RotateCcw, Loader2, DollarSign } from 'lucide-react';
import type { AiFlowResults } from '@/app/actions';
import { Skeleton } from '../ui/skeleton';

interface ResultsViewProps {
  results: AiFlowResults | null;
  isLoading: boolean;
  onReset: () => void;
  fileName: string;
}

export function ResultsView({ results, isLoading, onReset, fileName }: ResultsViewProps) {
    const handleDownload = () => {
        if (!results?.template.invoiceHtml) return;
        const blob = new Blob([results.template.invoiceHtml], { type: 'text/html;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `invoice.html`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const InvoiceHtmlView = () => {
      if (!results?.template.invoiceHtml) return <p>No invoice data available.</p>;

      return (
          <div className="overflow-x-auto relative border rounded-lg p-4 bg-white">
              <iframe
                  srcDoc={results.template.invoiceHtml}
                  className="w-full h-[600px] border-0"
                  title="Generated Invoice"
              />
          </div>
      );
  };

    const LoadingSkeleton = () => (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-5 w-full" />
                </CardContent>
            </Card>
        </div>
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-40 w-full" />
            </CardContent>
        </Card>
      </div>
    );

    return (
        <div>
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Processing Results</h2>
                  <p className="text-muted-foreground">AI analysis for: <span className="font-medium text-foreground">{fileName}</span></p>
                </div>
                <Button onClick={onReset} variant="outline" disabled={isLoading}>
                    <RotateCcw className="mr-2 h-4 w-4"/>
                    Process Another Document
                </Button>
            </div>
            
            {isLoading && !results && <LoadingSkeleton />}

            {results && (
                <div className="space-y-6">
                    {/* Extracted Data Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><FileText className="text-primary"/> Extracted Data</CardTitle>
                            <CardDescription>Key information identified by the AI.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                <div className="flex justify-between"><strong>Invoice #:</strong> <span>{results.extraction.invoiceNumber}</span></div>
                                <div className="flex justify-between"><strong>Invoice Date:</strong> <span>{results.extraction.invoiceDate}</span></div>
                                <div className="flex justify-between"><strong>BL/AW #:</strong> <span>{results.extraction.blAwNumber}</span></div>
                                <div className="flex justify-between"><strong>BL/AW Date:</strong> <span>{results.extraction.blAwDate}</span></div>
                                <div className="flex justify-between"><strong>Consignee:</strong> <span>{results.extraction.consigneeName}</span></div>
                                <div className="flex justify-between"><strong>Consignor:</strong> <span>{results.extraction.consignorName}</span></div>
                                <div className="flex justify-between"><strong>Country:</strong> <span>{results.extraction.country}</span></div>
                            </div>
                        </CardContent>
                    </Card>

                     {/* Items Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ListChecks className="text-primary" /> Items Information</CardTitle>
                            <CardDescription>Details of the items from the document.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>HS Code</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>UOM</TableHead>
                                        <TableHead className="text-right">Weight (Kg)</TableHead>
                                        <TableHead className="text-right">Quantity</TableHead>
                                        <TableHead className="text-right">Unit Value ($)</TableHead>
                                        <TableHead className="text-right">Total Value ($)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {results.extraction.items.map((item, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Badge variant="secondary">{item.hsCode}</Badge></TableCell>
                                            <TableCell>{item.descriptionOfGoods}</TableCell>
                                            <TableCell>{item.uom}</TableCell>
                                            <TableCell className="text-right">{item.weightKg.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">{item.quantity}</TableCell>
                                            <TableCell className="text-right">{item.unitValue.toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-semibold">{item.totalValue.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Summary Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Bot className="text-primary"/> AI Summary</CardTitle>
                            <CardDescription>A concise summary generated from the document data.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-foreground">{results.summary.summary}</p>
                        </CardContent>
                    </Card>

                    {/* Template Card */}
                    <Card>
                        <CardHeader>
                           <div className="flex justify-between items-start">
                             <div>
                                <CardTitle className="flex items-center gap-2"><FileSpreadsheet className="text-primary"/> Generated Invoice</CardTitle>
                                <CardDescription>A printable invoice generated from the extracted data.</CardDescription>
                             </div>
                             <Button onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Download Invoice</Button>
                           </div>
                        </CardHeader>
                        <CardContent>
                            <InvoiceHtmlView />
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
