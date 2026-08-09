export const exportCSVData = (orders) => {
  let csv = 'Order Number,Date,Customer,Factory,Box Length,Box Width,Box Height,Unit,Ply,GSM/BF,Quantity,Factory Rate,Margin,Customer Rate,Total Customer Bill,Total Factory Cost,Profit Margin,Margin Payout Status,Customer Payment Status,Settlement Date,Payment Mode,Payment Notes\n';
  
  let totalBill = 0;
  let totalCost = 0;
  let totalMargin = 0;
  let receivedMargin = 0;

  orders.forEach(o => {
    const specs = o.boxSpecs || {};
    const marginStatus = o.marginPaymentStatus || o.factoryPaymentStatus || 'pending';
    const customerStatus = o.customerPaymentStatus || o.paymentStatus || 'pending';
    const notesClean = (o.paymentNotes || '').replace(/"/g, '""');

    const bill = o.totalCustomerBill || 0;
    const cost = o.totalFactoryCost || 0;
    const profit = o.profitMargin || 0;

    totalBill += bill;
    totalCost += cost;
    totalMargin += profit;
    const recAmt = o.receivedMarginAmount !== undefined ? o.receivedMarginAmount : (o.partialMarginAmount !== undefined ? o.partialMarginAmount : (marginStatus === 'received' ? profit : 0));
    receivedMargin += recAmt;

    csv += `"${o.orderNumber}","${o.orderDate}","${o.customerName}","${o.factoryName}",${specs.length || 0},${specs.width || 0},${specs.height || 0},"${specs.unit || ''}","${specs.ply || ''}","${specs.gsmBf || ''}",${o.quantity || 0},${o.factoryUnitCost || 0},${o.marginPerUnit || 0},${o.customerUnitRate || 0},${bill},${cost},${profit},"${marginStatus}","${customerStatus}","${o.paymentDate || ''}","${o.paymentMode || ''}","${notesClean}"\n`;
  });

  const pendingMargin = totalMargin - receivedMargin;

  // Summary Totals Block at the bottom of CSV
  csv += `\n"SUMMARY TOTALS FINANCIAL BREAKDOWN"\n`;
  csv += `"Total Filtered Orders",${orders.length}\n`;
  csv += `"Total Customer Billing",${totalBill}\n`;
  csv += `"Total Factory Cost",${totalCost}\n`;
  csv += `"Total Net Profit Margin",${totalMargin}\n`;
  csv += `"Commission Margin Received",${receivedMargin}\n`;
  csv += `"Remaining Pending Margin Balance",${pendingMargin}\n`;

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `FactoryFlow_Orders_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
};
