import React, { useRef, useState } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../../utils/cn';

export const AdminFileUpload = ({
  file,
  setFile,
  existingUrl,
  label = 'Upload Image / Document',
  accept = 'image/jpeg,image/png,image/webp,image/jpg,image/svg+xml,application/pdf',
  maxSizeMB = 10,
  error,
  helperText,
}) => {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [internalError, setInternalError] = useState('');

  const validateAndSetFile = (selected) => {
    setInternalError('');
    if (!selected) return;

    if (selected.size > maxSizeMB * 1024 * 1024) {
      setInternalError(
        `File size (${(selected.size / (1024 * 1024)).toFixed(1)}MB) exceeds the ${maxSizeMB}MB limit.`
      );
      return;
    }

    setFile(selected);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    validateAndSetFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    validateAndSetFile(dropped);
  };

  const isPdf = file?.type === 'application/pdf' || (!file && existingUrl?.endsWith('.pdf'));

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-bold text-[#17231D]">
          {label}
        </label>
      )}

      {/* Upload Dropzone Box */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-[16px] p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 bg-white',
          dragOver
            ? 'border-[#164A35] bg-[#164A35]/5'
            : 'border-[#E5E1D7] hover:border-[#164A35]/50 hover:bg-[#FAF8F2]',
          (error || internalError) && 'border-[#C94A4A] bg-[#C94A4A]/5'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Existing URL or Selected File Preview */}
        {file ? (
          <div className="flex items-center gap-3 w-full max-w-sm bg-[#FAF8F2] p-3 rounded-[12px] border border-[#E5E1D7]">
            {isPdf ? (
              <FileText className="w-8 h-8 text-[#164A35] shrink-0" />
            ) : (
              <img
                src={URL.createObjectURL(file)}
                alt="Upload preview"
                className="w-12 h-12 object-cover rounded-[8px] border border-[#E5E1D7]"
              />
            )}
            <div className="flex-1 text-left min-w-0">
              <p className="text-xs font-bold text-[#17231D] truncate">{file.name}</p>
              <p className="text-[11px] text-[#68736D]">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="text-[#C94A4A] hover:bg-[#C94A4A]/10 p-1.5 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : existingUrl ? (
          <div className="flex items-center gap-3 w-full max-w-sm bg-[#FAF8F2] p-3 rounded-[12px] border border-[#E5E1D7]">
            {isPdf ? (
              <FileText className="w-8 h-8 text-[#164A35] shrink-0" />
            ) : (
              <img
                src={existingUrl}
                alt="Current file"
                className="w-12 h-12 object-cover rounded-[8px] border border-[#E5E1D7]"
              />
            )}
            <div className="flex-1 text-left min-w-0">
              <p className="text-xs font-bold text-[#17231D] truncate">Current file live</p>
              <p className="text-[11px] text-[#2F7D57] font-semibold">Click to replace</p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-[#164A35]/10 text-[#164A35] flex items-center justify-center">
              <Upload className="w-5 h-5 text-[#C5A55A]" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-[#17231D]">
                Click to upload or drag & drop
              </p>
              <p className="text-[11px] text-[#68736D]">
                Images (PNG, JPG, WebP) or PDF up to {maxSizeMB}MB
              </p>
            </div>
          </>
        )}
      </div>

      {(error || internalError) && (
        <p className="text-xs text-[#C94A4A] font-medium flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error || internalError}</span>
        </p>
      )}
      {helperText && !error && !internalError && (
        <p className="text-xs text-[#68736D]">{helperText}</p>
      )}
    </div>
  );
};
