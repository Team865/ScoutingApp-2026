export default class Table {
    public readonly domElement = document.createElement("div");

    private numColumns = 1;
    private numRows = 1;

    // Can be indexed via cells[rowIndex][columnIndex]
    public cells: HTMLDivElement[][] = [[document.createElement("div")]];

    constructor(leftmostColumnName: string) {
        this.cells[0][0].innerText = leftmostColumnName;
        this.domElement.appendChild(this.cells[0][0]);
    }

    public addRow() {
        this.numRows++;

        const row = [];

        for(let columnIndex = 0; columnIndex < this.numColumns; columnIndex++) {
            const cell = document.createElement("div");

            cell.style.gridRow = (this.numRows).toString();
            cell.style.gridColumn = (columnIndex + 1).toString();

            this.domElement.appendChild(cell);

            row.push(cell);
        }

        this.cells.push(row);
    }

    public addColumn() {
        this.numColumns++;

        for(let rowIndex = 0; rowIndex < this.numRows; rowIndex++) {
            const row = this.cells[rowIndex];
            const cell = document.createElement("div");

            cell.style.gridRow = (rowIndex + 1).toString();
            cell.style.gridColumn = (this.numColumns).toString();

            this.domElement.appendChild(cell);

            row.push(cell);
        }
    }

    public removeRow(rowIndex: number) {
        const row = this.cells[rowIndex];

        for(const cell of row) {
            cell.remove();
        }

        for(let i = rowIndex + 1; i < this.numRows; i++) {
            for(const cell of this.cells[i]) {
                cell.style.gridRow = rowIndex.toString();
            }
        }

        this.cells.splice(rowIndex, 1);
        this.numRows--;
    }

    public removeColumn(columnIndex: number) {
        for(let rowIndex = 0; rowIndex < this.numRows; rowIndex++) {
            const row = this.cells[rowIndex];
            row[columnIndex].remove();

            for(let i = columnIndex; i < this.numRows; i++) {
                row[i].style.gridColumn = columnIndex.toString();
            }

            row.splice(columnIndex, 1);
        }

        this.numColumns--;
    }

    public getCell(rowIndex: number, columnIndex: number): HTMLDivElement {
        return this.cells[rowIndex][columnIndex];
    }

    public getRow(rowIndex: number) {
        return this.cells[rowIndex];
    }

    public get columns(): number {
        return this.numColumns;
    }

    public get rows(): number {
        return this.numRows;
    }
}