// Copy to clipboard utility
export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

// Format date/time
export const formatDateTime = (date: string | Date) => {
  const d = new Date(date);
  return {
    date: d.toLocaleDateString(),
    time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    full: d.toLocaleString(),
    relative: getRelativeTime(d),
  };
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

// Truncate hash
export const truncateHash = (hash: string, startChars: number = 8, endChars: number = 8) => {
  if (!hash || hash.length <= startChars + endChars) return hash;
  return `${hash.substring(0, startChars)}...${hash.substring(hash.length - endChars)}`;
};

// Validate hex string
export const isValidHex = (str: string, expectedLength?: number) => {
  if (!str) return false;
  const hexRegex = /^[0-9a-fA-F]+$/;
  if (expectedLength && str.length !== expectedLength) return false;
  return hexRegex.test(str);
};

// Export transactions to CSV
export const exportToCSV = (transactions: any[]) => {
  if (transactions.length === 0) return;

  const headers = ['Transaction ID', 'Type', 'Timestamp', 'Secret Hash', 'Status'];
  const rows = transactions.map(tx => [
    tx.txId,
    tx.type,
    new Date(tx.timestamp).toLocaleString(),
    tx.secretHash || tx.expectedHash || '',
    tx.success ? 'Success' : 'Failed'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `htlc-transactions-${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
