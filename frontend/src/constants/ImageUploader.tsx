'use client';
import { useState, useCallback } from 'react';
import { uploadToPinata } from '../utils/pinanta';
import { FiUploadCloud, FiXCircle, FiImage } from 'react-icons/fi';

type ImageUploaderProps = {
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: string) => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
};

export default function ImageUploader({
  onUploadSuccess,
  onUploadError,
  maxSizeMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
}: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [ipfsUrl, setIpfsUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError('');
      const selectedFile = e.target.files?.[0];
      
      if (!selectedFile) {
        setFile(null);
        return;
      }

      // Validate file type
      if (!allowedTypes.includes(selectedFile.type)) {
        setError(`Unsupported file type: ${selectedFile.type}`);
        return;
      }

      // Validate file size
      if (selectedFile.size > maxSizeMB * 1024 * 1024) {
        setError(`File too large (max ${maxSizeMB}MB)`);
        return;
      }

      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    },
    [allowedTypes, maxSizeMB]
  );

  const handleUpload = useCallback(async () => {
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const url = await uploadToPinata(file);
      if (!url) throw new Error('Upload failed - no URL returned');

      setIpfsUrl(url);
      onUploadSuccess?.(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [file, onUploadSuccess, onUploadError]);

  const handleRemove = useCallback(() => {
    setFile(null);
    setPreviewUrl('');
    setIpfsUrl('');
    setError('');
  }, []);

  return (
    <div className="max-w-md p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <div className="space-y-4">
        {/* File Input Area */}
        <div className="relative group">
          <input
            type="file"
            accept={allowedTypes.join(',')}
            onChange={handleFileChange}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg ${
              isUploading 
                ? 'bg-gray-50 border-gray-200' 
                : 'group-hover:border-blue-500 cursor-pointer border-gray-300'
            } transition-colors`}
          >
            <FiUploadCloud className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 text-center">
              {previewUrl ? 'File selected' : 'Click to select image'}
              <br />
              <span className="text-xs text-gray-400">
                (Max {maxSizeMB}MB - {allowedTypes.join(', ')})
              </span>
            </p>
          </label>
        </div>

        {/* Preview Section */}
        {previewUrl && (
          <div className="relative group">
            <div className="border rounded-lg overflow-hidden">
              <img
                src={previewUrl}
                alt="Selected preview"
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full shadow-sm hover:bg-white transition-colors"
              >
                <FiXCircle className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        )}

        {/* Upload Controls */}
        {file && !ipfsUrl && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading || !!error}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all ${
                isUploading || error
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isUploading ? (
                <>
                  <span className="animate-spin">🌀</span>
                  Uploading...
                </>
              ) : (
                <>
                  <FiUploadCloud className="w-5 h-5" />
                  Upload to IPFS
                </>
              )}
            </button>

            {error && (
              <p className="text-sm text-red-600 flex items-center gap-2">
                <FiXCircle className="flex-shrink-0" />
                {error}
              </p>
            )}
          </div>
        )}

        {/* Upload Result */}
        {ipfsUrl && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 mb-2">
                ✅ Upload successful!
              </p>
              <div className="space-y-2">
                <a
                  href={ipfsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-blue-600 hover:underline break-all"
                >
                  {ipfsUrl}
                </a>
                <div className="border-t border-green-200 pt-2">
                  <img
                    src={ipfsUrl}
                    alt="Uploaded content preview"
                    className="w-full h-32 object-contain rounded"
                  />
                </div>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleRemove}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
            >
              <FiXCircle className="w-5 h-5" />
              Remove and Upload New
            </button>
          </div>
        )}
      </div>
    </div>
  );
}