import { Alert, Platform } from 'react-native';
import * as Sharing from 'expo-sharing';

export interface ExportData {
  headers: string[];
  rows: string[][];
}

export async function exportToCSV(data: ExportData, filename: string): Promise<void> {
  try {
    const csvContent = convertToCSV(data);
    
    if (Platform.OS === 'web') {
      downloadCSVWeb(csvContent, filename);
    } else {
      await saveAndShareFile(csvContent, filename, 'text/csv');
    }
  } catch (error) {
    console.error('Error exporting CSV:', error);
    Alert.alert('Export Failed', 'Failed to export CSV file');
  }
}

export async function exportToPDF(htmlContent: string, filename: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      printHTMLWeb(htmlContent, filename);
    } else {
      await saveAndShareFile(htmlContent, filename, 'text/html');
    }
  } catch (error) {
    console.error('Error exporting PDF:', error);
    Alert.alert('Export Failed', 'Failed to export PDF file');
  }
}

function convertToCSV(data: ExportData): string {
  const { headers, rows } = data;
  
  const csvRows = [
    headers.map((h) => `"${h}"`).join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ];
  
  return csvRows.join('\n');
}

function downloadCSVWeb(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  Alert.alert('Success', 'File downloaded successfully');
}

function printHTMLWeb(htmlContent: string, filename: string): void {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
}

async function saveAndShareFile(
  content: string,
  filename: string,
  mimeType: string
): Promise<void> {
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    if (Platform.OS === 'web') {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    Alert.alert('Success', 'File saved successfully');
  } else {
    Alert.alert('Error', 'Sharing is not available on this device');
  }
}

export function generateStatementHTML(data: {
  title: string;
  period: string;
  items: { label: string; value: string }[];
  table?: {
    headers: string[];
    rows: string[][];
  };
}): string {
  const { title, period, items, table } = data;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
          color: #0F172A;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 2px solid #0891B2;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #0891B2;
          margin: 0 0 10px 0;
        }
        .header p {
          color: #64748B;
          margin: 0;
        }
        .info-section {
          margin: 30px 0;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #E2E8F0;
        }
        .info-label {
          font-weight: 600;
          color: #475569;
        }
        .info-value {
          color: #0F172A;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 30px 0;
        }
        th {
          background-color: #0891B2;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: 600;
        }
        td {
          padding: 12px;
          border-bottom: 1px solid #E2E8F0;
        }
        tr:hover {
          background-color: #F8FAFC;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          color: #94A3B8;
          font-size: 12px;
          border-top: 1px solid #E2E8F0;
          padding-top: 20px;
        }
        @media print {
          body {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <p>${period}</p>
      </div>
      
      <div class="info-section">
        ${items.map(item => `
          <div class="info-row">
            <span class="info-label">${item.label}</span>
            <span class="info-value">${item.value}</span>
          </div>
        `).join('')}
      </div>
      
      ${table ? `
        <table>
          <thead>
            <tr>
              ${table.headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${table.rows.map(row => `
              <tr>
                ${row.map(cell => `<td>${cell}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}
      
      <div class="footer">
        <p>Generated by Aura on ${new Date().toLocaleDateString()}</p>
        <p>This is a computer-generated document.</p>
      </div>
    </body>
    </html>
  `;
}
