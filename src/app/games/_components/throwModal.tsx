"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { X, Dice5Icon, RefreshCw } from "lucide-react";
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
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [hasRolled, setHasRolled] = useState<boolean>(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setRandomResult(null);
      setIsRolling(false);
      setHasRolled(false);
      // Auto-roll when modal opens
      setTimeout(() => {
        handleRandomThrow();
      }, 300);
    }
  }, [isOpen]);

  // Get cell value for a specific row and column
  const getCellValue = (rowId: number, columnId: number): string => {
    const cell = cellValues.find(
      (cv) => cv.rowId === rowId && cv.columnId === columnId
    );
    return cell?.value || "";
  };

  // Handle random throw
  const handleRandomThrow = () => {
    if (rows.length === 0) {
      setRandomResult(null);
      setHasRolled(true);
      return;
    }

    setIsRolling(true);
    setHasRolled(false);

    // Simulate rolling animation with multiple random selections
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * rows.length);
      const selectedRow = rows[randomIndex];

      // Get all values for this row
      const rowValues: { [columnId: number]: string } = {};
      columns.forEach((column) => {
        rowValues[column.id] = getCellValue(selectedRow.id, column.id);
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
          finalValues[column.id] = getCellValue(finalRow.id, column.id);
        });

        setRandomResult({
          row: finalRow,
          values: finalValues,
        });
      }
    }, 120);
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
            <h3 className="text-lg font-semibold text-white">
              Random Row Throw
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
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
                <span className="font-medium">Rolling for random row...</span>
              </div>
            ) : hasRolled && randomResult ? (
              <div className="text-indigo-400 mb-4">
                <p className="font-medium">Random Row Selected!</p>
                <p className="text-sm text-slate-400">
                  Row ID: {randomResult.row.id}
                </p>
              </div>
            ) : (
              <div className="text-slate-400 py-4">
                <Dice5Icon className="h-8 w-8 mx-auto mb-2" />
                <p>Ready to roll...</p>
              </div>
            )}
          </div>

          {/* Result Display */}
          {randomResult && (
            <div
              className={`border-2 rounded-lg overflow-hidden ${
                isRolling
                  ? "border-yellow-500 bg-yellow-500/5 animate-pulse"
                  : "border-indigo-500 bg-indigo-500/5"
              }`}
            >
              <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
                <h4 className="text-sm font-medium text-slate-300">
                  Row Values:
                </h4>
              </div>
              <div className="p-4">
                {sortedColumns.length > 0 ? (
                  <div className="space-y-3">
                    {sortedColumns.map((column) => {
                      const value = randomResult.values[column.id];
                      return (
                        <div
                          key={column.id}
                          className="flex justify-between items-center py-2 border-b border-slate-800 last:border-b-0"
                        >
                          <div className="flex-shrink-0">
                            <span className="font-medium text-slate-300">
                              {column.name}
                            </span>
                            <span className="ml-2 text-xs text-slate-500">
                              ({column.type})
                            </span>
                          </div>
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
              <Dice5Icon className="h-4 w-4" />
              <span>
                {isRolling
                  ? "Rolling..."
                  : hasRolled
                  ? "Roll Again"
                  : "Roll Random Row"}
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
