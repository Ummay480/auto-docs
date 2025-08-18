
'use server';

import {
  extractDocumentData,
  type ExtractDocumentDataOutput,
} from '@/ai/flows/extract-document-data';
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
import {
  findApplicableSro,
  type FindApplicableSroOutput,
} from '@/ai/flows/find-applicable-sro';

export type AiFlowResults = {
  extraction: ExtractDocumentDataOutput;
  validation: ValidateExtractedDataOutput;
  mistakes: HighlightCommonMistakesOutput;
  template: GenerateExcelTemplateOutput;
  sro: FindApplicableSroOutput;
};

export async function runAllAiFlows(
  blDataUri: string
): Promise<AiFlowResults> {
    const extraction = await extractDocumentData({ blDataUri: blDataUri });

    // Use the structured data from extraction for subsequent steps.
    // Stringify the JSON to create a "text" version for text-based flows.
    const documentText = JSON.stringify(extraction, null, 2);
    const docType = "B/L";

    // Run remaining flows in parallel for efficiency.
    const [validation, mistakes, template, sro] = await Promise.all([
      validateExtractedData({ extractedData: extraction, documentType: docType }),
      highlightCommonMistakes({ documentText, documentType: docType }),
      generateExcelTemplate({ documentType: docType, extractedData: documentText }),
      findApplicableSro({ items: extraction.items }),
    ]);

    return { extraction, validation, mistakes, template, sro };
}
