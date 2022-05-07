export default interface Payment {
  servicesBy: string;
  date: Date;
  hourly: number;
  vat:number;
  paymentDue: number;
}
