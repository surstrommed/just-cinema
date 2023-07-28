export interface IProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
}

export interface IProfileUpdateValues {
  name?: string;
  email?: string;
  image?: string | null;
}
