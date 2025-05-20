export function formatDate(toFormat: string) {
      const date = new Date(toFormat);
      
      if (isNaN(date.getTime())) {
        return toFormat
      }
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const year = date.getFullYear();
      
      return `${month}/${day}/${year}`;
  }