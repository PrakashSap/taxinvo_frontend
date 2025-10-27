import React from 'react';
import { Printer } from 'lucide-react';
import Button from './Button';

const SimplePrintInvoice = ({
                                invoiceData,
                                type = 'sale',
                                buttonText = 'Print Invoice',
                                className = '',
                                variant = 'outline'
                            }) => {
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString('en-IN');
        };

        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 2,
            }).format(amount || 0);
        };

        const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tax Invoice - ${invoiceData.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
          .invoice-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .business-info { margin-bottom: 10px; }
          .customer-section { margin-bottom: 20px; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .items-table th { background-color: #f5f5f5; }
          .totals { margin-top: 20px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="display: flex; justify-content: space-between;">
            <div>
              <div class="invoice-title">TAX INVOICE</div>
              <div class="business-info">
                <strong>Sri Dhanalakshmi Trader</strong><br>
                #216, Opp: KEB, Triveninagar<br>
                Mysore-T.Narasipura Main Road, T.Narasipura - 571124<br>
                GSTIN: 29AAJFD2218GIZK
              </div>
            </div>
            <div style="text-align: right;">
              <strong>Invoice: ${invoiceData.invoiceNumber}</strong><br>
              Date: ${formatDate(invoiceData.invoiceDate)}
            </div>
          </div>
        </div>

        <div class="customer-section">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
            <div>
              <strong>Bill To:</strong><br>
              ${invoiceData.customer?.name || invoiceData.customerName || 'Retail Customer'}<br>
              ${invoiceData.customer?.address || ''}<br>
              ${invoiceData.customer?.gstin ? 'GSTIN: ' + invoiceData.customer.gstin : ''}
            </div>
            <div>
              <strong>Payment Details:</strong><br>
              Method: ${invoiceData.paymentMethod?.toUpperCase()}<br>
              Status: ${invoiceData.paymentStatus?.toUpperCase()}
            </div>
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>HSN</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>GST %</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceData.items?.map(item => `
              <tr>
                <td>${item.product?.name}</td>
                <td>${item.product?.hsnCode || '-'}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.rate)}</td>
                <td>${item.cgstRate}%</td>
                <td>${formatCurrency(item.totalAmount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
          <div>
            <em>Above said items are only for agricultural purpose</em><br>
            <em>Goods once sold cannot be taken back or exchanged</em>
          </div>
          <div class="totals">
            <div style="display: flex; justify-content: space-between;">
              <strong>Subtotal:</strong>
              <span>${formatCurrency(invoiceData.totalAmount)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>CGST:</span>
              <span>${formatCurrency(invoiceData.totalCgst)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>SGST:</span>
              <span>${formatCurrency(invoiceData.totalSgst)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Round Off:</span>
              <span>${formatCurrency(invoiceData.roundOff)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 1px solid #ddd; padding-top: 5px;">
              <strong>Grand Total:</strong>
              <strong>${formatCurrency(invoiceData.grandTotal)}</strong>
            </div>
          </div>
        </div>

        <div class="footer">
          <div style="display: flex; justify-content: space-between;">
            <div style="text-align: center;">
              <strong>Customer Signature</strong><br><br><br>
              Date: ________________
            </div>
            <div style="text-align: center;">
              <strong>Authorized Signature</strong><br><br><br>
              For Sri Dhanalakshmi Trader
            </div>
          </div>
        </div>

        <div class="no-print" style="margin-top: 20px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Print Invoice
          </button>
          <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
            Close
          </button>
        </div>
      </body>
      </html>
    `;

        printWindow.document.write(invoiceHTML);
        printWindow.document.close();

        // Auto-print after a short delay
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

    if (!invoiceData) {
        return null;
    }

    return (
        <Button
            variant={variant}
            onClick={handlePrint}
            className={`flex items-center gap-2 ${className}`}
        >
            <Printer className="h-4 w-4" />
            {buttonText}
        </Button>
    );
};

export default SimplePrintInvoice;