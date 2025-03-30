import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import { updateGeneticData, getGeneticAnalysis } from '../api/genetics';
import { BeakerIcon, LightBulbIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface GeneticAnalysis {
  metabolismType: string;
  exerciseResponse: string;
  nutritionNeeds: string[];
  riskFactors: string[];
  recommendations: {
    exercise: string[];
    nutrition: string[];
    supplements: string[];
  };
}

const Genetics: React.FC = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');

  const { data: analysis, isLoading: isAnalysisLoading } = useQuery<GeneticAnalysis>(
    ['geneticAnalysis', user?.id],
    () => getGeneticAnalysis(),
    {
      enabled: !!user?.id,
    }
  );

  const uploadMutation = useMutation(
    (data: FormData) => updateGeneticData(data),
    {
      onSuccess: () => {
        setFile(null);
        setUploadError('');
      },
      onError: (error: any) => {
        setUploadError(error.response?.data?.message || '上传失败，请重试');
      },
    }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setUploadError('');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('geneticData', file);
    uploadMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            上传基因数据
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>上传您的基因检测数据文件，我们将为您提供个性化的健身和营养建议。</p>
          </div>
          <form className="mt-5 sm:flex sm:items-center" onSubmit={handleUpload}>
            <div className="w-full sm:max-w-xs">
              <label htmlFor="genetic-file" className="sr-only">
                选择文件
              </label>
              <input
                type="file"
                id="genetic-file"
                accept=".txt,.csv,.json"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
            <button
              type="submit"
              disabled={!file || uploadMutation.isLoading}
              className="mt-3 sm:mt-0 sm:ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
            >
              {uploadMutation.isLoading ? '上传中...' : '上传'}
            </button>
          </form>
          {uploadError && (
            <p className="mt-2 text-sm text-red-600">{uploadError}</p>
          )}
        </div>
      </div>

      {isAnalysisLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : analysis ? (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              基因分析结果
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-indigo-50 rounded-lg p-6">
                <div className="flex items-center">
                  <BeakerIcon className="h-8 w-8 text-indigo-600" />
                  <h4 className="ml-3 text-lg font-medium text-gray-900">
                    代谢类型
                  </h4>
                </div>
                <p className="mt-4 text-gray-600">{analysis.metabolismType}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center">
                  <LightBulbIcon className="h-8 w-8 text-green-600" />
                  <h4 className="ml-3 text-lg font-medium text-gray-900">
                    运动反应
                  </h4>
                </div>
                <p className="mt-4 text-gray-600">{analysis.exerciseResponse}</p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-6">
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-8 w-8 text-yellow-600" />
                  <h4 className="ml-3 text-lg font-medium text-gray-900">
                    营养需求
                  </h4>
                </div>
                <ul className="mt-4 space-y-2">
                  {analysis.nutritionNeeds.map((need, index) => (
                    <li key={index} className="text-gray-600">
                      • {need}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-medium text-gray-900">个性化建议</h4>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <h5 className="font-medium text-gray-900">运动建议</h5>
                  <ul className="mt-2 space-y-2">
                    {analysis.recommendations.exercise.map((rec, index) => (
                      <li key={index} className="text-gray-600">
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">营养建议</h5>
                  <ul className="mt-2 space-y-2">
                    {analysis.recommendations.nutrition.map((rec, index) => (
                      <li key={index} className="text-gray-600">
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">补充剂建议</h5>
                  <ul className="mt-2 space-y-2">
                    {analysis.recommendations.supplements.map((rec, index) => (
                      <li key={index} className="text-gray-600">
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Genetics; 