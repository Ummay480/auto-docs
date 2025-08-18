'use server';

/**
 * @fileOverview A document data extraction AI agent.
 *
 * - extractDocumentData - A function that handles the document data extraction process.
 * - ExtractDocumentDataInput - The input type for the extractDocumentData function.
 * - ExtractDocumentDataOutput - The return type for the extractDocumentData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ExtractDocumentDataOutput, ExtractDocumentDataOutputSchema } from '../schemas';

export type { ExtractDocumentDataOutput };

const ExtractDocumentDataInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The invoice document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
    blDataUri: z
    .string()
    .describe(
      "The Bill of Lading (B/L) document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type ExtractDocumentDataInput = z.infer<typeof ExtractDocumentDataInputSchema>;


export async function extractDocumentData(input: ExtractDocumentDataInput): Promise<ExtractDocumentDataOutput> {
  return extractDocumentDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractDocumentDataPrompt',
  input: {schema: ExtractDocumentDataInputSchema},
  output: {schema: ExtractDocumentDataOutputSchema},
  prompt: `You are an expert data extraction specialist.

You will extract all the relevant fields from the provided Invoice and Bill of Lading (B/L) documents. If there is conflicting information between the two documents, prioritize the information from the Invoice.

Invoice: {{media url=documentDataUri}}
Bill of Lading: {{media url=blDataUri}}
`,
});

const extractDocumentDataFlow = ai.defineFlow(
  {
    name: 'extractDocumentDataFlow',
    inputSchema: ExtractDocumentDataInputSchema,
    outputSchema: ExtractDocumentDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
