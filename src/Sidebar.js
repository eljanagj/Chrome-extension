/* global chrome */
import React, { useState, useEffect, useCallback } from 'react';

function Sidebar() {
  const [files, setFiles] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState('root');
  const [folderHistory, setFolderHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [highlightedFileId, setHighlightedFileId] = useState(null);

  const getToken = useCallback(() => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('token', function(data) {
        if (data.token) {
          resolve(data.token);
        } else {
          reject('No token found');
        }
      });
    });
  }, []);

  const loadFiles = useCallback(async (folderId) => {
    setLoading(true);
    setError(null);

    const token = await getToken();
    if (!token) {
      setError("You must be signed in to view files.");
      setLoading(false);
      return;
    }

    fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+trashed=false`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.files) {
        setFiles(data.files);
      } else {
        console.warn("Unexpected API response:", data);
        setFiles([]);
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching files: ", error);
      setError("Error fetching files. Please try again later.");
      setLoading(false);
    });
  }, [getToken]);

  useEffect(() => {
    loadFiles(currentFolderId);
  }, [currentFolderId, loadFiles]);

  const handleFolderClick = (folderId) => {
    if (expandedFolders.has(folderId)) {
      setExpandedFolders(prev => new Set(prev).delete(folderId));
    } else {
      setExpandedFolders(prev => new Set(prev).add(folderId));
      setCurrentFolderId(folderId);
    }
  };

  const handleFileClick = (fileId, mimeType) => {
    setHighlightedFileId(fileId);
    if (mimeType === 'application/pdf') {
      window.open(`https://drive.google.com/file/d/${fileId}/preview`, '_self');
    } else if (mimeType === 'application/vnd.google-apps.document' || mimeType === 'application/vnd.google-apps.spreadsheet') {
      window.open(`https://docs.google.com/document/d/${fileId}/edit`, '_self');
    } else {
      window.open(`https://drive.google.com/file/d/${fileId}/view`, '_self');
    }
  };

  const renderFile = (file) => {
    const isHighlighted = file.id === highlightedFileId;
    return (
      <li 
        key={file.id} 
        onClick={() => file.mimeType === 'application/vnd.google-apps.folder' ? handleFolderClick(file.id) : handleFileClick(file.id, file.mimeType)}
        style={{ 
          cursor: 'pointer', 
          fontWeight: isHighlighted ? 'bold' : 'normal', 
          backgroundColor: isHighlighted ? '#e0e0e0' : 'transparent' 
        }}
      >
        {file.mimeType === 'application/vnd.google-apps.folder' ? "📁" : "📄"} {file.name}
      </li>
    );
  };

  return (
    <div className="sidebar">
      <h2>Drive Files</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {folderHistory.length > 0 && <button onClick={() => setFolderHistory(prevHistory => {
        const newHistory = [...prevHistory];
        const previousFolderId = newHistory.pop();
        setCurrentFolderId(previousFolderId || 'root');
        return newHistory;
      })}>Back</button>}
      <ul>
        {files.length === 0 && !loading && <p>No files or folders found.</p>}
        {files.map(file => (
          <>
            <li 
              key={file.id} 
              onClick={() => file.mimeType === 'application/vnd.google-apps.folder' ? handleFolderClick(file.id) : handleFileClick(file.id, file.mimeType)}
              style={{ 
                cursor: 'pointer', 
                fontWeight: file.id === highlightedFileId ? 'bold' : 'normal', 
                backgroundColor: file.id === highlightedFileId ? '#e0e0e0' : 'transparent' 
              }}
            >
              {file.mimeType === 'application/vnd.google-apps.folder' ? "📁" : "📄"} {file.name}
            </li>
            {expandedFolders.has(file.id) && file.mimeType === 'application/vnd.google-apps.folder' && (
              <ul style={{ paddingLeft: '20px' }}>
                {files.filter(subFile => subFile.parents && subFile.parents.includes(file.id)).map(renderFile)}
              </ul>
            )}
          </>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
