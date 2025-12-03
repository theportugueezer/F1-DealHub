// Note: You'll need to install jsPDF and jsPDF-AutoTable
// npm install jspdf jspdf-autotable

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { convertCurrency } from './calculations';

export function exportToPDF(data, originalPlatformFees, originalImplementationFee) {
  const doc = new jsPDF();
  
  const customerName = data.customerName || 'Customer Name';
  const preparedBy = data.preparedBy || 'Sales Representative';
  const startDate = data.startDate || new Date().toISOString().split('T')[0];
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  let yPos = 20;
  
  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`Frankieone Quote for ${customerName}`, 14, yPos);
  yPos += 7;
  
  // Subtitle
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Quote prepared by ${preparedBy} on ${today}`, 14, yPos);
  yPos += 10;
  
  // Proposal header table
  doc.autoTable({
    startY: yPos,
    head: [['Start date', 'Term', 'Payment', 'Invoicing', 'Auto-renew']],
    body: [[
      startDate,
      `${data.contractTermMonths} months`,
      data.paymentFrequency,
      'In arrears, payment due within 14 days',
      data.autoRenew
    ]],
    theme: 'grid',
    headStyles: {
      fillColor: [68, 114, 196],
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: {
      fillColor: [180, 199, 231],
      textColor: 0,
      fontSize: 9
    },
    margin: { left: 14, right: 14 }
  });
  
  yPos = doc.lastAutoTable.finalY + 15;
  
  // Upfront payment section
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Upfront payment:', 14, yPos);
  yPos += 5;
  
  // Build upfront items table
  const platformDiscount = originalPlatformFees - data.platformFees;
  const implFeeDiscount = originalImplementationFee - data.implementationFee;
  const totalDiscount = platformDiscount + implFeeDiscount;
  
  const upfrontItems = [];
  
  // Annual package
  upfrontItems.push([
    `Annual ${data.customerPlan} package, comprising:`,
    '$' + originalPlatformFees.toLocaleString(),
    '',
    platformDiscount > 0 ? '$' + platformDiscount.toLocaleString() : '-',
    '$' + data.platformFees.toLocaleString()
  ]);
  
  // Portal seats
  if (data.portalPrice > 0) {
    upfrontItems.push([
      `- Case Manager Portal (seats)`,
      '$' + data.portalPrice.toLocaleString(),
      data.portalSeats.toString(),
      '-',
      '$' + data.portalPrice.toLocaleString()
    ]);
  }
  
  // Child accounts
  if (data.childAccounts > 0) {
    upfrontItems.push([
      '- child accounts',
      '$2,400',
      data.childAccounts.toString(),
      '-',
      '$' + data.childAccountsFee.toLocaleString()
    ]);
  } else {
    upfrontItems.push(['- child accounts', '-', '-', '-', '-']);
  }
  
  // Support level
  const supportText = data.supportLevel === 0 ? 'Basic (Access + Ticketing)' : 'Enhanced (Allocated CSM + TechOps)';
  const supportQty = data.supportLevel > 0 ? '1' : '-';
  upfrontItems.push([
    `- Support level: ${supportText}`,
    data.supportLevel === 0 ? '-' : '$' + data.supportLevel.toLocaleString(),
    supportQty,
    '-',
    data.supportLevel === 0 ? '-' : '$' + data.supportLevel.toLocaleString()
  ]);
  
  // Implementation support
  const implSupportText = data.implementationSupport === 0 ? 'No' : 'Yes';
  const implSupportQty = data.implementationSupport > 0 ? '1' : '-';
  upfrontItems.push([
    `- Additional implementation support: ${implSupportText}`,
    data.implementationSupport === 0 ? '-' : '$' + data.implementationSupport.toLocaleString(),
    implSupportQty,
    '-',
    data.implementationSupport === 0 ? '-' : '$' + data.implementationSupport.toLocaleString()
  ]);
  
  // Hosted OneSDK
  const hostedSDKText = data.hostedOneSDK === 0 ? 'No' : 'Yes';
  const hostedSDKQty = data.hostedOneSDK > 0 ? '1' : '-';
  upfrontItems.push([
    `- Hosted OneSDK: ${hostedSDKText}`,
    data.hostedOneSDK === 0 ? '-' : '$' + data.hostedOneSDK.toLocaleString(),
    hostedSDKQty,
    '-',
    data.hostedOneSDK === 0 ? '-' : '$' + data.hostedOneSDK.toLocaleString()
  ]);
  
  // Implementation fee
  upfrontItems.push([
    '- Implementation fee (one-off upfront standard package)',
    '$' + originalImplementationFee.toLocaleString(),
    '',
    implFeeDiscount > 0 ? '$' + implFeeDiscount.toLocaleString() : '-',
    '$' + data.implementationFee.toLocaleString()
  ]);
  
  // Minimum commitment
  upfrontItems.push([
    'Minimum commitment fees',
    '$' + data.minimumCommitment.toLocaleString(),
    '1',
    '-',
    '$' + data.minimumCommitment.toLocaleString()
  ]);
  
  doc.autoTable({
    startY: yPos,
    head: [['Item', 'Price', 'Qty', 'Discount', 'Total Cost']],
    body: upfrontItems,
    theme: 'grid',
    headStyles: {
      fillColor: [47, 85, 151],
      textColor: 255,
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'right'
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 2
    },
    columnStyles: {
      0: { halign: 'left', cellWidth: 85 },
      1: { halign: 'right', cellWidth: 30 },
      2: { halign: 'right', cellWidth: 15 },
      3: { halign: 'right', cellWidth: 20 },
      4: { halign: 'right', cellWidth: 32 }
    },
    margin: { left: 14, right: 14 }
  });
  
  yPos = doc.lastAutoTable.finalY + 5;
  
  // Total discount if any
  if (totalDiscount > 0) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(255, 243, 205);
    doc.rect(14, yPos, 182, 7, 'F');
    doc.text('Total Discount', 176, yPos + 5, { align: 'right' });
    doc.text('$' + totalDiscount.toLocaleString(), 196, yPos + 5, { align: 'right' });
    yPos += 12;
  } else {
    yPos += 3;
  }
  
  // Total
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Upfront payment', 14, yPos);
  doc.text('Total Price', 160, yPos);
  doc.text('$' + data.upfrontPayment.toLocaleString(), 196, yPos, { align: 'right' });
  yPos += 10;
  
  // Footer
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.rect(14, yPos, 182, 10);
  doc.text('Quote valid for 30 days upon receipt', 16, yPos + 6);
  
  const fileName = `quote_${customerName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

export function exportUsageToPDF(data, displayCurrency) {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(47, 85, 151);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Estimated Usage Report', 14, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(data.customerName || 'Customer Name', 14, 30);
  
  doc.setTextColor(0, 0, 0);
  
  let yPos = 50;
  
  // Products section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PRODUCT SEARCHES (TRANSACTION PRODUCTS)', 14, yPos);
  yPos += 7;
  
  const productRows = [];
  let totalMonthlyProduct = 0;
  
  data.products.forEach(p => {
    const convertedEffectivePrice = convertCurrency(p.effectivePrice, p.currency, displayCurrency);
    const convertedMonthlyCost = (p.volume * convertedEffectivePrice) / 12;
    totalMonthlyProduct += convertedMonthlyCost;
    
    productRows.push([
      p.name,
      p.currency,
      '$' + p.planPrice.toFixed(2),
      '$' + p.effectivePrice.toFixed(2),
      '$' + convertedEffectivePrice.toFixed(2),
      p.volume.toLocaleString(),
      '$' + ((p.volume * p.effectivePrice) / 12).toFixed(2),
      '$' + convertedMonthlyCost.toFixed(2)
    ]);
  });
  
  doc.autoTable({
    startY: yPos,
    head: [[
      'Product Name',
      'Currency',
      'Recommended Price',
      'Discounted Price',
      `Converted Price (${displayCurrency})`,
      'FX Est. Annual Volume',
      'Total Est Monthly Cost',
      `Total Est Monthly Cost (${displayCurrency})`
    ]],
    body: productRows,
    theme: 'grid',
    headStyles: {
      fillColor: [47, 85, 151],
      textColor: 255,
      fontSize: 7,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 7,
      cellPadding: 2
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 15, halign: 'center' },
      2: { cellWidth: 20, halign: 'right' },
      3: { cellWidth: 20, halign: 'right' },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 22, halign: 'right' },
      6: { cellWidth: 22, halign: 'right' },
      7: { cellWidth: 23, halign: 'right' }
    },
    margin: { left: 14, right: 14 }
  });
  
  yPos = doc.lastAutoTable.finalY + 10;
  
  const totalAnnualProductCost = totalMonthlyProduct * 12;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL ESTIMATED ANNUAL USAGE SPEND', 14, yPos);
  doc.text('$' + totalAnnualProductCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}), 196, yPos, { align: 'right' });
  
  yPos += 10;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Quote valid for 30 days upon receipt', 14, yPos);
  
  const fileName = `Estimated Usage - ${data.customerName || 'Customer Name'}.pdf`;
  doc.save(fileName);
}

