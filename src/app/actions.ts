
'use server';

import {
  extractDocumentData,
  type ExtractDocumentDataOutput,
} from '@/ai/flows/extract-document-data';
import {
  generateDocumentSummary,
  type GenerateDocumentSummaryOutput,
} from '@/ai/flows/generate-document-summary';
import {
  generateExcelTemplate,
  type GenerateExcelTemplateOutput,
} from '@/ai/flows/generate-excel-template';
import {
  highlightCommonMistakes,
  type HighlightCommonMistakesOutput,
} from '@/ai/flows/highlight-common-mistakes';
import {
  validateExtractedData,
  type ValidateExtractedDataOutput,
} from '@/ai/flows/validate-extracted-data';

export type AiFlowResults = {
  extraction: ExtractDocumentDataOutput;
  validation: ValidateExtractedDataOutput;
  summary: GenerateDocumentSummaryOutput;
  mistakes: HighlightCommonMistakesOutput;
  template: GenerateExcelTemplateOutput;
};

export async function runAllAiFlows(
  invoiceDataUri: string,
  blDataUri: string,
  docType: string
): Promise<AiFlowResults> {
    const extraction = await extractDocumentData({ documentDataUri: invoiceDataUri, blDataUri: blDataUri });

    // Use the structured data from extraction for subsequent steps.
    // Stringify the JSON to create a "text" version for text-based flows.
    const documentText = JSON.stringify(extraction, null, 2);

    // Run remaining flows in parallel for efficiency.
    const [validation, summary, mistakes, template] = await Promise.all([
      validateExtractedData({ extractedData: extraction, documentType: docType }),
      generateDocumentSummary({ documentText }),
      highlightCommonMistakes({ documentText, documentType: docType }),
      generateExcelTemplate({ documentType: docType, extractedData: documentText }),
    ]);

    return { extraction, validation, summary, mistakes, template };
}
