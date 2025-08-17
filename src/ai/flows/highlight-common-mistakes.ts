'use server';

/**
 * @fileOverview Highlights common mistakes in a document using AI analysis.
 *
 * - highlightCommonMistakes - A function that highlights common mistakes in a document.
 * - HighlightCommonMistakesInput - The input type for the highlightCommonMistakes function.
 * - HighlightCommonMistakesOutput - The return type for the highlightCommonMistakes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HighlightCommonMistakesInputSchema = z.object({
  documentText: z.string().describe('The text content of the document to analyze.'),
  documentType: z.string().describe('The type of document (e.g., invoice, packing list).'),
});
export type HighlightCommonMistakesInput = z.infer<typeof HighlightCommonMistakesInputSchema>;

const HighlightCommonMistakesOutputSchema = z.object({
  highlightedMistakes: z
    .array(z.string())
    .describe('A list of common mistakes found in the document.'),
});
export type HighlightCommonMistakesOutput = z.infer<typeof HighlightCommonMistakesOutputSchema>;

export async function highlightCommonMistakes(input: HighlightCommonMistakesInput): Promise<HighlightCommonMistakesOutput> {
  return highlightCommonMistakesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'highlightCommonMistakesPrompt',
  input: {schema: HighlightCommonMistakesInputSchema},
  output: {schema: HighlightCommonMistakesOutputSchema},
  prompt: `You are an AI assistant specialized in identifying common mistakes in documents related to logistics and international trade.
  Given the text content of a document and its type, analyze the document for potential errors such as incorrect HS Codes, missing tax percentages, inconsistencies in quantity and weight, and incomplete consignee/consignor details.
  Return a list of highlighted mistakes found in the document.

  Document Type: {{{documentType}}}
  Document Text: {{{documentText}}}

  Focus on identifying errors that could lead to compliance issues or delays in customs clearance.
  If there are no mistakes return an empty array.
  `,
});

const highlightCommonMistakesFlow = ai.defineFlow(
  {
    name: 'highlightCommonMistakesFlow',
    inputSchema: HighlightCommonMistakesInputSchema,
    outputSchema: HighlightCommonMistakesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
