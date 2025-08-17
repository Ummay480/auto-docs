'use server';

/**
 * @fileOverview Flow to generate a pre-filled Excel template from extracted data.
 *
 * - generateExcelTemplate - A function that generates an Excel template.
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
  excelTemplate: z
    .string()
    .describe('A string representation of the generated Excel/CSV template data.'),
  columnDefinitions: z
    .string()
    .describe(
      'A JSON string containing an array of column definitions, useful for displaying the template structure.'
    ),
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
  prompt: `You are an AI assistant specialized in generating Excel/CSV templates pre-filled with data extracted from various types of documents like invoices, packing lists, and bills of lading.

  The user will provide you with the document type and the extracted data in JSON format. Your task is to generate a template suitable for easy copy-pasting into systems like WEBOC.

  Instructions:
  1. Analyze the document type to understand the expected data fields.
  2. Examine the extracted data to identify available information.
  3. Generate a CSV formatted string that has the column names extracted from the extracted data.
  4. Use the extracted data to populate the rows.
  5. Return the column definitions in a JSON format.

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
