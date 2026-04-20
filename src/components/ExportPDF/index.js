import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportAnalyticsToPDF = (data, filterTitle) => {
  const doc = new jsPDF();
  const now = new Date();
  const downloadTime = now
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();
  const downloadDate = now.toLocaleDateString();

  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.text("Business Analytics Report", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Filter: ${filterTitle.toUpperCase()}`, 14, 28);
  doc.text(`Generated on: ${downloadDate} at ${downloadTime}`, 14, 33);

  autoTable(doc, {
    startY: 40,
    head: [["Total Sales", "Net Profit", "Total Discount", "Loss (Damaged)"]],
    body: [
      [
        `Rs. ${data.stats.totalSales || 0}`,
        `Rs. ${data.stats.totalProfit || 0}`,
        `Rs. ${data.stats.totalDiscount || 0}`,
        `Rs. ${data.stats.loss || 0}`,
      ],
    ],
    theme: "striped",
    headStyles: { fillColor: [44, 62, 80] },
  });

  const tableRows = data.recentSales.map((sale) => [
    sale.date,
    sale.productNames,
    `${sale.totalQty} pcs`,
    sale.totalDiscount,
    sale.totalAmount,
    sale.totalProfit,
  ]);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Date", "Products", "Qty", "Discount", "Total Sold", "Profit"]],
    body: tableRows,
    theme: "grid",
    headStyles: { fillColor: [52, 152, 219], halign: "center" },
    styles: { fontSize: 8, halign: "center" },
    columnStyles: {
      1: { halign: "left", cellWidth: 50 },
    },
  });

  doc.save(
    `Analytics_Report_${filterTitle}_${downloadDate.replace(/\//g, "-")}.pdf`,
  );
};
