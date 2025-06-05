"use client";
import type React from "react";
import { useState, useEffect } from "react";
import {
  Plus,
  Layers,
  PlusCircle,
  Dice5Icon,
  ChevronLeft,
  Link2,
  Loader2,
  File,
} from "lucide-react";
import type { CellValue, Column, Game, Row, Table } from "@/@types";
import { COLUMN_TYPES } from "@/consts";
import { CreateTableForm } from "../[id]/table-form";
import {
  createCells,
  createColumn,
  createRow,
  createTable,
  deleteColumn,
  deleteRows,
  editCells,
  getTable,
} from "@/actions/tables";
import Link from "next/link";
import { RandomThrowModal } from "./throwModal";

// Sidebar component for listing tables
const TablesSidebar: React.FC<{
  tables: Table[];
  activeTableId: number | null;
  onTableSelect: (tableId: number) => void;
  onCreateTable: () => void;
  gameId: number;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}> = ({
  tables,
  activeTableId,
  onTableSelect,
  onCreateTable,
  setSearch,
  gameId,
}) => {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-700 h-full flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <Link
          href={"/"}
          className="flex gap-2 items-center text-sm text-slate-400 hover:text-slate-200"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Link>
        <h2 className="text-lg font-bold text-white">Game #{gameId}</h2>
      </div>
      <div className="py-4 px-4">
        <input
          placeholder="Search table..."
          className="border border-slate-400 rounded-md px-2 py-1"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex-grow overflow-y-auto">
        <ul className="py-2">
          {tables.length > 0 &&
            tables.map((table) => (
              <li key={table.id}>
                <button
                  type="button"
                  onClick={() => onTableSelect(table.id)}
                  className={`w-full text-left px-4 py-2 flex items-center ${
                    activeTableId === table.id
                      ? "bg-indigo-600 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Layers className="h-4 w-4 mr-2" />
                  <span className="truncate">{table.name}</span>
                </button>
              </li>
            ))}
        </ul>
      </div>
      <div className="p-3 border-t border-slate-700">
        <button
          type="button"
          onClick={onCreateTable}
          className="w-full py-2 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 rounded text-white font-medium transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span>Create Table</span>
        </button>
      </div>
    </div>
  );
};

// Table view component
const TableView: React.FC<{
  table: Table;
  columns: Column[];
  rows: Row[];
  cellValues: CellValue[];
  onAddRow: (tableId: number) => void;
  onRandomThrow: () => void;
  handleDeleteColumn: (id: number) => void;
  onUpdateCellValue: (
    cellValueId: number | null,
    rowId: number,
    columnId: number,
    value: string
  ) => void;
  onAddColumn: (tableId: number, name: string, type: string) => void;
  isLoading: boolean;
}> = ({
  table,
  columns,
  rows,
  cellValues,
  onAddRow,
  onUpdateCellValue,
  onAddColumn,
  onRandomThrow,
  handleDeleteColumn,
  isLoading,
}) => {
  // Sort columns by order
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);
  const [isAddingColumnForm, setIsAddingColumnForm] = useState<boolean>(false);
  const [newColumnName, setNewColumnName] = useState<string>("");
  const [newColumnType, setNewColumnType] = useState<string>("text");
  const [editingCell, setEditingCell] = useState<{
    rowId: number;
    columnId: number;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  // Get cell value by row and column
  const getCellValue = (
    rowId: number,
    columnId: number
  ): { id: number | null; value: string } => {
    const cell = cellValues.find(
      (cv) => cv.rowId === rowId && cv.columnId === columnId
    );
    return { id: cell?.id || null, value: cell?.value || "" };
  };

  const handleCellClick = (rowId: number, columnId: number) => {
    if (isLoading) return; // Prevent editing if any operation is in progress
    
    const cellData = getCellValue(rowId, columnId);
    setEditingCell({ rowId, columnId });
    setEditValue(cellData.value || "");
  };

  const handleCellBlur = () => {
    if (editingCell) {
      const cellData = getCellValue(editingCell.rowId, editingCell.columnId);
      onUpdateCellValue(
        cellData.id,
        editingCell.rowId,
        editingCell.columnId,
        editValue
      );
      setEditingCell(null);
    }
  };

  async function handleAddColumn() {
    if (newColumnName.trim()) {
      onAddColumn(table.id, newColumnName, newColumnType);
      setIsAddingColumnForm(false);
      setNewColumnName("");
      setNewColumnType("text");
    }
  }
  async function handleGoToCellPage(id: number) {}

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCellBlur();
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{table.name}</h2>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => onAddRow(table.id)}
            disabled={isLoading}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded text-white flex items-center transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <PlusCircle className="h-4 w-4 mr-1" />
            )}
            {isLoading ? "Loading..." : "Add Row"}
          </button>
          <button
            type="button"
            onClick={() => setIsAddingColumnForm(true)}
            disabled={isLoading}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600 disabled:cursor-not-allowed rounded text-white flex items-center transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Column
          </button>
          <button
            type="button"
            onClick={onRandomThrow}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-white flex items-center"
          >
            <Dice5Icon className="h-4 w-4 mr-1" />
            Random Throw
          </button>
          
          
        </div>
      </div>

      {isAddingColumnForm && (
        <div className="mb-4 p-4 bg-slate-800 rounded-md border border-slate-700 flex items-end space-x-3">
          <div className="flex-grow">
            <label
              htmlFor=""
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Column Name
            </label>
            <input
              type="text"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              disabled={isLoading}
              className="w-full py-2 px-3 rounded-md bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter column name"
            />
          </div>
          <div className="w-40">
            <label
              htmlFor=""
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Type
            </label>
            <select
              value={newColumnType}
              onChange={(e) => setNewColumnType(e.target.value)}
              disabled={isLoading}
              className="w-full py-2 px-3 rounded-md bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {COLUMN_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setIsAddingColumnForm(false)}
              disabled={isLoading}
              className="px-3 py-2 bg-transparent hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-slate-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddColumn}
              disabled={isLoading || !newColumnName.trim()}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded text-white flex items-center"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              {isLoading ? "Loading..." : "Add"}
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto border border-slate-700 rounded-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-800">
              {sortedColumns.map((column) => (
                <th
                  key={column.id}
                  className="relative group px-4 py-3 text-left text-sm font-medium text-slate-300 border-b border-slate-700"
                >
                  <button
                    className="hidden absolute top-1/2 p-1 px-2 -translate-y-1/2 right-2 group-hover:block hover:text-red-600 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleDeleteColumn(column.id)}
                    disabled={isLoading}
                  >
                    X
                  </button>
                  {column.name ?? "Column"}
                  <span className="ml-2 text-xs text-slate-500">
                    {column.type}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={sortedColumns.length}
                  className="text-center py-8 text-slate-500"
                >
                  No data available. Add a row to start.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-800 hover:bg-slate-800/50"
                >
                  {sortedColumns.map((column) => {
                    const cellData = getCellValue(row.id, column.id);
                    const isEditing =
                      editingCell?.rowId === row.id &&
                      editingCell?.columnId === column.id;

                    return (
                      // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                      <td
                        key={column.id}
                        className="group relative px-4 py-3 text-sm text-slate-300 border-r border-slate-800 last:border-r-0"
                      >
                        <div className="flex justify-between items-center w-full h-full">
                          <div
                            className={`w-full h-full ${
                              isLoading && !isEditing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={() => handleCellClick(row.id, column.id)}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleCellBlur}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading && !isEditing}
                                className="w-full py-1 px-2 rounded bg-slate-700 border border-indigo-500 text-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                            ) : (
                              <div className={`min-h-6 cursor-pointer hover:bg-slate-700/50 px-1 py-0.5 rounded flex-1 ${
                                isLoading ? 'cursor-not-allowed hover:bg-transparent' : ''
                              }`}>
                                {cellData.value || (
                                  <span className="text-slate-600 italic">
                                    Click to edit
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          {cellData.value && (
                            <button
                              className="opacity-0 group-hover:opacity-100 hover:text-indigo-500 hover:cursor-pointer ml-2 transition-opacity"
                              onClick={() =>
                                handleGoToCellPage(cellData.id || 0)
                              }
                            >
                              <Link2 className="rotate-45" />
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

type GameEventClientPageProps = {
  game: Game;
};

export function GameEventClientPage({ game }: GameEventClientPageProps) {
  const [tables, setTables] = useState<Table[]>(game.tables ?? []);
  const [columns, setColumns] = useState<Column[]>([]);
  const [displayedTables, setDisplayedTables] = useState<Table[]>(tables);
  const [rows, setRows] = useState<Row[]>();
  const [search, setSearch] = useState("");

  const [cellValues, setCellValues] = useState<CellValue[]>([]);

  const [activeTableId, setActiveTableId] = useState<number | null>(null);
  const [isCreatingTable, setIsCreatingTable] = useState<boolean>(false);

  const [isRandomThrowModalOpen, setIsRandomThrowModalOpen] =
    useState<boolean>(false);

  // Single loading state for all operations
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch active table if not set
  useEffect(() => {
    if (!activeTableId && tables.length > 0 && !isCreatingTable) {
      setActiveTableId(tables[0].id);
    }
  }, [activeTableId, tables, isCreatingTable]);

  useEffect(() => {
    if (search !== "") {
      setDisplayedTables(
        tables.filter((t) => t.name.toLowerCase().includes(search))
      );
    } else {
      setDisplayedTables(tables);
    }
  }, [search, tables]);

  async function handleTableSelect(tableId: number) {
    try {
      const { table, cellValues } = await getTable(tableId);

      setActiveTableId(tableId);
      setIsCreatingTable(false);

      setColumns(table.columns);
      setRows(table.rows);

      setCellValues(cellValues);
    } catch (error) {
      console.log("Error when selecting table");
    }
  }

  const handleCreateTableClick = () => {
    setIsCreatingTable(true);
    setActiveTableId(null);
    setColumns([]);
    setRows([]);
    setCellValues([]);
  };

  async function handleCreateTable(
    newTable: Omit<Table, "id">,
    newColumns: Omit<Column, "id" | "tableId">[]
  ) {
    try {
      const table = await createTable({
        name: newTable.name,
        game_id: newTable.gameId,
        columns: newColumns,
      });
      const formattedTable = {
        id: table.id,
        gameId: table.game_id,
        name: table.name,
        columns: table.columns.map((c) => ({ ...c, tableId: c.table_id })),
      };

      setTables([...tables, formattedTable]);
      setActiveTableId(formattedTable.id);
      setColumns(formattedTable.columns);
      setRows([]);
      setCellValues([]);
    } catch (error) {
      console.log(error);
    }
    setIsCreatingTable(false);
  }

  async function handleAddRow(tableId: number) {
    if (columns.length === 0) {
      return;
    }
    
    setIsLoading(true);
    try {
      const { row } = await createRow({ table_id: tableId });
      const formattedRow = {
        id: row[0].id,
        tableId: row[0].table_id,
      };

      setRows([...(rows ?? []), formattedRow]);

      const newCellValues = columns.map((col, index) => ({
        row_id: formattedRow.id,
        column_id: col.id,
        value: "",
        content:"",
      }));
      const { cells } = await createCells(newCellValues);

      const formattedCells = cells.map((c, index) => ({
        id: c.id,
        rowId: c.row_id,
        columnId: c.column_id,
        value: c.value,
      }));

      setCellValues([...cellValues, ...formattedCells]);
    } catch (error) {
      console.log(error);
      console.log("Erro ao adicionar rows");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateCellValue(
    cellValueId: number | null,
    rowId: number,
    columnId: number,
    value: string
  ) {
    setIsLoading(true);
    try {
      await editCells({ id: cellValueId, value });
      setCellValues(
        cellValues.map((cv) => (cv.id === cellValueId ? { ...cv, value } : cv))
      );
    } catch (error) {
      console.log("Error while updating values");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteColumn(id: number) {
    try {
      await deleteColumn(id);
      setCellValues(cellValues.filter((cv) => cv.columnId != id));
      setColumns(columns.filter((c) => c.id != id));
      const remainingColumns = columns.filter((c) => c.id != id);
      if (remainingColumns.length <= 0 && activeTableId) {
        await deleteRows(activeTableId);
        setRows([]);
      }
    } catch (error) {
      console.log(error);
      console.log("Erro while deleting column");
    }
  }

  async function handleAddColumn(tableId: number, name: string, type: string) {
    const tableColumns = columns.filter((col) => col.tableId === tableId);
    const order = tableColumns.length;

    setIsLoading(true);
    try {
      const newColumn = await createColumn({
        table_id: tableId,
        name,
        type,
        order,
      });

      const formattedNewColumn = {
        ...newColumn.column[0],
        tableId: newColumn.column[0].table_id,
      };

      setColumns([...columns, formattedNewColumn]);
      if (!rows) return;
      
      const newCellValues = rows.map((row, index) => ({
        row_id: row.id,
        column_id: newColumn.column[0].id,
        value: null,
        content:"",
      }));
      const { cells } = await createCells(newCellValues);

      const formattedCells = cells.map((c, index) => ({
        id: c.id,
        rowId: c.row_id,
        columnId: c.column_id,
        value: c.value,
      }));

      setCellValues([...cellValues, ...formattedCells]);
    } catch (error) {
      console.log("Erro ao criar coluna");
    } finally {
      setIsLoading(false);
    }
  }

  // Get the active table and its data
  const activeTable = tables.find((t) => t.id === activeTableId);

  const relevantCellValues = cellValues.filter(
    (cv) =>
      rows?.some((row) => row.id === cv.rowId) &&
      columns.some((col) => col.id === cv.columnId)
  );

  return (
    <div className="flex h-screen bg-slate-950">
      <TablesSidebar
        tables={displayedTables}
        activeTableId={activeTableId}
        onTableSelect={handleTableSelect}
        onCreateTable={handleCreateTableClick}
        gameId={game.id}
        setSearch={setSearch}
      />

      <div className="flex-grow overflow-auto">
        {isCreatingTable ? (
          <CreateTableForm
            gameId={game.id}
            onCancel={() => {
              setIsCreatingTable(false);
              if (tables.length > 0) {
                setActiveTableId(tables[0].id);
              }
            }}
            onSubmit={handleCreateTable}
          />
        ) : activeTable ? (
          <TableView
            table={activeTable}
            columns={columns}
            rows={rows ?? []}
            cellValues={relevantCellValues}
            onAddRow={handleAddRow}
            onUpdateCellValue={handleUpdateCellValue}
            onAddColumn={handleAddColumn}
            handleDeleteColumn={handleDeleteColumn}
            onRandomThrow={() => setIsRandomThrowModalOpen(true)}
            isLoading={isLoading}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            Select a table or create a new one to get started
          </div>
        )}
      </div>
      <RandomThrowModal
        isOpen={isRandomThrowModalOpen}
        onClose={() => setIsRandomThrowModalOpen(false)}
        columns={columns}
        rows={rows ?? []}
        cellValues={relevantCellValues}
      />
    </div>
  );
}