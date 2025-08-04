import { ROLE, Sex } from "@prisma/client";

export interface iCreatedUser {
  username: string;
  email: string;
  fullName: string;
  profilePhoto: string;
  coverPhoto: string;
  sex: Sex;
  phone_number: string;
  isActive: boolean;
  password: string;
  comfirmPassword: string;
}

export interface iUpdatedUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone_number: string;
  profilePhoto: string;
  coverPhoto: string;
  password: string;
}

export interface iLogingUser {
  email: string;
  password: string;
}

// update role

export interface iUpdatedRole {
  email: string;
  role: ROLE;
}
