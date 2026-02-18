import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Generate PDF Blob for preview
export const getPDFBlobURL = (leads, filename = 'leads_export') => {
    try {
        if (!leads || leads.length === 0) return null;

        const doc = new jsPDF('l', 'mm', 'a4');
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Lead Management Report', 14, 15);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
        doc.text(`Total Leads: ${leads.length}`, 14, 27);

        const tableData = leads.map(lead => [
            lead.lead_number || 'N/A',
            lead.status || 'N/A',
            lead.customer_details?.[0]?.customer_name || 'N/A',
            lead.site_visits?.[0]?.village_name || 'N/A',
            lead.project_information?.[0]?.estimated_total_door_count || 0,
            lead.assignments?.[0]?.engineer?.full_name || 'Unassigned',
            new Date(lead.created_at).toLocaleDateString(),
            lead.status_reason || '-'
        ]);

        const options = {
            startY: 32,
            head: [['Lead #', 'Status', 'Customer', 'Village', 'Doors', 'Field Survey Person', 'Date', 'Reason']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [99, 102, 241], textColor: 255 },
            margin: { top: 32 }
        };

        if (typeof doc.autoTable === 'function') {
            doc.autoTable(options);
        } else {
            autoTable(doc, options);
        }

        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(30, 41, 59); // slate-800 (Much darker and bold)
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            doc.setFont('helvetica', 'normal');
            doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

            doc.setFont('helvetica', 'bold');
            doc.text('Powered by Durkkas', pageWidth - 14, pageHeight - 10, { align: 'right' });
        }

        return doc.output('bloburl');
    } catch (error) {
        console.error('[ExportService] PDF Preview Error:', error);
        return null;
    }
};

/**
 * Export Service for Lead Data
 * Handles Excel and PDF generation
 */

// Export leads to Excel
export const exportToExcel = (leads, filename = 'leads_export') => {
    try {
        // Prepare data for export
        const exportData = leads.map(lead => ({
            'Lead Number': lead.lead_number,
            'Status': lead.status,
            'Customer Name': lead.customer_details?.[0]?.customer_name || 'N/A',
            'Customer Phone': lead.customer_details?.[0]?.customer_phone || 'N/A',
            'Project Name': lead.project_information?.[0]?.project_name || 'N/A',
            'Village': lead.site_visits?.[0]?.village_name || 'N/A',
            'Building Type': lead.project_information?.[0]?.building_type || 'N/A',
            'Construction Stage': lead.project_information?.[0]?.construction_stage || 'N/A',
            'Total Doors': lead.project_information?.[0]?.estimated_total_door_count || 0,
            'Field Survey Person': lead.assignments?.[0]?.engineer?.full_name || 'Unassigned',
            'Created Date': new Date(lead.created_at).toLocaleDateString(),
            'Latitude': lead.site_visits?.[0]?.latitude || 'N/A',
            'Longitude': lead.site_visits?.[0]?.longitude || 'N/A',
            'Reason': lead.status_reason || 'N/A'
        }));

        // Create workbook
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');

        // Auto-size columns
        const maxWidth = exportData.reduce((w, r) => Math.max(w, Object.keys(r).length), 10);
        worksheet['!cols'] = Array(maxWidth).fill({ wch: 15 });

        // Generate file
        XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);

        return { success: true };
    } catch (error) {
        console.error('[ExportService] Excel Export Error:', error);
        return { success: false, error };
    }
};

