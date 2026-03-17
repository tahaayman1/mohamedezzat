import { useState, useEffect, useCallback } from 'react';
import { databases, storage, ID, Query } from '../lib/appwrite';
import { DATABASE_ID, BUCKET_ID, COLLECTIONS, DEFAULT_DATA } from '../lib/appwriteConfig';

const isAppwriteConfigured = () => {
  const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
  return projectId && projectId !== 'your_project_id_here';
};

export function getFilePreviewUrl(fileId) {
  if (!fileId) return null;
  try {
    return storage.getFileView(BUCKET_ID, fileId);
  } catch {
    return null;
  }
}

export function getFileDownloadUrl(fileId) {
  if (!fileId) return null;
  try {
    return storage.getFileDownload(BUCKET_ID, fileId);
  } catch {
    return null;
  }
}

export function useCollection(collectionKey) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const collectionId = COLLECTIONS[collectionKey];
  const defaultKey = collectionKey.toLowerCase();

  const fetchData = useCallback(async () => {
    if (!isAppwriteConfigured()) {
      const defaults = DEFAULT_DATA[
        defaultKey === 'personal' ? 'personal' :
        defaultKey === 'experiences' ? 'experiences' :
        defaultKey
      ];
      setData(Array.isArray(defaults) ? defaults : [defaults]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await databases.listDocuments(
        DATABASE_ID,
        collectionId,
        [Query.orderAsc('order')]
      );
      if (response.documents.length > 0) {
        setData(response.documents);
      } else {
        const defaults = DEFAULT_DATA[defaultKey];
        setData(Array.isArray(defaults) ? defaults : [defaults]);
      }
    } catch (err) {
      console.warn(`Failed to fetch ${collectionKey}, using defaults:`, err.message);
      const defaults = DEFAULT_DATA[defaultKey];
      setData(Array.isArray(defaults) ? defaults : [defaults]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [collectionId, collectionKey, defaultKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function usePersonalInfo() {
  const [data, setData] = useState(DEFAULT_DATA.personal);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!isAppwriteConfigured()) {
      setData(DEFAULT_DATA.personal);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PERSONAL
      );
      if (response.documents.length > 0) {
        setData(response.documents[0]);
      }
    } catch (err) {
      console.warn('Failed to fetch personal info, using defaults:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useAdminCRUD(collectionKey) {
  const collectionId = COLLECTIONS[collectionKey];

  const createDocument = async (data) => {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        collectionId,
        ID.unique(),
        data
      );
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateDocument = async (documentId, data) => {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        collectionId,
        documentId,
        data
      );
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteDocument = async (documentId) => {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        collectionId,
        documentId
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return { createDocument, updateDocument, deleteDocument };
}

export function useFileUpload() {
  const uploadFile = async (file) => {
    try {
      const response = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        file
      );
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getFilePreview = (fileId) => {
    return storage.getFilePreview(BUCKET_ID, fileId);
  };

  const getFileDownload = (fileId) => {
    return storage.getFileDownload(BUCKET_ID, fileId);
  };

  const deleteFile = async (fileId) => {
    try {
      await storage.deleteFile(BUCKET_ID, fileId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return { uploadFile, getFilePreview, getFileDownload, deleteFile };
}

export function useSubmitMessage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitMessage = async ({ name, email, subject, message }) => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.MESSAGES,
        ID.unique(),
        {
          name,
          email,
          subject,
          message,
          read: false,
          createdAt: new Date().toISOString(),
        }
      );
      setSuccess(true);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return { submitMessage, submitting, error, success, reset };
}

export function useMessages() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.MESSAGES,
        [Query.orderDesc('createdAt')]
      );
      setData(response.documents);
    } catch (err) {
      console.warn('Failed to fetch messages:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const markAsRead = async (documentId, read = true) => {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.MESSAGES,
        documentId,
        { read }
      );
      await fetchMessages();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteMessage = async (documentId) => {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.MESSAGES,
        documentId
      );
      await fetchMessages();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return { data, loading, error, refetch: fetchMessages, markAsRead, deleteMessage };
}
