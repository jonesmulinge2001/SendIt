export interface CreateParcelDto {
  title: string;
  description: string;
  weightKg: number;
  pickupAddress: string;
  destination: string;
  senderName: string;
  senderEmail: string;
  receiverName: string;
  receiverEmail: string;
}
