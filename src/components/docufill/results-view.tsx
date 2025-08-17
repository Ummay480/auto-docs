'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, AlertTriangle, Download, FileText, Bot, ListChecks, FileSpreadsheet, RotateCcw, Loader2 } from 'lucide-react';
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
        if (!results) return;
        const blob = new Blob([results.template.excelTemplate], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `docufill_template_${fileName}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const CsvTable = () => {
        if (!results?.template.excelTemplate) return <p>No template data available.</p>;

        const rows = results.template.excelTemplate.split('\n').filter(row => row.trim() !== '');
        if (rows.length === 0) return <p>Template is empty.</p>;

        const headers = rows[0].split(',');
        const bodyRows = rows.slice(1).map(row => row.split(','));

        return (
            <div className="overflow-x-auto relative border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {headers.map((header, i) => <TableHead key={i}>{header.trim()}</TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bodyRows.map((row, i) => (
                            <TableRow key={i}>
                                {row.map((cell, j) => <TableCell key={j}>{cell.trim()}</TableCell>)}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Extracted Data Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><FileText className="text-primary"/> Extracted Data</CardTitle>
                                <CardDescription>Key information identified by the AI.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex justify-between"><strong>Invoice Number:</strong> <span>{results.extraction.invoiceNumber}</span></li>
                                    <li className="flex justify-between"><strong>Invoice Date:</strong> <span>{results.extraction.invoiceDate}</span></li>
                                    <li className="flex justify-between"><strong>BL/AW Number:</strong> <span>{results.extraction.blAwNumber}</span></li>
                                    <li className="flex justify-between"><strong>Consignee:</strong> <span>{results.extraction.consigneeName}</span></li>
                                    <li className="flex justify-between"><strong>Consignor:</strong> <span>{results.extraction.consignorName}</span></li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Validation & Mistakes Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><ListChecks className="text-primary"/> Validation &amp; Analysis</CardTitle>
                                <CardDescription>Automated checks for errors and inconsistencies.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {results.validation.isValid ? (
                                    <Alert variant="default" className="border-green-300 bg-green-50">
                                        <CheckCircle2 className="h-4 w-4 text-green-600"/>
                                        <AlertTitle className="text-green-800">Validation Passed</AlertTitle>
                                        <AlertDescription className="text-green-700">No critical errors found in the extracted data.</AlertDescription>
                                    </Alert>
                                ) : (
                                    <Alert variant="destructive">
                                        <AlertTriangle className="h-4 w-4"/>
                                        <AlertTitle>Validation Failed</AlertTitle>
                                        <AlertDescription>
                                            <ul className="list-disc pl-5">
                                                {results.validation.errors.map((err, i) => <li key={i}><strong>{err.field}:</strong> {err.message}</li>)}
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                )}
                                {results.mistakes.highlightedMistakes.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Potential Mistakes:</h4>
                                        <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                            {results.mistakes.highlightedMistakes.map((mistake, i) => <li key={i}>{mistake}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

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
                                            <TableCell className="text-right">{item.quantity.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">{item.unitValue.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">{item.totalValue.toFixed(2)}</TableCell>
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
                                <CardTitle className="flex items-center gap-2"><FileSpreadsheet className="text-primary"/> Generated Template</CardTitle>
                                <CardDescription>Formatted for easy copy-paste into customs systems.</CardDescription>
                             </div>
                             <Button onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Download CSV</Button>
                           </div>
                        </CardHeader>
                        <CardContent>
                            <CsvTable />
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
