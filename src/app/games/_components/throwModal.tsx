"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { X, Dice5Icon, RefreshCw, Shuffle, Link2 } from "lucide-react";
import type { Column, Row, CellValue } from "@/@types";

interface RandomThrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: Column[];
  rows: Row[];
  cellValues: CellValue[];
}

interface RandomRowResult {
  row: Row;
  values: { [columnId: number]: string };
}

interface MultiRandomResult {
  values: {
    [columnId: number]: { value: string; rowId: number; link?: string | null };
  };
}

type RandomMode = "single" | "multi";

export const RandomThrowModal: React.FC<RandomThrowModalProps> = ({
  isOpen,
  onClose,
  columns,
  rows,
  cellValues,
}) => {
  const [randomResult, setRandomResult] = useState<RandomRowResult | null>(
    null
  );
  const [multiRandomResult, setMultiRandomResult] =
    useState<MultiRandomResult | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [hasRolled, setHasRolled] = useState<boolean>(false);
  const [randomMode, setRandomMode] = useState<RandomMode>("single");

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setRandomResult(null);
      setMultiRandomResult(null);
      setIsRolling(false);
      setHasRolled(false);
      setRandomMode("single");
    }
  }, [isOpen]);

  // Get cell value for a specific row and column
  const getCellValue = (
    rowId: number,
    columnId: number
  ): { value: string; link?: string | null } => {
    const cell = cellValues.find(
      (cv) => cv.rowId === rowId && cv.columnId === columnId
    );
    return { value: cell?.value || "", link: cell?.link || null };
  };

  // Get all non-empty values for a specific column
  const getColumnValues = (
    columnId: number
  ): Array<{ value: string; rowId: number; link?: string | null }> => {
    return cellValues
      .filter(
        (cv) => cv.columnId === columnId && cv.value && cv.value.trim() !== ""
      )
      .map((cv) => ({
        value: cv.value as string,
        rowId: cv.rowId,
        link: cv.link,
      }));
  };

  // Handle single row random throw
  const handleSingleRandomThrow = () => {
    if (rows.length === 0) {
      setRandomResult(null);
      setHasRolled(true);
      return;
    }

    setIsRolling(true);
    setHasRolled(false);
    setMultiRandomResult(null);

    // Simulate rolling animation with multiple random selections
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * rows.length);
      const selectedRow = rows[randomIndex];

      // Get all values for this row
      const rowValues: { [columnId: number]: string } = {};
      columns.forEach((column) => {
        rowValues[column.id] = getCellValue(selectedRow.id, column.id).value;
      });

      setRandomResult({
        row: selectedRow,
        values: rowValues,
      });

      rollCount++;

      if (rollCount >= 12) {
        clearInterval(rollInterval);
        setIsRolling(false);
        setHasRolled(true);

        // Final random selection
        const finalIndex = Math.floor(Math.random() * rows.length);
        const finalRow = rows[finalIndex];
        const finalValues: { [columnId: number]: string } = {};
        columns.forEach((column) => {
          finalValues[column.id] = getCellValue(finalRow.id, column.id).value;
        });

        setRandomResult({
          row: finalRow,
          values: finalValues,
        });
      }
    }, 120);
  };

  // Handle multi random throw (one random value from each column)
  const handleMultiRandomThrow = () => {
    if (rows.length === 0 || columns.length === 0) {
      setMultiRandomResult(null);
      setHasRolled(true);
      return;
    }

    setIsRolling(true);
    setHasRolled(false);
    setRandomResult(null);

    // Simulate rolling animation
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      const tempValues: {
        [columnId: number]: {
          value: string;
          rowId: number;
          link?: string | null;
        };
      } = {};

      columns.forEach((column) => {
        const columnValues = getColumnValues(column.id);
        if (columnValues.length > 0) {
          const randomIndex = Math.floor(Math.random() * columnValues.length);
          tempValues[column.id] = columnValues[randomIndex];
        } else {
          tempValues[column.id] = { value: "", rowId: -1, link: null };
        }
      });

      setMultiRandomResult({ values: tempValues });

      rollCount++;

      if (rollCount >= 12) {
        clearInterval(rollInterval);
        setIsRolling(false);
        setHasRolled(true);

        // Final random selection
        const finalValues: {
          [columnId: number]: {
            value: string;
            rowId: number;
            link?: string | null;
          };
        } = {};

        columns.forEach((column) => {
          const columnValues = getColumnValues(column.id);
          if (columnValues.length > 0) {
            const randomIndex = Math.floor(Math.random() * columnValues.length);
            finalValues[column.id] = columnValues[randomIndex];
          } else {
            finalValues[column.id] = { value: "", rowId: -1, link: null };
          }
        });

        setMultiRandomResult({ values: finalValues });
      }
    }, 120);
  };

  const handleRandomThrow = () => {
    if (randomMode === "single") {
      handleSingleRandomThrow();
    } else {
      handleMultiRandomThrow();
    }
  };

  if (!isOpen) return null;

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <Dice5Icon
              className={`h-5 w-5 text-indigo-400 ${
                isRolling ? "animate-spin" : ""
              }`}
            />
            <h3 className="text-lg font-semibold text-white">Random Throw</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode Selection */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex space-x-1 bg-slate-800 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setRandomMode("single")}
              disabled={isRolling}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                randomMode === "single"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Dice5Icon className="h-4 w-4" />
              <span>Single Row</span>
            </button>
            <button
              type="button"
              onClick={() => setRandomMode("multi")}
              disabled={isRolling}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                randomMode === "multi"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Shuffle className="h-4 w-4" />
              <span>Multi Random</span>
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {randomMode === "single"
              ? "Select one complete row randomly"
              : "Select one random value from each column across all rows"}
          </p>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Status Display */}
          <div className="text-center">
            {rows.length === 0 ? (
              <div className="text-slate-400 py-8">
                <Dice5Icon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No rows available to roll from</p>
              </div>
            ) : isRolling ? (
              <div className="flex items-center justify-center space-x-2 text-yellow-400 py-4">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span className="font-medium">
                  {randomMode === "single"
                    ? "Rolling for random row..."
                    : "Rolling for multi random..."}
                </span>
              </div>
            ) : hasRolled && (randomResult || multiRandomResult) ? (
              <div className="text-indigo-400 mb-4">
                <p className="font-medium">
                  {randomMode === "single"
                    ? "Random Row Selected!"
                    : "Multi Random Selection Complete!"}
                </p>
                {randomMode === "single" && randomResult && (
                  <p className="text-sm text-slate-400">
                    Row ID: {randomResult.row.id}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center text-slate-400 py-4 min-h-[10rem]">
                {randomMode === "single" ? (
                  <>
                    <Dice5Icon className="h-8 w-8 mx-auto mb-2" />
                    <p>Ready to roll for single row...</p>
                  </>
                ) : (
                  <>
                    <Shuffle className="h-8 w-8 mx-auto mb-2" />
                    <p>Ready to roll for multi random...</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Result Display */}
          {(randomResult || multiRandomResult) && (
            <div
              className={`border-2 rounded-lg overflow-hidden ${
                isRolling
                  ? "border-yellow-500 bg-yellow-500/5 animate-pulse"
                  : "border-indigo-500 bg-indigo-500/5"
              }`}
            >
              <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
                <h4 className="text-sm font-medium text-slate-300">
                  {randomMode === "single"
                    ? "Row Values:"
                    : "Multi Random Values:"}
                </h4>
              </div>
              <div className="p-4">
                {sortedColumns.length > 0 ? (
                  <div className="space-y-3">
                    {sortedColumns.map((column) => {
                      let value = "";
                      let sourceRowId: number | undefined;
                      let link: string | null | undefined;

                      if (randomMode === "single" && randomResult) {
                        const cell = getCellValue(
                          randomResult.row.id,
                          column.id
                        );
                        value = cell.value;
                        link = cell.link;
                        sourceRowId = randomResult.row.id;
                      } else if (randomMode === "multi" && multiRandomResult) {
                        const multiValue = multiRandomResult.values[column.id];
                        value = multiValue?.value || "";
                        link = multiValue?.link || null;
                        sourceRowId =
                          multiValue?.rowId !== -1
                            ? multiValue?.rowId
                            : undefined;
                      }

                      return (
                        <div
                          key={column.id}
                          className="flex justify-between items-center py-2 border-b gap-2 border-slate-800 last:border-b-0"
                        >
                          <div className="flex-shrink-0">
                            <span className="font-medium text-slate-300">
                              {column.name}
                            </span>
                            <span className="ml-2 text-xs text-slate-500">
                              ({column.type})
                            </span>
                            {randomMode === "multi" && sourceRowId && (
                              <span className="ml-2 text-xs text-slate-600">
                                from row #{sourceRowId}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            {link && (
                              <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Link2 className="rotate-45 hover:cursor-pointer hover:text-indigo-500" />
                              </a>
                            )}
                            <div className="flex-grow text-right">
                              {value ? (
                                <span className="text-white font-medium px-3 py-1 bg-slate-700 rounded">
                                  {value}
                                </span>
                              ) : (
                                <span className="text-slate-500 italic px-3 py-1">
                                  Empty
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-slate-500 py-4">
                    No columns available
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={handleRandomThrow}
              disabled={isRolling || rows.length === 0}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded text-white font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {randomMode === "single" ? (
                <Dice5Icon className="h-4 w-4" />
              ) : (
                <Shuffle className="h-4 w-4" />
              )}
              <span>
                {isRolling
                  ? "Rolling..."
                  : hasRolled
                  ? "Roll Again"
                  : randomMode === "single"
                  ? "Roll Random Row"
                  : "Multi Random Roll"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
