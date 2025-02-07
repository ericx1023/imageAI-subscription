import React, { useState, useEffect, useCallback, useRef } from 'react';
import Replicate from 'replicate';
import { Brain, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useUser } from "@clerk/nextjs";
import JSZip from 'jszip';
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner"
import { isValidModelName, isValidUrl, formatModelName } from '@/utils/validations/modelValidators';
interface ModelTrainerProps {
  form: UseFormReturn<any>;  // 或使用您的具體表單類型
  onCreditsUpdate: (credits: number) => void;
}

const ModelTrainer = ({ form, onCreditsUpdate }: ModelTrainerProps) => {
const replicate = new Replicate();

  const { user } = useUser();
  const [images, setImages] = useState<File[]>([]);
  const [trainingStatus, setTrainingStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modelId, setModelId] = useState<string | null>(null);
  const [modelStatus, setModelStatus] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  const checkModelStatus = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/train/check-status?modelId=${id}`);
      if (!response.ok) throw new Error('檢查狀態失敗');
      
      const data = await response.json();
      
      if (data.status === 'succeeded' || data.status === 'failed') {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        if (data.status === 'succeeded') {
          setTrainingStatus('模型訓練完成！');
          toast.success('模型訓練完成！');
        } else {
          setTrainingStatus('模型訓練失敗');
          toast.error('模型訓練失敗');
        }
      }
      if(data.status === 'processing') {
        setModelStatus('模型訓練中..., 過程可能需要30分鐘以上，訓練結束後會發送email通知您');
      }
    } catch (error) {
      console.error('檢查模型狀態時發生錯誤:', error);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleTrainModel = async () => {
    if (images.length === 0) {
      setError('請先上傳圖片');
      return;
    }

    try {
      setIsLoading(true);
      setTrainingStatus('準備中...');
      setError(null);

      const trainingData = form.getValues();
      const basePrompt = `a photo of a ${trainingData.ethnicity} ${trainingData.age} year old ${trainingData.photoType} with ${trainingData.eyeColor} eyes`;
      // 建立 FormData 來上傳圖片
      const formData = new FormData();
      const zip = new JSZip();
      images.forEach((image) => {
        zip.file(image.name, image);
      });
      const zipFile = await zip.generateAsync({ type: 'blob' });
      formData.append('zipFile', zipFile, 'images.zip');
      formData.append('userId', user?.id!);
      formData.append('modelName', formatModelName(form.getValues('modelName')));
      trainingData.userId = user?.id!;
      trainingData.modelName = formatModelName(form.getValues('modelName'));
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });


      if (!uploadResponse.ok) {
        throw new Error('圖片上傳失敗');
      }

      const { urls } = await uploadResponse.json();
      const signedUrl = urls[0].data.signedUrl;
      trainingData.signedUrl = signedUrl;
      trainingData.basePrompt = basePrompt;
      const response = await fetch('/api/train',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
  
          body: JSON.stringify(trainingData)
        }
      );

      if (!response.ok) {
        toast('模型訓練請求失敗', {
          description: response.statusText
        })
        throw new Error('模型訓練請求失敗');
      }
      else {
        const { modelId, status, remainingCredits } = await response.json();
        setModelId(modelId);
        setTrainingStatus('模型訓練已開始，正在監控進度...');
        intervalRef.current = setInterval(() => checkModelStatus(modelId), 30000);
        checkModelStatus(modelId);
        
        // 更新父組件中的點數
        onCreditsUpdate(remainingCredits);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '訓練過程中發生錯誤');
      setTrainingStatus(null);
      setIsLoading(false);
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
        disabled={images.length === 0 || isLoading || !!trainingStatus}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 
          disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isLoading ? '訓練中...' : '開始訓練模型'}
      </button>

      {trainingStatus && (
        <div className="text-center mt-6">
          <Brain className="mx-auto mb-4 animate-pulse" size={64} />
          <h2 className="text-2xl font-bold mb-4">訓練進行中...</h2>
          <p className="mb-2">{trainingStatus}</p>
          {modelStatus && (
            <p className="text-sm text-gray-600">狀態: {modelStatus}</p>
          )}
        </div>
      )}
      
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default ModelTrainer;