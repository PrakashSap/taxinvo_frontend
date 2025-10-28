import React from 'react';
import { Printer } from 'lucide-react';
import Button from './Button';

const SimplePrintInvoice = ({
                                invoiceData,
                                type = 'sale',
                                buttonText = 'Print Invoice',
                                className = '',
                                variant = 'outline',
                                onPrintStart
                            }) => {
    const handlePrint = (event) => {
        // Stop propagation if event exists (when called from action menu)
        event?.stopPropagation();

        // Call the onPrintStart callback if provided
        if (onPrintStart) {
            onPrintStart();
        }

        // Create a new window for printing
        const printWindow = window.open('', '_blank', 'width=800,height=600');

        if (!printWindow) {
            alert('Please allow popups for this site to print invoices.');
            return;
        }

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

        // Generate the invoice HTML
        const invoiceHTML = generateInvoiceHTML(invoiceData, formatDate, formatCurrency);

        printWindow.document.write(invoiceHTML);
        printWindow.document.close();

        // Focus the new window
        printWindow.focus();
    };

    const generateInvoiceHTML = (invoiceData, formatDate, formatCurrency) => {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Tax Invoice - ${invoiceData.invoiceNumber}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px;
            font-size: 14px;
            line-height: 1.4;
            color: #333;
            background: white;
        }
        .print-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header { 
            border-bottom: 2px solid #000; 
            padding-bottom: 20px; 
            margin-bottom: 20px; 
            text-align: center;
        }
        .invoice-title { 
            font-size: 24px; 
            font-weight: bold; 
            margin-bottom: 10px;
        }
        .business-info { margin-bottom: 10px; line-height: 1.6; }
        .invoice-meta { margin-top: 15px; font-weight: bold; }
        .customer-section { 
            margin-bottom: 20px; 
            padding: 15px;
            background: #f9f9f9;
            border-radius: 5px;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }
        .items-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 20px;
            font-size: 12px;
        }
        .items-table th, .items-table td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
        }
        .items-table th { 
            background-color: #f5f5f5; 
            font-weight: bold;
        }
        .totals { 
            margin-top: 20px; 
            padding: 15px;
            background: #f9f9f9;
            border-radius: 5px;
        }
        .footer { 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid #ddd; 
        }
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        .flex-between {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        .text-center { text-align: center; }
        .bold { font-weight: bold; }
        .mt-10 { margin-top: 10px; }
        .pt-5 { padding-top: 5px; }
        .border-top { border-top: 1px solid #ddd; }
        .total-row {
            border-top: 2px solid #333;
            padding-top: 10px;
            font-weight: bold;
            font-size: 16px;
        }
        .action-buttons {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .print-btn, .close-btn {
            padding: 12px 24px;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            margin: 0 10px;
            transition: background 0.3s;
        }
        .print-btn { background: #007bff; }
        .print-btn:hover { background: #0056b3; }
        .close-btn { background: #6c757d; }
        .close-btn:hover { background: #545b62; }
        
        @media print {
            .action-buttons { display: none; }
            body { margin: 10px; }
            .print-container { padding: 0; }
        }
        
        @media (max-width: 768px) {
            body { margin: 10px; }
            .grid-2 { grid-template-columns: 1fr; gap: 15px; }
            .items-table { font-size: 10px; }
            .items-table th, .items-table td { padding: 6px 4px; }
        }
    </style>
</head>
<body>
    <div class="print-container">
        <div class="header">
            <div class="invoice-title">TAX INVOICE</div>
            <div class="business-info">
                <strong>Sri Dhanalakshmi Trader</strong><br>
                #216, Opp: KEB, Triveninagar<br>
                Mysore-T.Narasipura Main Road, T.Narasipura - 571124<br>
                GSTIN: 29AAJFD2218GIZK
            </div>
            <div class="invoice-meta">
                <strong>Invoice: ${invoiceData.invoiceNumber}</strong> | 
                Date: ${formatDate(invoiceData.invoiceDate)}
            </div>
        </div>

        <div class="customer-section">
            <div class="grid-2">
                <div>
                    <div class="section-title">Bill To:</div>
                    ${invoiceData.supplierName || invoiceData.customer?.name || invoiceData.customerName || 'Retail Customer'}<br>
                    ${invoiceData.supplierGstin || invoiceData.customer?.address || ''}<br>
                    ${invoiceData.supplierGstin ? 'GSTIN: ' + invoiceData.supplierGstin : invoiceData.customer?.gstin ? 'GSTIN: ' + invoiceData.customer.gstin : ''}
                </div>
                <div>
                    <div class="section-title">Payment Details:</div>
                    Method: ${(invoiceData.paymentMethod || 'CASH')?.toUpperCase()}<br>
                    Status: ${(invoiceData.paymentStatus || 'PAID')?.toUpperCase()}
                </div>
            </div>
        </div>

        <div class="section-title">Items Details</div>
        <table class="items-table">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>HSN Code</th>
                    <th>Quantity</th>
                    <th>Rate (₹)</th>
                    <th>GST %</th>
                    <th>Amount (₹)</th>
                </tr>
            </thead>
            <tbody>
                ${invoiceData.items?.map(item => `
                    <tr>
                        <td>${item.product?.name || item.productName || 'N/A'}</td>
                        <td>${item.product?.hsnCode || item.hsnCode || '-'}</td>
                        <td>${item.quantity}</td>
                        <td>${formatCurrency(item.rate)}</td>
                        <td>${item.gstRate || item.cgstRate || 0}%</td>
                        <td>${formatCurrency(item.rate * item.quantity)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="grid-2">
            <div>
                <div style="font-style: italic; color: #666; font-size: 12px;">
                    <div>• Above said items are only for agricultural purpose</div>
                    <div class="mt-10">• Goods once sold cannot be taken back or exchanged</div>
                    <div class="mt-10">• Subject to T.Narasipura Jurisdiction</div>
                </div>
            </div>
            <div class="totals">
                <div class="section-title">Invoice Summary</div>
                <div class="flex-between">
                    <span>Subtotal:</span>
                    <span>${formatCurrency(invoiceData.totalAmount || invoiceData.grandTotal)}</span>
                </div>
                <div class="flex-between">
                    <span>CGST:</span>
                    <span>${formatCurrency(invoiceData.totalCgst || 0)}</span>
                </div>
                <div class="flex-between">
                    <span>SGST:</span>
                    <span>${formatCurrency(invoiceData.totalSgst || 0)}</span>
                </div>
                <div class="flex-between">
                    <span>Round Off:</span>
                    <span>${formatCurrency(invoiceData.roundOff || 0)}</span>
                </div>
                <div class="flex-between total-row">
                    <strong>Grand Total:</strong>
                    <strong>${formatCurrency(invoiceData.grandTotal)}</strong>
                </div>
            </div>
        </div>

        <div class="footer">
            <div class="grid-2">
                <div class="text-center">
                    <strong>Customer Signature</strong><br><br><br>
                    <div style="margin-top: 60px;">Date: ________________</div>
                </div>
                <div class="text-center">
                    <strong>Authorized Signature</strong><br><br><br>
                    <div style="margin-top: 60px;">For Sri Dhanalakshmi Trader</div>
                </div>
            </div>
        </div>

        <!-- Action Buttons - Hidden during actual printing -->
        <div class="action-buttons">
            <button class="print-btn" onclick="window.print()">
                🖨️ Print Invoice
            </button>
            <button class="close-btn" onclick="window.close()">
                ❌ Close Window
            </button>
            <p style="margin-top: 15px; color: #666; font-size: 14px;">
                Click "Print Invoice" to print or save as PDF
            </p>
        </div>
    </div>

    <script>
        // Focus on the window for better UX
        window.focus();
        
        // Optional: Add keyboard shortcut for printing (Ctrl+P)
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                window.print();
            }
        });
    </script>
</body>
</html>`;
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