import { Column, Table } from "@/@types";
import { createTable } from "@/actions/tables";
import { COLUMN_TYPES } from "@/consts";
import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import JsonUploader from "../_components/jsonUploader";

// Table creation form
export const CreateTableForm: React.FC<{
  gameId: number;
  onCancel: () => void;
  onSubmit: (
    table: Omit<Table, "id">,
    columns: Omit<Column, "id" | "tableId">[]
  ) => void;
}> = ({ gameId, onCancel, onSubmit }) => {
  const [tableName, setTableName] = useState<string>("");
  const [columns, setColumns] = useState<
    Array<{ name: string; type: string; order: number }>
  >([{ name: "", type: "text", order: 0 }]);

  const addColumn = () => {
    setColumns([...columns, { name: "", type: "text", order: columns.length }]);
  };

  const removeColumn = (index: number) => {
    if (columns.length <= 1) return; // Keep at least one column
    const newColumns = [...columns];
    newColumns.splice(index, 1);

    // Update order for remaining columns
    newColumns.forEach((col, idx) => {
      col.order = idx;
    });

    setColumns(newColumns);
  };

  const updateColumn = (
    index: number,
    field: "name" | "type",
    value: string
  ) => {
    const newColumns = [...columns];
    newColumns[index] = { ...newColumns[index], [field]: value };
    setColumns(newColumns);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate
    if (!tableName.trim()) return;
    if (columns.some((col) => !col.name.trim())) return;

    onSubmit({ name: tableName, gameId }, columns);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Create New Table</h2>
        <div className="flex gap-4">

        <JsonUploader gameId={gameId}/>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-300"
        >
          <X className="h-5 w-5" />
        </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="tableName"
            className="block text-sm font-medium text-slate-300 mb-1"
          >
            Table Name
          </label>
          <input
            id="tableName"
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className="w-full py-2 px-3 rounded-md bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter table name..."
            required
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-white">Columns</h3>
            <button
              type="button"
              onClick={addColumn}
              className="text-indigo-400 hover:text-indigo-300 flex items-center text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Column
            </button>
          </div>

          <div className="space-y-3">
            {columns.map((column, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-grow">
                  <input
                    type="text"
                    value={column.name}
                    onChange={(e) =>
                      updateColumn(index, "name", e.target.value)
                    }
                    className="w-full py-2 px-3 rounded-md bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Column name"
                    required
                  />
                </div>
                <div className="w-32">
                  <select
                    value={column.type}
                    onChange={(e) =>
                      updateColumn(index, "type", e.target.value)
                    }
                    className="w-full py-2 px-3 rounded-md bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {COLUMN_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeColumn(index)}
                  disabled={columns.length <= 1}
                  className="p-2 text-slate-400 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-medium"
          >
            Create Table
          </button>
        </div>
      </form>
    </div>
  );
};
