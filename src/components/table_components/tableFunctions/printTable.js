import { firePopup } from "../../alert_components/Alert/CustomAlert";

function generatePrintableTable(dataRows, columnHeaders) {
    const table = document.createElement('table');
    table.classList.add('printable-table'); // Add a class for styling (optional)
    table.classList.add('centered-table');
    
    // Create table header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    let columnNames = [];

    columnHeaders.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header.label;
      columnNames.push(header.name.toLowerCase());
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
  
    // Create table body rows
    const tbody = document.createElement('tbody');
    let dataRowsArray = Object.keys(dataRows);

    for(let i =0;i < dataRowsArray.length;i++){
        let row = dataRowsArray[i];
        let dataObject = dataRows[row];

        const bodyRow = document.createElement('tr');
        let dataObjectKeysArray = Object.keys(dataObject);

        for(let x =0;x < dataObjectKeysArray.length;x++){
            let columnName = dataObjectKeysArray[x];
            let data = dataObject[columnName];

            console.log(columnNames,columnName)
            if(!columnNames.includes(columnName.toLowerCase())) continue;

            const td = document.createElement('td');
            
            td.textContent = data;
            bodyRow.appendChild(td);
        }
        
        tbody.appendChild(bodyRow);

    }

    table.appendChild(tbody);
  
    return table;
}

export const printTable = (e,dataRows,columnHeaders,tableTitle) => {


    // firePopup({html : "hola",title : "hola",icon : "success",footer: '<a href="#">Why do I have this issue?</a>',draggable:true});
    const printableTable = generatePrintableTable(dataRows, columnHeaders);

    // Optional: Add the table to the DOM for visual confirmation (comment out for printing directly)
    document.body.appendChild(printableTable);

    console.log(printableTable);
    // Print the table content
    window.print();

    // Optional: Remove the table from the DOM if added earlier
    document.body.removeChild(printableTable);

  };