export interface Parcel {
  id: string;
  title: string;
  description: string;
  weightKg: number;
  pickupAddress: string;
  destination: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  senderName: string;
  senderEmail: string;
  receiverName: string;
  receiverEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParcelResponse {
  success: boolean;
  data: Parcel[];
}

