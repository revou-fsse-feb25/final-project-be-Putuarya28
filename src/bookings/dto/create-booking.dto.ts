export class CreateBookingDto {
  name!: string;
  email!: string;
  whatsapp!: string;
  date!: string;
  time!: string;
  customerId!: number;
  serviceType?: string;
  measurementType?: string;
  size?: string;
  bust?: string;
  waist?: string;
  hip?: string;
  shoulder?: string;
  sleeve?: string;
  kebayaLength?: string;
  notes?: string;
}
