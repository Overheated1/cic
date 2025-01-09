import * as XLSX from 'xlsx';

export const exportTableToExcel = (e, dataRows, columnHeaders, tableTitle) => {
    const wb = XLSX.utils.book_new(); 

    const headers = columnHeaders.map(header => header.label);
    const keys = columnHeaders.map(header => header.name); 

    const ws_data = [
        headers, // Encabezados
        ...Object.keys(dataRows).map(key => {
            return keys.map(headerKey => dataRows[key][headerKey]);
        })
    ];

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, tableTitle);

    const wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});

    const blob = new Blob([wbout], {type: 'application/octet-stream'});
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `${tableTitle}.xlsx`; 
    document.body.appendChild(downloadLink);
    downloadLink.click(); 
    document.body.removeChild(downloadLink); 
};