// Export leads to PDF
export const exportToPDF = (leads, filename = 'leads_export') => {
    try {
        if (!leads || leads.length === 0) {
            console.warn('[ExportService] No leads to export');
            return { success: false, error: 'No data' };
        }

        const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation

        // Add title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Lead Management Report', 14, 15);

        // Add metadata
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
        doc.text(`Total Leads: ${leads.length}`, 14, 27);

        // Prepare table data with extra safety
        const tableData = leads.map(lead => {
            let dateStr = 'N/A';
            try {
                if (lead.created_at) {
                    dateStr = new Date(lead.created_at).toLocaleDateString();
                }
            } catch (e) {
                console.error('Date parsing error:', e);
            }

            return [
                lead.lead_number || 'N/A',
                lead.status || 'N/A',
                lead.customer_details?.[0]?.customer_name ||
                lead.customer_details?.customer_name || 'N/A', // Handle both array and object
                lead.site_visits?.[0]?.village_name ||
                lead.site_visits?.village_name || 'N/A',
                lead.project_information?.[0]?.estimated_total_door_count ||
                lead.project_information?.estimated_total_door_count || 0,
                lead.assignments?.[0]?.engineer?.full_name ||
                lead.assignments?.engineer?.full_name || 'Unassigned',
                dateStr,
                lead.status_reason || '-'
            ];
        });

        // Use autoTable - note that in some versions it's doc.autoTable, 
        // in others it's imported separately. To be safe, we check both.
        const options = {
            startY: 32,
            head: [['Lead #', 'Status', 'Customer', 'Village', 'Doors', 'Field Survey Person', 'Date', 'Reason']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [99, 102, 241],
                textColor: 255,
                fontStyle: 'bold',
                fontSize: 9
            },
            bodyStyles: {
                fontSize: 8
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250]
            },
            margin: { top: 32 }
        };

        if (typeof doc.autoTable === 'function') {
            doc.autoTable(options);
        } else if (typeof autoTable === 'function') {
            autoTable(doc, options);
        } else {
            console.error('[ExportService] autoTable library not found.');
            throw new Error('PDF Table library not initialized correctly');
        }

        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(30, 41, 59); // slate-800
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            doc.setFont('helvetica', 'normal');
            doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

            doc.setFont('helvetica', 'bold');
            doc.text('Powered by Durkkas', pageWidth - 14, pageHeight - 10, { align: 'right' });
        }

        // Save file
        doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);

        return { success: true };
    } catch (error) {
        console.error('[ExportService] PDF Export Error:', error);
        alert('PDF Download Failed: ' + (error.message || 'Unknown error'));
        return { success: false, error };
    }
};

// Export detailed lead report (single lead)
export const exportLeadDetailPDF = (lead) => {
    try {
        const doc = new jsPDF();

        // Header
        doc.setFillColor(99, 102, 241);
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('Lead Details Report', 14, 20);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(lead.lead_number, 14, 30);

        // Reset text color
        doc.setTextColor(0, 0, 0);
        let yPos = 50;

        // Customer Information
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Customer Information', 14, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Name: ${lead.customer_details?.[0]?.customer_name || 'N/A'}`, 14, yPos);
        yPos += 6;
        doc.text(`Phone: ${lead.customer_details?.[0]?.customer_phone || 'N/A'}`, 14, yPos);
        yPos += 6;
        doc.text(`Email: ${lead.customer_details?.[0]?.customer_email || 'N/A'}`, 14, yPos);
        yPos += 12;

        // Project Information
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Project Information', 14, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Project Name: ${lead.project_information?.[0]?.project_name || 'N/A'}`, 14, yPos);
        yPos += 6;
        doc.text(`Building Type: ${lead.project_information?.[0]?.building_type || 'N/A'}`, 14, yPos);
        yPos += 6;
        doc.text(`Construction Stage: ${lead.project_information?.[0]?.construction_stage || 'N/A'}`, 14, yPos);
        yPos += 6;
        doc.text(`Total Doors: ${lead.project_information?.[0]?.estimated_total_door_count || 0}`, 14, yPos);
        yPos += 12;

        // Location Information
        if (lead.site_visits?.[0]) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Location Information', 14, yPos);
            yPos += 8;

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Village: ${lead.site_visits[0].village_name || 'N/A'}`, 14, yPos);
            yPos += 6;
            doc.text(`Coordinates: ${lead.site_visits[0].latitude || 'N/A'}, ${lead.site_visits[0].longitude || 'N/A'}`, 14, yPos);
            yPos += 12;
        }

        // Door Specifications
        if (lead.door_specifications && lead.door_specifications.length > 0) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Door Specifications', 14, yPos);
            yPos += 8;

            const doorData = lead.door_specifications.map(door => [
                door.door_type,
                door.material_type,
                door.size,
                door.quantity
            ]);

            doc.autoTable({
                startY: yPos,
                head: [['Type', 'Material', 'Size', 'Quantity']],
                body: doorData,
                theme: 'striped',
                headStyles: { fillColor: [99, 102, 241] }
            });
        }

        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(30, 41, 59); // slate-800
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            doc.setFont('helvetica', 'normal');
            doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

            doc.setFont('helvetica', 'bold');
            doc.text('Powered by Durkkas', pageWidth - 14, pageHeight - 10, { align: 'right' });
        }

        // Save
        doc.save(`lead_${lead.lead_number}_${new Date().toISOString().split('T')[0]}.pdf`);

        return { success: true };
    } catch (error) {
        console.error('[ExportService] Detail PDF Error:', error);
        return { success: false, error };
    }
};
