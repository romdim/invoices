import { jsPDF } from 'jspdf';
import autoTable, { applyPlugin } from 'jspdf-autotable';

import type Company from 'src/types/company';
import type Payment from 'src/types/payment';
import {
  firstDayOfMonth,
  formatDate,
  lastDayOfMonth,
  lastWorkingDay,
  prependZero
} from './dateExtra';

applyPlugin(jsPDF);
let doc = new jsPDF();
console.log(doc.getFontList());

const formatNumber = (number: number): string => number.toLocaleString('nl-NL', {minimumFractionDigits: 2, maximumFractionDigits: 2});
const vendorRef = (date: Date, short: string): string => `${date.getFullYear()}-${prependZero(date.getMonth()+1)}-${short}`;
const pdfName = (date: Date, short: string): string => `Invoice${short}${prependZero(date.getMonth()+1)}-${date.getFullYear()}.pdf`;

const pdf = (billing: Company, vendor: Company, payment: Payment, days: number): void => {
  const quantity = days*8;
  const net = quantity*payment.hourly;
  const vat = net * payment.vat / 100;
  const gross = net + vat;
  const lineColor = '#000C66';
  const lineWidth = 0.25;
  const font = 'helvetica';
  const fillColorHeader = '#daeaf0'; // 7EC8E3
  const fillColorBody = '#CBCBCB'; // 7EC8E3

  doc.setFont(font);

  // Header
  doc.setFontSize(30);
  doc.text("Invoice", 14, 30);

  // Company Details
  autoTable(doc, {
    margin: { top: 40 },
    theme: 'plain',
    headStyles: { fontStyle: 'bold', cellPadding: { bottom: 3 } },
    styles: { font, fontSize: 12, cellPadding: { top: 1, bottom: 0 } },
    head: [['Billing Details', 'Vendor Details']],
    body: [
      [
        { content: billing.companyName },
        { content: vendor.companyName },
      ],
      [
        { content: billing.regarding || '' },
        { content: vendor.regarding || '' },
      ],
      [
        { content: billing.address.street },
        { content: vendor.address.street },
      ],
      [
        { content: billing.address.postcode + ' ' + billing.address.city },
        { content: vendor.address.postcode + ' ' + vendor.address.city },
      ],
      [
        { content: billing.address.country },
        { content: vendor.address.country },
      ],
      [
        { content: '' },
        { content: '' },
      ],
      [
        { content: `BTW nr. ${billing.vatNumber}` },
        { content: `BTW nr. ${vendor.vatNumber}` },
      ],
      [
        { content: billing.notes },
        { content: `Company Reg No. ${vendor.registeredNumber}` },
      ],
      [
        { content: '' },
        { content: `Bank Account: ${vendor.bankAccount}` },
      ],
    ],
  });

  // Date
  autoTable(doc, {
    margin: { left: 130 },
    styles: { font, lineColor, lineWidth },
    columnStyles: {
      0: { fillColor: fillColorHeader, fontStyle: 'bold' },
      1: { fillColor: false }
    },
    body: [
      ['Vendor Ref', vendorRef(payment.date, billing.shortName)],
      ['Invoice Date', formatDate(lastWorkingDay(payment.date))],
    ],
  });

  // Description
  doc.setFontSize(11);
  doc.text(`For Consultancy Services provided by: ${payment.servicesBy}`, 14, (doc as any).lastAutoTable.finalY + 10);

  // Services
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 15,
    theme: 'grid',
    styles: {
      font,
      lineColor,
      lineWidth,
      valign: 'middle',
      textColor: 20
    },
    headStyles: { halign: 'center', fillColor: fillColorHeader, fontStyle:'normal' },
    bodyStyles: { halign: 'center' },
    columns: [
      { header: 'Item', dataKey: 'item' },
      { header: 'Quantity', dataKey: 'quantity' },
      { header: 'Unit Price (EUR)', dataKey: 'unitPrice' },
      { header: 'Net (EUR)', dataKey: 'net' },
      { header: 'BTW (EUR)', dataKey: 'btw' },
      { header: 'Gross (EUR)', dataKey: 'gross' },
    ],
    body: [{
      item: `Standard Hourly\n${formatDate(firstDayOfMonth(payment.date))} - ${formatDate(lastDayOfMonth(payment.date))}`,
      quantity: quantity,
      unitPrice: formatNumber(payment.hourly),
      net: formatNumber(net),
      btw: formatNumber(vat),
      gross: formatNumber(gross)
    }],
  });

  // Final
  autoTable(doc, {
    margin: { left: 130 },
    styles: { lineColor, lineWidth, halign: 'right' },
    columnStyles: {
      0: { lineWidth: 0, fillColor: false, fontStyle: 'bold' },
      1: { fillColor: false }
    },
    body: [
      ['Net Total (EUR)', formatNumber(net)],
      ['BTW %', formatNumber(payment.vat) + '%'],
      ['BTW Total (EUR)', formatNumber(vat)],
      ['Invoice Total (EUR)', formatNumber(gross)],
    ],
  });

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 5,
    theme: 'plain',
    styles: { halign: 'right' },
    body: [
      [`Payment Terms: ${payment.paymentDue} days net`]
    ],
  });

  // window.open(doc.output('bloburl'));
  doc.save(pdfName(payment.date, vendor.shortName));
  doc = new jsPDF();
};

export default pdf;
