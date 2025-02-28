import { AddressForm } from "../../common/types";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  name?: string;
}

export interface SignupFormData {
  username: string;
  password: string;
  name: string;
  contact: string;
  address: AddressForm;
  paymentMethod: PaymentMethodForm;
}

export interface PaymentMethodForm {
  paymentType: string;
  cardNumber: string;
  expiryDate: string;
  isDefault: boolean;
}

export interface SignupValidationErrors {
  username?: string;
  password?: string;
  name?: string;
  contact?: string;
  address?: {
    address?: string;
    city?: string;
    postalCode?: string;
  };
  paymentMethod?: {
    cardNumber?: string;
    expiryDate?: string;
  };
}
