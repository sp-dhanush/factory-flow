export const generateBoxDescription = ({ productName, length, width, height, unit, ply, gsmBf }) => {
  const parts = [];
  if (productName && productName.trim()) parts.push(productName.trim());
  if (length && width && height) parts.push(`${length} × ${width} × ${height} ${unit || 'mm'}`);
  if (ply) parts.push(ply);
  if (gsmBf && gsmBf.trim()) parts.push(gsmBf.trim());
  return parts.join(' — ');
};

export const formatINR = (amount) => {
  const val = parseFloat(amount) || 0;
  return '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 2 });
};
