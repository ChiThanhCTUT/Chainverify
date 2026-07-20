import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, File, CheckCircle, AlertCircle, X } from 'lucide-react';
import Button from './Button';

interface PdfUploadProps {
  onUploadSuccess?: (data: any) => void;
  onUploadError?: (error: any) => void;
}

const PdfUpload: React.FC<PdfUploadProps> = ({ onUploadSuccess, onUploadError }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.type !== 'application/pdf') {
        setErrorMessage('Vui lòng chọn file PDF.');
        setUploadStatus('error');
        return;
      }
      
      if (selectedFile.size > 10 * 1024 * 1024) {
        setErrorMessage('Kích thước file không được vượt quá 10MB.');
        setUploadStatus('error');
        return;
      }

      setFile(selectedFile);
      setUploadStatus('idle');
      setErrorMessage('');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (droppedFile.type !== 'application/pdf') {
        setErrorMessage('Vui lòng chọn file PDF.');
        setUploadStatus('error');
        return;
      }
      
      setFile(droppedFile);
      setUploadStatus('idle');
      setErrorMessage('');
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadStatus('idle');
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('idle');
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Gọi API đến server backend (mặc định là localhost:5000 như đã setup)
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus('success');
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
    } catch (error: any) {
      console.error('Lỗi upload file:', error);
      setUploadStatus('error');
      setErrorMessage(error.response?.data?.message || 'Có lỗi xảy ra khi upload file.');
      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-medium text-slate-800 mb-4">Tải lên tài liệu PDF</h3>
      
      {!file ? (
        <div 
          className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 font-medium mb-1">Kéo thả file PDF vào đây</p>
          <p className="text-slate-400 text-sm">hoặc click để chọn file (Tối đa 10MB)</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="application/pdf" 
            className="hidden" 
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                <File className="w-6 h-6" />
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-slate-800 truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            {uploadStatus !== 'success' && (
              <button 
                onClick={removeFile}
                disabled={isUploading}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {uploadStatus === 'error' && (
            <div className="flex items-center text-red-600 text-sm p-3 bg-red-50 rounded-lg">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          
          {uploadStatus === 'success' && (
            <div className="flex items-center text-green-600 text-sm p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-4 h-4 mr-2 shrink-0" />
              <span>File đã được tải lên thành công!</span>
            </div>
          )}

          {uploadStatus !== 'success' && (
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={removeFile}
                disabled={isUploading}
              >
                Hủy
              </Button>
              <Button 
                onClick={handleUpload}
                isLoading={isUploading}
                disabled={isUploading}
              >
                {isUploading ? 'Đang tải lên...' : 'Tải lên'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PdfUpload;
