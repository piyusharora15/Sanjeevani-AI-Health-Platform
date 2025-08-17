import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../context/AuthContext';
import { analyzeDocument } from '../api/analysisApi';
import { UploadCloud, FileText, BrainCircuit } from 'lucide-react';

const AnalysisPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();

  const onDrop = useCallback(acceptedFiles => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setAnalysisResult(null); // Reset previous results
    setError('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
    multiple: false,
  });

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a file first.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const result = await analyzeDocument(file, userInfo.token);
      setAnalysisResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800">Document Analyzer</h1>
          <p className="text-gray-600 mt-2">Upload a prescription or lab report to get a simple explanation.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload and Preview Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}>
              <input {...getInputProps()} />
              <UploadCloud size={48} className="mx-auto text-gray-400 mb-4" />
              {isDragActive ? (
                <p className="text-blue-600 font-semibold">Drop the file here ...</p>
              ) : (
                <p className="text-gray-500">Drag & drop an image here, or click to select a file</p>
              )}
            </div>
            {preview && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Preview:</h3>
                <img src={preview} alt="Document preview" className="rounded-lg max-h-64 w-auto mx-auto shadow-md" />
              </div>
            )}
            <button onClick={handleAnalyze} disabled={!file || isLoading} className="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition duration-300">
              {isLoading ? 'Analyzing...' : 'Analyze Document'}
            </button>
            {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
          </div>

          {/* Analysis Result Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Analysis Result</h2>
            {isLoading ? (
              <div className="text-center py-10">
                <BrainCircuit size={48} className="mx-auto text-blue-500 animate-pulse" />
                <p className="mt-4 text-gray-600">Our AI is analyzing your document... Please wait.</p>
              </div>
            ) : analysisResult ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg flex items-center mb-2"><FileText size={20} className="mr-2 text-blue-600" /> Simplified Explanation</h3>
                  <p className="text-gray-700 bg-slate-50 p-4 rounded-md whitespace-pre-wrap">{analysisResult.simplifiedText}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg flex items-center mb-2"><FileText size={20} className="mr-2 text-blue-600" /> Extracted Text</h3>
                  <p className="text-gray-500 text-sm bg-slate-50 p-4 rounded-md whitespace-pre-wrap h-48 overflow-y-auto">{analysisResult.originalText}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p>Your analysis will appear here after you upload a document.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;