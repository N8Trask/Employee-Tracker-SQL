function formatRowsToTable(rows) {
    if (rows.length === 0) {
        return;
    }

    const columns = Object.keys(rows[0]);
    const maxLengths = {};

    for (const column of columns) {
        maxLengths[column] = Math.max(column.length, ...rows.map((row) => String(row[column]).length));
    }

    let table = "";
    table += columns.map((column) => column.padEnd(maxLengths[column])).join(" | ") + "\n";
    table += "-".repeat(Object.values(maxLengths).reduce((sum, length) => sum + length + 3, 0)) + "\n";

    // Create the table rows
    for (const row of rows) {
        table += columns.map((column) => String(row[column]).padEnd(maxLengths[column])).join(" | ") + "\n";
    }

    return table;
}


module.exports = formatRowsToTable;