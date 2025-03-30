import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface GeneticAnalysis {
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

export const updateGeneticData = async (data: FormData): Promise<void> => {
  await axios.post(`${API_URL}/genetics/upload`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getGeneticAnalysis = async (): Promise<GeneticAnalysis> => {
  const response = await axios.get(`${API_URL}/genetics/analysis`);
  return response.data;
};

export const getExerciseRecommendations = async (): Promise<string[]> => {
  const response = await axios.get(`${API_URL}/genetics/exercise-recommendations`);
  return response.data;
};

export const getNutritionRecommendations = async (): Promise<string[]> => {
  const response = await axios.get(`${API_URL}/genetics/nutrition-recommendations`);
  return response.data;
}; 