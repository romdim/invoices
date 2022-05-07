import { Address } from "./address";

export default interface Company {
  companyName: string;
  shortName: string;
  regarding?: string;
  address: Address;
  notes?: string;
  vatNumber?: string;
  registeredNumber?: string;
  bankAccount?: string;
};
