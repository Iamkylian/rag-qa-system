"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => formData.append("files", file));

    try {
      await axios.post("http://127.0.0.1:8000/add-file/", formData);
      //alert("Files uploaded successfully!");
      refreshFiles();
    } catch (error) {
      console.error("Error during upload:", error);
      alert("Error during upload.");
    }
  };

  const refreshFiles = async () => {
    setIsRefresh(true);
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/list-documents/");
      setFiles(response.data.documents || []);
    } catch (error) {
      console.error("Error while refreshing the file list:", error);
      alert("Error while refreshing the file list.");
    } finally {
      setLoading(false);
      setIsRefresh(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      await axios.post("http://127.0.0.1:8000/delete-document/", { doc_id: fileId });
      alert(`File ${fileId} deleted successfully!`);
      refreshFiles();
    } catch (error) {
      console.error("Error during deletion:", error);
      alert("Error during deletion.");
    }
  };

  const handleQuerySubmit = async () => {
    if (!query) return;

    setIsSubmit(true);
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/query/", { query });
      setResponse(res.data.response);
      setSources(res.data.sources || []);
    } catch (error) {
      console.error("Error during query:", error);
      alert("Error during query.");
    } finally {
      setLoading(false);
      setIsSubmit(false);
    }
  };

  useEffect(() => {
    refreshFiles();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8 border border-gray-200">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
          RAG Application
        </h1>

        {/* Upload Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">
            Upload Files
          </h2>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full p-2 border rounded mb-4 text-gray-500"
          />
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Upload
          </button>
        </div>

        {/* File List Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">
            Input File List
          </h2>
          <button
            onClick={refreshFiles}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
          >
            Refresh
          </button>
          {files.length > 0 ? (
            <ul className="list-disc pl-5">
              {files.map((file) => (
                <li key={file} className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 font-medium">{file}</span>
                  <button
                    onClick={() => handleDelete(file)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No files available.</p>
          )}

          {/* Loading button animation */}
          {loading && isRefresh && (
            <div className="mt-4 flex justify-center">
              <div className="loader border-t-transparent border-solid animate-spin rounded-full border-blue-500 border-4 h-8 w-8"></div>
            </div>
          )}

        </div>

        {/* Query Section */}
        <div>
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">
            Ask a Question
          </h2>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Write your question here"
            rows={4}
            className="w-full p-2 border rounded mb-4 text-gray-500"
          />
          <button
            onClick={handleQuerySubmit}
            disabled={loading} // Désactiver le bouton pendant le chargement
            className={`bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Submit
          </button>

          {/* Loading button animation */}
          {loading && isSubmit && (
            <div className="mt-4 flex justify-center">
              <div className="loader border-t-transparent border-solid animate-spin rounded-full border-blue-500 border-4 h-8 w-8"></div>
            </div>
          )}

          {/* Display Response */}
          {response && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-blue-500">Response:</h3>
              <p className="text-gray-700">{response}</p>

              {/* Display Sources */}
              {sources.length > 0 && (
                <>
                  <h4 className="text-lg font-semibold text-blue-500 mt-4">
                    Sources:
                  </h4>
                  <ul className="list-disc pl-5 text-gray-700">
                    {sources.map((source, index) => (
                      <li key={index}>{source}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
