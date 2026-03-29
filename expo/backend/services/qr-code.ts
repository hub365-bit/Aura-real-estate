export async function generateQRCode(data: string): Promise<string> {
  console.log(`🔲 Generating QR code for: ${data}`);
  
  if (process.env.NODE_ENV === "production") {
    console.warn("⚠️  Implement real QR code generation (qrcode package)");
  }
  
  const encoded = Buffer.from(data).toString("base64");
  return `data:image/png;base64,${encoded}`;
}

export async function verifyQRCode(qrData: string, expectedData: string): Promise<boolean> {
  return qrData === expectedData;
}
