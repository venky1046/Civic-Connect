import { useRef, useState, useEffect } from 'react';
import { ImagePlus, X, RefreshCw } from 'lucide-react';

const MAX_MB = 5;
const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png'];

export default function ImageUploader({ file, onChange, error }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFiles = (fileList) => {
    const f = fileList?.[0];
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) {
      onChange(null, 'Only JPG, JPEG and PNG images are allowed.');
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      onChange(null, 'Image size must be less than 5 MB.');
      return;
    }
    onChange(f, null);
  };

  if (preview) {
    return (
      <div className="relative rounded-xl2 overflow-hidden border border-line">
        <img src={preview} alt="Selected problem" className="w-full h-56 object-cover" />
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white"
            aria-label="Replace image"
          >
            <RefreshCw size={16} className="text-navy-800" />
          </button>
          <button
            type="button"
            onClick={() => onChange(null, null)}
            className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white"
            aria-label="Remove image"
          >
            <X size={16} className="text-red-600" />
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className={`w-full rounded-xl2 border-2 border-dashed ${
          error ? 'border-red-300 bg-red-50' : 'border-line bg-navy-50/40 hover:bg-navy-50'
        } flex flex-col items-center justify-center gap-2 py-10 text-center transition-colors`}
      >
        <ImagePlus size={26} className="text-navy-600" />
        <p className="text-sm font-medium text-navy-800">Click to upload or drag and drop</p>
        <p className="text-xs text-ink-400">JPG, JPEG or PNG &middot; Max 5 MB</p>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}
