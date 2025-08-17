'use server';

/**
 * @fileOverview This file defines a Genkit flow for validating extracted data from documents.
 *
 * - validateExtractedData - A function that validates extracted data.
 * - ValidateExtractedDataInput - The input type for the validateExtractedData function.
 * - ValidateExtractedDataOutput - The output type for the validateExtractedData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateExtractedDataInputSchema = z.object({
  extractedData: z.record(z.any()).describe('The extracted data to validate.'),
  documentType: z.string().describe('The type of document the data was extracted from (e.g., invoice, packing list).'),
});
export type ValidateExtractedDataInput = z.infer<typeof ValidateExtractedDataInputSchema>;

const ValidationErrorSchema = z.object({
  field: z.string().describe('The field that failed validation.'),
  message: z.string().describe('A message describing the validation error.'),
});

const ValidateExtractedDataOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the extracted data is valid.'),
  errors: z.array(ValidationErrorSchema).describe('A list of validation errors, if any.'),
  validatedData: z.record(z.any()).describe('The validated and potentially corrected data.'),
});
export type ValidateExtractedDataOutput = z.infer<typeof ValidateExtractedDataOutputSchema>;

export async function validateExtractedData(input: ValidateExtractedDataInput): Promise<ValidateExtractedDataOutput> {
  return validateExtractedDataFlow(input);
}

const validateExtractedDataPrompt = ai.definePrompt({
  name: 'validateExtractedDataPrompt',
  input: {
    schema: ValidateExtractedDataInputSchema,
  },
  output: {
    schema: ValidateExtractedDataOutputSchema,
  },
  prompt: `You are an AI expert in document validation, particularly for logistics and trade documents.  Your task is to validate the extracted data from a given document, identify potential errors, and suggest corrections.

Document Type: {{{documentType}}}
Extracted Data: {{{extractedData}}}

Consider the following aspects during validation:
- Completeness: Ensure all required fields are present and not empty.
- Consistency: Check for inconsistencies between related fields (e.g., total amount vs. item prices).
- HS Code Validity: Verify that HS codes are valid for the given product description.
- Quantity and Weight: Ensure the quantity and weight are reasonable and consistent with the product and document type.
- Consignor/Consignee Details: Check for completeness and validity of consignor and consignee information.

Based on your analysis, determine if the extracted data is valid. If not, provide a list of errors with specific field names and descriptive messages.  Also, provide a validatedData object, containing the original data, with any corrections that you've identified applied to it.  If no corrections are necessary, the validatedData object should be identical to the extractedData object.

Output in the following JSON format: {{{outputFormat schema=ValidateExtractedDataOutputSchema}}}`,
});

const validateExtractedDataFlow = ai.defineFlow(
  {
    name: 'validateExtractedDataFlow',
    inputSchema: ValidateExtractedDataInputSchema,
    outputSchema: ValidateExtractedDataOutputSchema,
  },
  async input => {
    const {output} = await validateExtractedDataPrompt(input);
    return output!;
  }
);
