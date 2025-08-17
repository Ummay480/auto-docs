/**
 * @fileOverview This file contains shared Zod schemas for AI flows.
 */
import {z} from 'genkit';

export const ItemSchema = z.object({
  hsCode: z.string().describe('The HS Code for the item.'),
  descriptionOfGoods: z.string().describe('The description of the goods.'),
  uom: z.string().describe('The Unit of Measurement for the item.'),
  weightKg: z.number().describe('The weight of the item in kilograms.'),
  quantity: z.number().describe('The quantity of the item.'),
  unitValue: z.number().describe('The unit value of the item in dollars.'),
  totalValue: z.number().describe('The total value of the item in dollars.'),
});

export const ExtractDocumentDataOutputSchema = z.object({
  nocGatePassCategory: z.string().describe('The NOC/Gate Pass Category.'),
  nocGatePassNumber: z.string().describe('The NOC/Gate Pass Number.'),
  investorLicenseNumber: z.string().describe('The Investor License Number.'),
  consigneeName: z.string().describe('The name of the consignee.'),
  consigneeEpzNumber: z.string().describe('The EPZ number of the consignee.'),
  consigneeAddress: z.string().describe('The address of the consignee.'),
  consignorName: z.string().describe('The name of the consignor.'),
  consignorAddress: z.string().describe('The address of the consignor.'),
  blAwNumber: z.string().describe('The BL/AW Number.'),
  virNumber: z.string().describe('The VIR Number.'),
  blAwDate: z.string().describe('The BL/AW Date.'),
  invoiceNumber: z.string().describe('The invoice number.'),
  invoiceDate: z.string().describe('The invoice date.'),
  nameOfClearingAgent: z.string().describe('The name of the clearing agent.'),
  marksAndNos: z.string().describe('The marks and nos.'),
  country: z.string().describe('The country of origin or destination.'),
  items: z.array(ItemSchema).describe('A list of items from the document.'),
  bondedCarrier: z.string().describe('The bonded carrier.'),
  containerNo: z.string().describe('The container number.'),
  detailsAdditionalInformation: z
    .string()
    .describe('Details and additional information.'),
  issuanceDate: z.string().describe('The issuance date of the NOC/Gate Pass.'),
  expiryDate: z.string().describe('The expiry date of the NOC/Gate Pass.'),
  remarks: z.string().describe('Any remarks on the document.'),
  issuedBy: z.string().describe('The name of the issuer.'),
});
export type ExtractDocumentDataOutput = z.infer<typeof ExtractDocumentDataOutputSchema>;
