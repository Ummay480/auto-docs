'use server';

/**
 * @fileOverview This flow generates a short summary of the document's data using AI summarization.
 *
 * - generateDocumentSummary - A function that handles the document summary generation process.
 * - GenerateDocumentSummaryInput - The input type for the generateDocumentSummary function.
 * - GenerateDocumentSummaryOutput - The return type for the generateDocumentSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDocumentSummaryInputSchema = z.object({
  documentText: z.string().describe('The text content of the document to summarize.'),
});
export type GenerateDocumentSummaryInput = z.infer<typeof GenerateDocumentSummaryInputSchema>;

const GenerateDocumentSummaryOutputSchema = z.object({
  summary: z.string().describe('A short summary of the document.'),
});
export type GenerateDocumentSummaryOutput = z.infer<typeof GenerateDocumentSummaryOutputSchema>;

export async function generateDocumentSummary(input: GenerateDocumentSummaryInput): Promise<GenerateDocumentSummaryOutput> {
  return generateDocumentSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDocumentSummaryPrompt',
  input: {schema: GenerateDocumentSummaryInputSchema},
  output: {schema: GenerateDocumentSummaryOutputSchema},
  prompt: `Summarize the following document text in a concise manner:\n\n{{{documentText}}}`, // Removed Handlebars `safeString`
});

const generateDocumentSummaryFlow = ai.defineFlow(
  {
    name: 'generateDocumentSummaryFlow',
    inputSchema: GenerateDocumentSummaryInputSchema,
    outputSchema: GenerateDocumentSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
