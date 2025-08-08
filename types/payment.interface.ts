import { Currency, PaymentMethod, PaymentStatus } from "@prisma/client";

export interface iCreatedPayment {
  userId: number;
  courseId: number;
  enrollementId: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  phoneNumber: string;
  payment_method: PaymentMethod;
  isEnrolled: boolean;
}

export interface iUpdatedPayment {
  id: string;
  status: PaymentStatus;
  isEnrolled: boolean;
}
