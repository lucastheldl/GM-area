import { createImportedTable } from "@/actions/tables";
import { File, X, Check, XCircle, Table } from "lucide-react";
import { useRef, useState } from "react";

interface TableData {
  game_id: number;
  name: string;
  columns: Array<{ id: number; name: string; type: string; order: number }>;
  rows: Array<{ id: number }>;
  cellValues: Array<{
    rowId: number;
    columnId: number;
    value: string | number | boolean;
  }>;
}

interface JsonImportModalProps {
  gameId: number;
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: TableData) => void;
}

export const JsonImportModal: React.FC<JsonImportModalProps> = ({
  gameId,
  isOpen,
  onClose,
  onImport,
}) => {
  const [jsonData, setJsonData] = useState<TableData | null>(null);
  const [isValidData, setIsValidData] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const { isValid, error, data } = validateJsonStructure(parsed);
        if (isValid && data) {
          setJsonData(data);
          setIsValidData(true);
          setValidationError("");
        } else {
          setJsonData(null);
          setIsValidData(false);
          setValidationError(error || "Invalid data structure");
        }
      } catch (error) {
        setJsonData(null);
        setIsValidData(false);
        setValidationError("Invalid JSON format");
      }
    };
    reader.readAsText(file);
  };

  const validateJsonStructure = (
    data: any
  ): { isValid: boolean; error?: string; data?: TableData } => {
    try {
      // Check if data has required table structure
      if (!data || typeof data !== "object") {
        return { isValid: false, error: "Data must be an object" };
      }

      const { name, columns, rows, cellValues } = data;

      // Validate name
      if (!name || typeof name !== "string") {
        return {
          isValid: false,
          error: "Table must have a 'name' property (string)",
        };
      }

      // Validate cols
      if (!Array.isArray(columns) || columns.length === 0) {
        return {
          isValid: false,
          error: "Table must have a 'cols' array with at least one column",
        };
      }

      for (const col of columns) {
        if (!col.id || !col.name || !col.type || col.order === undefined) {
          return {
            isValid: false,
            error:
              "Each column must have 'id', 'name', 'type', and 'order' properties",
          };
        }
      }

      // Validate rows
      if (!Array.isArray(rows)) {
        return { isValid: false, error: "Table must have a 'rows' array" };
      }

      for (const row of rows) {
        if (!row.id) {
          return {
            isValid: false,
            error: "Each row must have an 'id' property",
          };
        }
      }

      // Validate cells
      if (!Array.isArray(cellValues)) {
        return { isValid: false, error: "Table must have a 'cells' array" };
      }

      for (const cell of cellValues) {
        if (
          cell.rowId === undefined ||
          cell.columnId === undefined ||
          cell.value === undefined
        ) {
          return {
            isValid: false,
            error:
              "Each cell must have 'rowId', 'columnId', and 'value' properties",
          };
        }
      }

      return {
        isValid: true,
        data: {
          game_id: gameId,
          name,
          columns,
          rows,
          cellValues,
        },
      };
    } catch (error) {
      return { isValid: false, error: "Error validating data structure" };
    }
  };

  const getTableHeaders = (): Array<{
    id: number;
    name: string;
    type: string;
    order: number;
  }> => {
    if (!jsonData || !jsonData.columns) return [];
    return [...jsonData.columns].sort((a, b) => a.order - b.order);
  };

  const getCellValue = (rowId: number, columnId: number): string => {
    if (!jsonData) return "";
    const cell = jsonData.cellValues.find(
      (c) => c.rowId === rowId && c.columnId === columnId
    );
    return cell ? String(cell.value) : "";
  };

  const handleImport = () => {
    if (jsonData && isValidData) {
      onImport(jsonData);
      handleClose();
    }
  };

  const handleClose = () => {
    setJsonData(null);
    setIsValidData(false);
    setValidationError("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onClose();
  };

  if (!isOpen) return null;

  const headers = getTableHeaders();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <File className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">
              Import JSON Table
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {!jsonData ? (
            /* File Upload Area */
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 hover:border-slate-500 transition-colors">
                  <Table className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <h4 className="text-lg font-medium text-white mb-2">
                    Select Table JSON File
                  </h4>
                  <p className="text-sm text-slate-400 mb-4">
                    Choose a JSON file with table structure: name, cols, rows,
                    cells
                  </p>
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-medium transition-colors flex items-center mx-auto space-x-2"
                  >
                    <File className="h-4 w-4" />
                    <span>Choose File</span>
                  </button>
                </div>
                <input
                  type="file"
                  accept=".json"
                  ref={inputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            /* Preview Area */
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Table Info */}
              <div className="p-4 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-white">
                      {jsonData.name}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-slate-400 mt-1">
                      <span>{jsonData.rows.length} rows</span>
                      <span>{jsonData.columns.length} columns</span>
                      <span>{jsonData.cellValues.length} cells</span>
                    </div>
                  </div>
                  {isValidData ? (
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-green-400" />
                      <span className="text-green-400 font-medium">Valid</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-5 w-5 text-red-400" />
                      <span className="text-red-400 font-medium">Invalid</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Table Preview */}
              {isValidData && jsonData && (
                <div className="flex-1 overflow-auto p-4">
                  <div className="border border-slate-700 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        {/* Header */}
                        <thead className="bg-slate-800">
                          <tr>
                            {headers.map((header) => (
                              <th
                                key={header.id}
                                className="px-4 py-3 text-left text-sm font-medium text-slate-300 border-r border-slate-700 last:border-r-0"
                              >
                                <div>
                                  <div>{header.name}</div>
                                  <div className="text-xs text-slate-500 font-normal">
                                    {header.type}
                                  </div>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        {/* Body */}
                        <tbody className="bg-slate-900">
                          {jsonData.rows.slice(0, 10).map((row) => (
                            <tr
                              key={row.id}
                              className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/50"
                            >
                              {headers.map((header) => (
                                <td
                                  key={header.id}
                                  className="px-4 py-3 text-sm text-slate-200 border-r border-slate-800 last:border-r-0"
                                >
                                  <div className="max-w-xs truncate">
                                    {(() => {
                                      const value = getCellValue(
                                        row.id,
                                        header.id
                                      );
                                      return value ? (
                                        value
                                      ) : (
                                        <span className="text-slate-500 italic">
                                          empty
                                        </span>
                                      );
                                    })()}
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {jsonData.rows.length > 10 && (
                      <div className="bg-slate-800 px-4 py-2 text-center text-sm text-slate-400">
                        Showing first 10 rows of {jsonData.rows.length} total
                        rows
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Invalid Data Display */}
              {!isValidData && validationError && (
                <div className="flex-1 overflow-auto p-4">
                  <div className="border border-red-500/20 bg-red-500/5 rounded-lg p-4">
                    <h4 className="text-red-400 font-medium mb-2">
                      Validation Error:
                    </h4>
                    <p className="text-sm text-red-300 mb-4">
                      {validationError}
                    </p>

                    <div className="mb-4">
                      <h5 className="text-slate-300 font-medium mb-2">
                        Expected JSON structure:
                      </h5>
                      <pre className="text-sm text-slate-400 bg-slate-800 p-3 rounded overflow-auto">
                        {`{
                                "name": "Table Name",
                                "columns": [
                                  {
                                    "id": 1,
                                    "name": "Column Name",
                                    "type": "text|number|boolean",
                                    "order": 0
                                  }
                                ],
                                "rows": [
                                  { "id": 1 },
                                  { "id": 2 }
                                ],
                                "cellValues": [
                                  {
                                    "rowId": 1,
                                    "columnId": 1,
                                    "value": "Cell Value"
                                  }
                                ]
                              }`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex space-x-3">
            {jsonData && (
              <button
                type="button"
                onClick={() => {
                  setJsonData(null);
                  setIsValidData(false);
                  if (inputRef.current) {
                    inputRef.current.value = "";
                  }
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white font-medium transition-colors flex items-center space-x-2"
              >
                <File className="h-4 w-4" />
                <span>Choose Different File</span>
              </button>
            )}
            <div className="flex-1"></div>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 font-medium transition-colors flex items-center space-x-2"
            >
              <XCircle className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={!isValidData}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded text-white font-medium transition-colors flex items-center space-x-2"
            >
              <Check className="h-4 w-4" />
              <span>Create Table</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated JsonUploader component to use the modal
export default function JsonUploader({ gameId }: { gameId: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleImport(data: TableData) {
    console.log("Importing table data:", { ...data, game_id: gameId });
    try {
      await createImportedTable(data);
      console.log("success");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-white flex items-center"
      >
        <File className="h-4 w-4 mr-1" />
        Import table
      </button>

      <JsonImportModal
        gameId={gameId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImport={handleImport}
      />
    </>
  );
}
