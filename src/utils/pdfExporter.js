import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportPDFStatement = ({ factory, monthStr, orders, transactions }) => {
  const doc = new jsPDF();
  const factoryName = factory ? factory.name : 'Factory Statement';
  const factoryAddress = factory ? (factory.address || '') : '';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('MONTHLY FACTORY STATEMENT', 14, 20);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(factoryName, 14, 28);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(factoryAddress, 14, 34);

  doc.text(`Statement Period: ${monthStr}`, 140, 28);
  doc.text(`Date Generated: ${new Date().toLocaleDateString('en-IN')}`, 140, 34);

  const monthOrders = orders.filter(o => o.factoryId === (factory ? factory.id : '') && o.orderDate.startsWith(monthStr));
  let totalCost = 0;

  const tableData = monthOrders.map(o => {
    totalCost += (o.totalFactoryCost || 0);
    const specStr = `${o.boxSpecs.length}x${o.boxSpecs.width}x${o.boxSpecs.height} ${o.boxSpecs.ply}`;
    return [
      o.orderDate,
      o.orderNumber,
      o.customerName,
      specStr,
      o.quantity.toString(),
      `Rs. ${o.factoryUnitCost.toFixed(2)}`,
      `Rs. ${o.totalFactoryCost.toLocaleString('en-IN')}`
    ];
  });

  doc.autoTable({
    startY: 42,
    head: [['Date', 'Order #', 'Customer', 'Specs', 'Qty', 'Unit Rate', 'Total Cost']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255] }
  });

  let finalY = (doc).lastAutoTable ? (doc).lastAutoTable.finalY + 15 : 120;
  let totalPaid = 0;
  transactions
    .filter(t => t.type === 'factory_payout' && t.entityId === (factory ? factory.id : '') && t.date.startsWith(monthStr))
    .forEach(t => totalPaid += (t.amount || 0));

  const netBalance = totalCost - totalPaid;

  doc.setFontSize(11);
  doc.text(`Total Factory Supply Cost: Rs. ${totalCost.toLocaleString('en-IN')}`, 120, finalY);
  doc.text(`Total Payments Settled: Rs. ${totalPaid.toLocaleString('en-IN')}`, 120, finalY + 6);
  doc.setFont('helvetica', 'bold');
  doc.text(`Net Payable Balance: Rs. ${netBalance.toLocaleString('en-IN')}`, 120, finalY + 14);

  doc.save(`${factoryName.replace(/\s+/g, '_')}_${monthStr}_Statement.pdf`);
};

export const exportOrdersPDF = (orders, monthStr = '') => {
  const doc = new jsPDF({ orientation: 'landscape' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('FACTORY FLOW - ORDERS & COMMISSION MARGIN REPORT', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')} ${monthStr ? '| Filter Month: ' + monthStr : '| All Months'}`, 14, 25);

  let totalBill = 0;
  let totalCost = 0;
  let totalMargin = 0;
  let receivedMargin = 0;

  const tableData = orders.map(o => {
    totalBill += (o.totalCustomerBill || 0);
    totalCost += (o.totalFactoryCost || 0);
    const profit = (o.profitMargin || 0);
    totalMargin += profit;

    const rawStatus = o.marginPaymentStatus || o.factoryPaymentStatus || 'pending';
    const recAmt = o.receivedMarginAmount !== undefined ? o.receivedMarginAmount : (o.partialMarginAmount !== undefined ? o.partialMarginAmount : (rawStatus === 'received' ? profit : 0));
    receivedMargin += recAmt;

    const specStr = o.boxSpecs ? (o.boxSpecs.description || `${o.boxSpecs.length}x${o.boxSpecs.width}x${o.boxSpecs.height} ${o.boxSpecs.unit || ''}, ${o.boxSpecs.ply || ''}`) : '';
    const marginStatus = rawStatus === 'partial' 
      ? `PARTIAL (Rs.${recAmt.toLocaleString('en-IN')})` 
      : rawStatus.toUpperCase();
    const payDetails = `${o.paymentMode || ''} ${o.paymentDate ? '(' + o.paymentDate + ')' : ''}`;

    return [
      o.orderNumber,
      o.orderDate,
      o.customerName,
      o.factoryName,
      specStr,
      o.quantity ? o.quantity.toLocaleString('en-IN') : '0',
      `Rs. ${(o.totalCustomerBill || 0).toLocaleString('en-IN')}`,
      `Rs. ${profit.toLocaleString('en-IN')}`,
      marginStatus,
      payDetails,
      o.paymentNotes || '-'
    ];
  });

  const pendingMargin = totalMargin - receivedMargin;

  doc.autoTable({
    startY: 30,
    head: [['Order #', 'Date', 'Customer', 'Factory', 'Specs', 'Qty', 'Total Bill', 'Net Margin', 'Margin Status', 'Pay Method / Date', 'Comments & Notes']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontSize: 8 },
    bodyStyles: { fontSize: 7.5 }
  });

  let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 120;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);

  // Line 1: Basic Order & Bill Totals
  doc.text(`Total Orders: ${orders.length}`, 14, finalY);
  doc.text(`Total Customer Bill: Rs. ${totalBill.toLocaleString('en-IN')}`, 80, finalY);
  doc.text(`Total Factory Supply Cost: Rs. ${totalCost.toLocaleString('en-IN')}`, 175, finalY);

  // Line 2: Net Margin Financial Breakdown & Remaining Balance
  doc.text(`Total Net Profit Margin: Rs. ${totalMargin.toLocaleString('en-IN')}`, 14, finalY + 6);
  
  doc.setTextColor(5, 150, 105); // Green for Received
  doc.text(`Received Margin: Rs. ${receivedMargin.toLocaleString('en-IN')}`, 110, finalY + 6);

  doc.setTextColor(220, 38, 38); // Red for Remaining Pending Balance
  doc.text(`Remaining Pending Balance: Rs. ${pendingMargin.toLocaleString('en-IN')}`, 190, finalY + 6);

  const filename = monthStr ? `Orders_Report_${monthStr}.pdf` : `Orders_Report_All.pdf`;
  doc.save(filename);
};
