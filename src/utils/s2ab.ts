export function s2ab (s: string) {
    const buf = new ArrayBuffer(s.length);      // Create buffer of same length
    const view = new Uint8Array(buf);           // Create typed array view
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xFF;         // Get byte value for each character
    }
    return buf;                                 // Return ArrayBuffer
  };
