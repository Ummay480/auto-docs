'use server';

/**
 * @fileOverview Finds applicable Statutory Regulatory Orders (SROs) for given items.
 *
 * - findApplicableSro - A function that identifies relevant SROs.
 * - FindApplicableSroInput - The input type for the findApplicableSro function.
 * - FindApplicableSroOutput - The return type for the findApplicableSro function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ItemSchema } from '../schemas';

const FindApplicableSroInputSchema = z.object({
  items: z.array(ItemSchema).describe('A list of items from the document.'),
});
export type FindApplicableSroInput = z.infer<typeof FindApplicableSroInputSchema>;

const SroInfoSchema = z.object({
    sroNumber: z.string().describe('The SRO number or identifier.'),
    purpose: z.string().describe('A brief description of the SRO\'s purpose or relevance to the item.'),
    hsCode: z.string().describe('The HS Code of the item this SRO applies to.'),
});

const FindApplicableSroOutputSchema = z.object({
  sros: z
    .array(SroInfoSchema)
    .describe('A list of applicable SROs found for the items.'),
});
export type FindApplicableSroOutput = z.infer<typeof FindApplicableSroOutputSchema>;

export async function findApplicableSro(input: FindApplicableSroInput): Promise<FindApplicableSroOutput> {
  return findApplicableSroFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findApplicableSroPrompt',
  input: {schema: FindApplicableSroInputSchema},
  output: {schema: FindApplicableSroOutputSchema},
  prompt: `You are an expert in international trade regulations and customs documentation, specifically regarding Pakistani Statutory Regulatory Orders (SROs).
  
  Based on the list of items provided below, identify any applicable SROs. For each item, check if its HS Code or description matches any known SROs that grant exemptions, impose restrictions, or set specific conditions.

  For each relevant SRO you find, provide the SRO number, the HS code of the item it applies to, and a brief summary of its purpose or impact (e.g., "Exemption from customs duty," "Requires import license").

  If no SROs are applicable to an item, do not include it in the output. If no SROs are found for any items, return an empty array.

  Items:
  {{#each items}}
  - HS Code: {{hsCode}}, Description: {{descriptionOfGoods}}
  {{/each}}
  `,
});

const findApplicableSroFlow = ai.defineFlow(
  {
    name: 'findApplicableSroFlow',
    inputSchema: FindApplicableSroInputSchema,
    outputSchema: FindApplicableSroOutputSchema,
  },
  async input => {
    // If there are no items, no need to call the AI.
    if (input.items.length === 0) {
      return { sros: [] };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
