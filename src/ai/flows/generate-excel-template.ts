'use server';

/**
 * @fileOverview Flow to generate a pre-filled HTML invoice from extracted data.
 *
 * - generateExcelTemplate - A function that generates an HTML invoice.
 * - GenerateExcelTemplateInput - The input type for the generateExcelTemplate function.
 * - GenerateExcelTemplateOutput - The return type for the generateExcelTemplate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExcelTemplateInputSchema = z.object({
  documentType: z
    .string()
    .describe('The type of document being processed (e.g., Invoice, Packing List, BL).'),
  extractedData: z
    .string()
    .describe(
      'A JSON string containing the extracted data from the document. Keys are field names, and values are the extracted data.'
    ),
});
export type GenerateExcelTemplateInput = z.infer<typeof GenerateExcelTemplateInputSchema>;

const GenerateExcelTemplateOutputSchema = z.object({
  invoiceHtml: z
    .string()
    .describe('A string containing a full, well-structured HTML document for the invoice.'),
});
export type GenerateExcelTemplateOutput = z.infer<typeof GenerateExcelTemplateOutputSchema>;

export async function generateExcelTemplate(
  input: GenerateExcelTemplateInput
): Promise<GenerateExcelTemplateOutput> {
  return generateExcelTemplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExcelTemplatePrompt',
  input: {schema: GenerateExcelTemplateInputSchema},
  output: {schema: GenerateExcelTemplateOutputSchema},
  prompt: `You are an AI assistant specialized in creating professional commercial invoices.

  Based on the provided extracted data in JSON format, generate a clean, well-structured, and styled HTML document representing the invoice.

  Use inline CSS for styling to ensure the invoice looks good. The design should be professional, with clear sections for consignor, consignee, invoice details, item descriptions, and totals. The entire output should be a single HTML string.

  Document Type: {{{documentType}}}
  Extracted Data: {{{extractedData}}}
  `,
});

const generateExcelTemplateFlow = ai.defineFlow(
  {
    name: 'generateExcelTemplateFlow',
    inputSchema: GenerateExcelTemplateInputSchema,
    outputSchema: GenerateExcelTemplateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
