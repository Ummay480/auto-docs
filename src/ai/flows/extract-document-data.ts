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
  prompt: `You are an expert in logistics documentation. Your task is to create a commercial invoice based on the provided Bill of Lading (B/L).

You will extract all relevant information from the B/L and use it to populate the fields of an invoice. If some invoice-specific fields like invoice number, invoice date, or item values are not present in the B/L, you must generate logical placeholder values for them.

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
