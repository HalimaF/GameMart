export const formatPKR = (amount) => {
  const n = Number(amount || 0);
  try {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(n);
  } catch {
    return `PKR ${Math.round(n).toLocaleString('en-PK')}`;
  }
};
