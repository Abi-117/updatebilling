// utils/dateRange.js
export const getStartDateByRange = (range) => {
  const now = new Date();

  switch (range) {
    case '3M':
      return new Date(now.setMonth(now.getMonth() - 3));
    case '6M':
      return new Date(now.setMonth(now.getMonth() - 6));
    case '10M':
      return new Date(now.setMonth(now.getMonth() - 10));
    case 'YTD':
    default:
      return new Date(new Date().getFullYear(), 0, 1);
  }
};