export function exportToCSV(data, originalPlatformFees, originalImplementationFee) {
  let csv = 'Deal Return Calculator Export\n\n';
  csv += 'PROPOSAL DETAILS\n';
  csv += `Customer Name,${data.customerName}\n`;
  csv += `Start Date,${data.startDate}\n`;
  csv += `Customer Plan,${data.customerPlan}\n`;
  csv += `Contract Term,${data.contractTermMonths} months\n`;
  csv += `Payment Frequency,${data.paymentFrequency}\n\n`;
  
  csv += 'UPFRONT PAYMENT\n';
  csv += 'Item,Recommended Price,Discounted Price,Quantity,Discount,Total Cost\n';
  
  const platformDiscount = originalPlatformFees - data.platformFees;
  const implFeeDiscount = originalImplementationFee - data.implementationFee;
  const totalDiscount = platformDiscount + implFeeDiscount;
  
  csv += `Annual ${data.customerPlan} package,${originalPlatformFees},${data.platformFees},,${platformDiscount > 0 ? '$' + platformDiscount.toLocaleString() : '-'},${data.platformFees}\n`;
  csv += `Case Manager Portal (${data.portalSeats} seats),${data.portalPrice},${data.portalPrice},${data.portalSeats},-,${data.portalPrice}\n`;
  csv += `Support Level,${data.supportLevel},${data.supportLevel},,-,${data.supportLevel}\n`;
  csv += `Hosted OneSDK,${data.hostedOneSDK},${data.hostedOneSDK},,-,${data.hostedOneSDK}\n`;
  csv += `Implementation Fee,${originalImplementationFee},${data.implementationFee},,${implFeeDiscount > 0 ? '$' + implFeeDiscount.toLocaleString() : '-'},${data.implementationFee}\n`;
  csv += `Implementation Support,${data.implementationSupport},${data.implementationSupport},,-,${data.implementationSupport}\n`;
  csv += `Minimum Commitment Fee,${data.minimumCommitment},${data.minimumCommitment},1,-,${data.minimumCommitment}\n`;
  
  if (totalDiscount > 0) {
    csv += `\nTotal Discount,,,,,$${totalDiscount.toLocaleString()}\n`;
  }
  
  csv += '\nUPFRONT PAYMENT TOTAL\n';
  csv += `${data.upfrontPayment}\n\n`;
  csv += 'Quote valid for 30 days upon receipt\n';
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Frankieone Quote - ${data.customerName || 'Customer Name'}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
