import React, { useState, useEffect, useCallback } from 'react';
import Replicate from 'replicate';
import { Brain, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useUser } from "@clerk/nextjs";
import JSZip from 'jszip';
import { UseFormReturn } from "react-hook-form";

interface ModelTrainerProps {
  form: UseFormReturn<any>;  // 或使用您的具體表單類型
}

const ModelTrainer = ({ form }: ModelTrainerProps) => {
const replicate = new Replicate();

  const { user } = useUser();
  const [images, setImages] = useState<File[]>([]);
  const [trainingStatus, setTrainingStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: true
  });

  const handleTrainModel = async () => {
    if (images.length === 0) {
      setError('請先上傳圖片');
      return;
    }

    try {
      setTrainingStatus('準備中...');
      setError(null);

      // 建立 FormData 來上傳圖片
      const formData = new FormData();
      const zip = new JSZip();
      images.forEach((image) => {
        zip.file(image.name, image);
      });
      const zipFile = await zip.generateAsync({ type: 'blob' });
      formData.append('zipFile', zipFile, 'images.zip');
      formData.append('userId', user?.id!);
      formData.append('modelName', form.getValues('name'));
      // 首先上傳圖片到伺服器
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('圖片上傳失敗');
      }

      const { urls } = await uploadResponse.json();

      console.log(urls);
      formData.append('urls', urls);
      const response = await fetch('/api/train', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('模型訓練請求失敗');
      }

      const { modelId, status } = await response.json();
      console.log(`Training started: ${status}`)
      console.log(`Training URL: https://replicate.com/p/${modelId}`)
      // 設定訓練狀態提示
      setTrainingStatus('模型訓練已開始，這可能需要超過30分鐘的時間... 系統會在訓練完成後發送email 通知您');

    } catch (err) {
      setError(err instanceof Error ? err.message : '訓練過程中發生錯誤');
      setTrainingStatus(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-4" size={32} />
        <p className="text-gray-600">
          {isDragActive
            ? '將圖片放在這裡...'
            : '拖放圖片到這裡，或點擊選擇檔案'}
        </p>
      </div>

      {images.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">已選擇的圖片 ({images.length})</h3>
          <div className="grid grid-cols-4 gap-2">
            {images.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`預覽 ${index + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
              </div>
            ))}
          </div>
        </div>
      )}

{/* disabled={images.length === 0 ||// !!trainingStatus} */}
      <button
        onClick={handleTrainModel}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 
          disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        開始訓練模型
      </button>

      {trainingStatus && (
        <div className="text-center mt-6">
          <Brain className="mx-auto mb-4 animate-pulse" size={64} />
          <h2 className="text-2xl font-bold mb-4">訓練進行中...</h2>
          <p className="mb-2">{trainingStatus}</p>
        </div>
      )}
      
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default ModelTrainer;