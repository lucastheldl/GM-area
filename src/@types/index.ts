export interface Game {
  id: number;
  name: string;
  tables?: any;
  createdAt: Date | null;
}

export interface Table {
  id: number;
  name: string;
  gameId: number;
}

export interface Column {
  id: number;
  tableId: number;
  name: string;
  type: string;
  order: number;
}

export interface Row {
  id: number;
  tableId: number;
}

export interface CellValue {
  id: number;
  rowId: number;
  columnId: number;
  value: string | null;
}
