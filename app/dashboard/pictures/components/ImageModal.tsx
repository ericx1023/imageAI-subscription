'use client';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: {
    url: string;
    name: string;
    prompt: string;
  } | null;
  mode: 'view' | 'edit';
}

const ImageModal = ({ isOpen, onClose, image, mode }: ImageModalProps) => {
  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg p-4 max-w-4xl w-full mx-4 z-10">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="mt-4">
          <img
            src={image.url}
            alt={image.name}
            className="w-full h-auto rounded"
          />
          {mode === 'view' && (
            <div className="mt-4">
              <h3 className="font-semibold">提示詞：</h3>
              <p className="mt-1 text-gray-600">{image.prompt}</p>
            </div>
          )}
          {mode === 'edit' && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block font-semibold mb-2">編輯提示詞：</label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={3}
                  defaultValue={image.prompt}
                />
              </div>
              <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                重新生成圖片
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal; 