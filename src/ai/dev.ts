import { config } from 'dotenv';
config();

import '@/ai/flows/highlight-common-mistakes.ts';
import '@/ai/flows/extract-document-data.ts';
import '@/ai/flows/generate-document-summary.ts';
import '@/ai/flows/validate-extracted-data.ts';
import '@/ai/flows/generate-excel-template.ts';
import '@/ai/schemas.ts';
