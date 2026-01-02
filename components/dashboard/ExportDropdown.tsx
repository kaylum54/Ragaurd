'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { exportUsageCSV, exportUsagePDF, type UsageExportData } from '@/lib/utils/export';

interface ExportDropdownProps {
  data: UsageExportData | null;
  loading?: boolean;
}

export function ExportDropdown({ data, loading }: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportCSV = () => {
    if (data) {
      exportUsageCSV(data);
      setIsOpen(false);
    }
  };

  const handleExportPDF = () => {
    if (data) {
      exportUsagePDF(data);
      setIsOpen(false);
    }
  };

  const isDisabled = loading || !data;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={cn(
          'dash-btn dash-btn-secondary flex items-center gap-2',
          isDisabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        disabled={isDisabled}
      >
        <Download className="h-4 w-4" />
        Export
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-dash-bg-secondary border-2 border-dash-border shadow-lg z-50">
          <div className="py-1">
            <button
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-dash-text-secondary hover:bg-dash-bg-hover hover:text-dash-text-primary transition-colors"
              onClick={handleExportCSV}
            >
              <FileSpreadsheet className="h-4 w-4 text-green-500" />
              Export as CSV
            </button>
            <button
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-dash-text-secondary hover:bg-dash-bg-hover hover:text-dash-text-primary transition-colors"
              onClick={handleExportPDF}
            >
              <FileText className="h-4 w-4 text-red-500" />
              Export as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
