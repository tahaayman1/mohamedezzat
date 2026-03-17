import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiHome, HiUser, HiAcademicCap, HiBriefcase, HiBadgeCheck,
  HiSparkles, HiGlobeAlt, HiLogout, HiPlus, HiPencil, HiTrash,
  HiSave, HiX, HiMenuAlt2, HiPhotograph, HiDocumentText, HiMail,
  HiEye, HiEyeOff, HiExclamationCircle,
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { usePersonalInfo, useCollection, useAdminCRUD, useFileUpload, useMessages, getFilePreviewUrl } from '../hooks/useAppwrite';

// Sidebar navigation items
const sidebarItems = [
  { id: 'personal', label: 'Personal Info', icon: HiUser },
  { id: 'education', label: 'Education', icon: HiAcademicCap },
  { id: 'experiences', label: 'Experiences', icon: HiBriefcase },
  { id: 'certificates', label: 'Certificates', icon: HiBadgeCheck },
  { id: 'skills', label: 'Skills', icon: HiSparkles },
  { id: 'languages', label: 'Languages', icon: HiGlobeAlt },
  { id: 'messages', label: 'Messages', icon: HiMail },
  { id: 'files', label: 'Files Upload', icon: HiPhotograph },
];

export default function AdminDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
    }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-400/30 border-t-primary-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-900 border-r border-dark-700/50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo area */}
        <div className="p-6 border-b border-dark-700/50">
          <h1 className="text-xl font-heading font-bold text-gold-gradient">Admin Panel</h1>
          <p className="text-dark-400 text-xs mt-1">Portfolio Management</p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-primary-400/10 text-primary-400 border-l-2 border-primary-400'
                  : 'text-dark-300 hover:bg-dark-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-dark-700/50 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-dark-300 hover:bg-dark-800 hover:text-white transition-all"
          >
            <HiHome size={20} />
            View Portfolio
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
          >
            <HiLogout size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-dark-900/50 backdrop-blur-sm border-b border-dark-700/50 px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-dark-300 hover:text-white"
            >
              <HiMenuAlt2 size={24} />
            </button>
            <h2 className="text-lg font-semibold text-white capitalize">
              {sidebarItems.find((i) => i.id === activeTab)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-dark-400 hidden sm:block">{user.email}</span>
            <div className="w-8 h-8 rounded-full bg-primary-400/20 flex items-center justify-center">
              <span className="text-primary-400 text-sm font-bold">
                {user.name?.[0] || user.email?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'personal' && <PersonalInfoEditor />}
              {activeTab === 'education' && <CollectionEditor collectionKey="EDUCATION" fields={educationFields} />}
              {activeTab === 'experiences' && <CollectionEditor collectionKey="EXPERIENCES" fields={experienceFields} />}
              {activeTab === 'certificates' && <CollectionEditor collectionKey="CERTIFICATES" fields={certificateFields} />}
              {activeTab === 'skills' && <CollectionEditor collectionKey="SKILLS" fields={skillFields} />}
              {activeTab === 'languages' && <CollectionEditor collectionKey="LANGUAGES" fields={languageFields} />}
              {activeTab === 'messages' && <MessagesViewer />}
              {activeTab === 'files' && <FilesUploader />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ==========================================
// Field definitions for each collection
// ==========================================

const educationFields = [
  { key: 'institution', label: 'Institution', type: 'text', placeholder: 'University name' },
  { key: 'degree', label: 'Degree', type: 'text', placeholder: 'Very Good' },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Description of your studies' },
  { key: 'order', label: 'Order', type: 'number', placeholder: '0' },
];

const experienceFields = [
  { key: 'title', label: 'Job Title', type: 'text', placeholder: 'Business Consultant' },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe your role...' },
  { key: 'period', label: 'Period', type: 'text', placeholder: '2024 - Present' },
  { key: 'order', label: 'Order', type: 'number', placeholder: '0' },
];

const certificateFields = [
  { key: 'name', label: 'Certificate Name', type: 'text', placeholder: 'Certificate title' },
  { key: 'institution', label: 'Institution', type: 'text', placeholder: 'Issuing institution' },
  { key: 'order', label: 'Order', type: 'number', placeholder: '0' },
];

const skillFields = [
  { key: 'name', label: 'Skill Name', type: 'text', placeholder: 'Business Strategy' },
  { key: 'level', label: 'Level (%)', type: 'number', placeholder: '90' },
  { key: 'order', label: 'Order', type: 'number', placeholder: '0' },
];

const languageFields = [
  { key: 'name', label: 'Language', type: 'text', placeholder: 'Arabic' },
  { key: 'proficiency', label: 'Proficiency', type: 'select', options: ['Native', 'Professional', 'Intermediate', 'Beginner'] },
  { key: 'level', label: 'Level (%)', type: 'number', placeholder: '100' },
  { key: 'order', label: 'Order', type: 'number', placeholder: '0' },
];

// ==========================================
// Personal Info Editor
// ==========================================

function PersonalInfoEditor() {
  const { data, loading, refetch } = usePersonalInfo();
  const { createDocument, updateDocument } = useAdminCRUD('PERSONAL');
  const { uploadFile } = useFileUpload();
  const [form, setForm] = useState({
    name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    photo_id: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || '',
        title: data.title || '',
        bio: data.bio || '',
        email: data.email || '',
        phone: data.phone || '',
        photo_id: data.photo_id || '',
      });
    }
  }, [data]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setMessage('');
    const result = await uploadFile(file);
    if (result.success) {
      setForm((prev) => ({ ...prev, photo_id: result.data.$id }));
      setMessage('Photo uploaded! Click Save to apply.');
    } else {
      setMessage(`Error uploading: ${result.error}`);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    let result;
    if (data?.$id) {
      result = await updateDocument(data.$id, form);
    } else {
      result = await createDocument(form);
    }

    if (result.success) {
      setMessage('Personal info saved successfully!');
      refetch();
    } else {
      setMessage(`Error: ${result.error}`);
    }
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="max-w-2xl">
      <div className="admin-card space-y-5">
        <h3 className="text-lg font-semibold text-white mb-4">Edit Personal Information</h3>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="admin-input"
              placeholder="Mohamed Ezzat"
            />
          </div>
          <div>
            <label className="admin-label">Professional Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="admin-input"
              placeholder="Business Development Consultant"
            />
          </div>
        </div>

        <div>
          <label className="admin-label">Bio</label>
          <textarea
            rows={4}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="admin-input resize-none"
            placeholder="Tell about yourself..."
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="admin-input"
              placeholder="ezzatm768@gmail.com"
            />
          </div>
          <div>
            <label className="admin-label">Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="admin-input"
              placeholder="+201507623769"
            />
          </div>
        </div>

        {/* Profile Photo Upload */}
        <div>
          <label className="admin-label">Profile Photo</label>
          <div className="flex items-center gap-4">
            {form.photo_id && (
              <img
                src={getFilePreviewUrl(form.photo_id)}
                alt="Profile preview"
                className="w-16 h-16 rounded-xl object-cover border border-white/10"
              />
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploading}
                className="block w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white/80 hover:file:bg-white/20 file:cursor-pointer file:transition-colors"
              />
              {uploading && (
                <div className="flex items-center gap-2 mt-2 text-white/50 text-sm">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                  Uploading...
                </div>
              )}
              {form.photo_id && (
                <p className="text-white/30 text-xs mt-1">ID: {form.photo_id}</p>
              )}
            </div>
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.startsWith('Error') 
              ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
              : 'bg-green-500/10 text-green-400 border border-green-500/30'
          }`}>
            {message}
          </div>
        )}

        <button onClick={handleSave} disabled={saving} className="admin-btn flex items-center gap-2">
          <HiSave size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

// ==========================================
// Generic Collection Editor (CRUD)
// ==========================================

function CollectionEditor({ collectionKey, fields }) {
  const { data, loading, refetch } = useCollection(collectionKey);
  const { createDocument, updateDocument, deleteDocument } = useAdminCRUD(collectionKey);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const resetForm = () => {
    const empty = {};
    fields.forEach((f) => { empty[f.key] = ''; });
    setForm(empty);
  };

  const startEdit = (item) => {
    setEditingId(item.$id);
    const formData = {};
    fields.forEach((f) => { formData[f.key] = item[f.key] || ''; });
    setForm(formData);
    setShowNew(false);
  };

  const startNew = () => {
    resetForm();
    setEditingId(null);
    setShowNew(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowNew(false);
    resetForm();
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    // Convert number fields
    const processedForm = { ...form };
    fields.forEach((f) => {
      if (f.type === 'number') {
        processedForm[f.key] = parseInt(processedForm[f.key], 10) || 0;
      }
    });

    let result;
    if (editingId) {
      result = await updateDocument(editingId, processedForm);
    } else {
      result = await createDocument(processedForm);
    }

    if (result.success) {
      setMessage('Saved successfully!');
      cancelEdit();
      refetch();
    } else {
      setMessage(`Error: ${result.error}`);
    }
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    const result = await deleteDocument(id);
    if (result.success) {
      setMessage('Deleted successfully!');
      refetch();
    } else {
      setMessage(`Error: ${result.error}`);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <LoadingState />;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <p className="text-dark-300 text-sm">{data.length} item(s)</p>
        <button onClick={startNew} className="admin-btn flex items-center gap-2 text-sm">
          <HiPlus size={18} />
          Add New
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.startsWith('Error') 
            ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
            : 'bg-green-500/10 text-green-400 border border-green-500/30'
        }`}>
          {message}
        </div>
      )}

      {/* New item form */}
      <AnimatePresence>
        {showNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="admin-card border-primary-400/30">
              <h4 className="text-white font-semibold mb-4">Add New Item</h4>
              <FormFields fields={fields} form={form} setForm={setForm} />
              <div className="flex gap-3 mt-5">
                <button onClick={handleSave} disabled={saving} className="admin-btn flex items-center gap-2 text-sm">
                  <HiSave size={16} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={cancelEdit} className="px-4 py-2 text-dark-300 hover:text-white transition-colors text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List of items */}
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.$id} className="admin-card">
            {editingId === item.$id ? (
              /* Edit mode */
              <div>
                <FormFields fields={fields} form={form} setForm={setForm} />
                <div className="flex gap-3 mt-5">
                  <button onClick={handleSave} disabled={saving} className="admin-btn flex items-center gap-2 text-sm">
                    <HiSave size={16} />
                    {saving ? 'Saving...' : 'Update'}
                  </button>
                  <button onClick={cancelEdit} className="px-4 py-2 text-dark-300 hover:text-white transition-colors text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* View mode */
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {fields.map((field) => (
                    <div key={field.key} className="mb-1">
                      <span className="text-dark-400 text-xs uppercase tracking-wider">{field.label}: </span>
                      <span className="text-white text-sm">
                        {String(item[field.key] || '-')}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-2 text-dark-300 hover:text-primary-400 hover:bg-primary-400/10 rounded-lg transition-all"
                    title="Edit"
                  >
                    <HiPencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.$id)}
                    className="p-2 text-dark-300 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    title="Delete"
                  >
                    <HiTrash size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// Form Fields Component
// ==========================================

function FormFields({ fields, form, setForm }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {fields.map((field) => (
        <div key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
          <label className="admin-label">{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea
              rows={3}
              value={form[field.key] || ''}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              className="admin-input resize-none"
              placeholder={field.placeholder}
            />
          ) : field.type === 'select' ? (
            <select
              value={form[field.key] || ''}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              className="admin-input"
            >
              <option value="">Select...</option>
              {field.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              value={form[field.key] || ''}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              className="admin-input"
              placeholder={field.placeholder}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ==========================================
// Files Uploader
// ==========================================

function FilesUploader() {
  const { data: personalData, loading: personalLoading, refetch } = usePersonalInfo();
  const { updateDocument, createDocument } = useAdminCRUD('PERSONAL');
  const { uploadFile } = useFileUpload();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [message, setMessage] = useState('');

  const saveFileId = async (field, fileId) => {
    let result;
    if (personalData?.$id) {
      result = await updateDocument(personalData.$id, { [field]: fileId });
    } else {
      result = await createDocument({ [field]: fileId });
    }
    if (result.success) {
      refetch();
    }
    return result;
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPhoto(true);
    setMessage('');

    const uploadResult = await uploadFile(file);
    if (!uploadResult.success) {
      setMessage(`Error uploading photo: ${uploadResult.error}`);
      setUploadingPhoto(false);
      return;
    }

    const saveResult = await saveFileId('photo_id', uploadResult.data.$id);
    if (saveResult.success) {
      setMessage('Profile photo uploaded and saved successfully!');
    } else {
      setMessage(`Photo uploaded but failed to save: ${saveResult.error}`);
    }
    setUploadingPhoto(false);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingCV(true);
    setMessage('');

    const uploadResult = await uploadFile(file);
    if (!uploadResult.success) {
      setMessage(`Error uploading CV: ${uploadResult.error}`);
      setUploadingCV(false);
      return;
    }

    const saveResult = await saveFileId('cv_id', uploadResult.data.$id);
    if (saveResult.success) {
      setMessage('CV uploaded and saved successfully!');
    } else {
      setMessage(`CV uploaded but failed to save: ${saveResult.error}`);
    }
    setUploadingCV(false);
    setTimeout(() => setMessage(''), 4000);
  };

  if (personalLoading) {
    return <LoadingState />;
  }

  const currentPhotoUrl = personalData?.photo_id ? getFilePreviewUrl(personalData.photo_id) : null;
  const currentCVUrl = personalData?.cv_id ? getFilePreviewUrl(personalData.cv_id) : null;

  return (
    <div className="max-w-2xl space-y-6">
      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.startsWith('Error') || message.includes('failed')
            ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
            : 'bg-green-500/10 text-green-400 border border-green-500/30'
        }`}>
          {message}
        </div>
      )}

      {/* Profile Image Upload */}
      <div className="admin-card">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary-400/10 flex items-center justify-center">
            <HiPhotograph className="text-primary-400" size={24} />
          </div>
          <div>
            <h3 className="text-white font-semibold">Profile Image</h3>
            <p className="text-dark-400 text-sm">Upload a new profile photo (JPG, PNG)</p>
          </div>
        </div>

        {/* Current photo preview */}
        {currentPhotoUrl && (
          <div className="mb-4 flex items-center gap-3">
            <img
              src={currentPhotoUrl}
              alt="Current profile"
              className="w-20 h-20 rounded-xl object-cover border border-white/10"
            />
            <div>
              <p className="text-white/60 text-sm">Current photo</p>
              <p className="text-white/30 text-xs mt-1">ID: {personalData.photo_id}</p>
            </div>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          disabled={uploadingPhoto || uploadingCV}
          className="block w-full text-sm text-dark-300 file:mr-4 file:py-2.5 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-400 file:text-dark-900 hover:file:bg-primary-300 file:cursor-pointer file:transition-colors"
        />
        {uploadingPhoto && (
          <div className="flex items-center gap-2 mt-3 text-primary-400">
            <div className="w-4 h-4 border-2 border-primary-400/30 border-t-primary-400 rounded-full animate-spin" />
            <span className="text-sm">Uploading and saving photo...</span>
          </div>
        )}
      </div>

      {/* CV Upload */}
      <div className="admin-card">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary-400/10 flex items-center justify-center">
            <HiDocumentText className="text-primary-400" size={24} />
          </div>
          <div>
            <h3 className="text-white font-semibold">CV / Resume</h3>
            <p className="text-dark-400 text-sm">Upload an updated CV (PDF)</p>
          </div>
        </div>

        {/* Current CV info */}
        {currentCVUrl && (
          <div className="mb-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <HiDocumentText className="text-white/60" size={24} />
            </div>
            <div>
              <a
                href={currentCVUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 text-sm hover:underline"
              >
                View current CV
              </a>
              <p className="text-white/30 text-xs mt-1">ID: {personalData.cv_id}</p>
            </div>
          </div>
        )}

        <input
          type="file"
          accept=".pdf"
          onChange={handleCVUpload}
          disabled={uploadingPhoto || uploadingCV}
          className="block w-full text-sm text-dark-300 file:mr-4 file:py-2.5 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-400 file:text-dark-900 hover:file:bg-primary-300 file:cursor-pointer file:transition-colors"
        />
        {uploadingCV && (
          <div className="flex items-center gap-2 mt-3 text-primary-400">
            <div className="w-4 h-4 border-2 border-primary-400/30 border-t-primary-400 rounded-full animate-spin" />
            <span className="text-sm">Uploading and saving CV...</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// Messages Viewer (Contact Form Submissions)
// ==========================================

function MessagesViewer() {
  const { data: messages, loading, error, markAsRead, deleteMessage } = useMessages();
  const [deletingId, setDeletingId] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const handleToggleRead = async (msg) => {
    const result = await markAsRead(msg.$id, !msg.read);
    if (result.success) {
      setActionMessage(msg.read ? 'Marked as unread' : 'Marked as read');
    } else {
      setActionMessage(`Error: ${result.error}`);
    }
    setTimeout(() => setActionMessage(''), 2000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    setDeletingId(id);
    const result = await deleteMessage(id);
    if (result.success) {
      setActionMessage('Message deleted');
    } else {
      setActionMessage(`Error: ${result.error}`);
    }
    setDeletingId(null);
    setTimeout(() => setActionMessage(''), 2000);
  };

  if (loading) return <LoadingState />;

  if (error) {
    return (
      <div className="max-w-4xl">
        <div className="admin-card border-red-500/30">
          <div className="flex items-center gap-3 text-red-400">
            <HiExclamationCircle size={24} />
            <div>
              <h3 className="font-semibold">Failed to load messages</h3>
              <p className="text-sm text-red-400/70 mt-1">
                Make sure the "messages" collection exists in Appwrite. Run the setup script:
              </p>
              <code className="block text-xs mt-2 p-2 bg-dark-800 rounded">
                node scripts/create-messages-collection.mjs YOUR_API_KEY
              </code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-dark-300 text-sm">
            {messages.length} message(s)
          </p>
          {unreadCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/20">
              {unreadCount} unread
            </span>
          )}
        </div>
      </div>

      {actionMessage && (
        <div className={`p-3 rounded-lg text-sm ${
          actionMessage.startsWith('Error')
            ? 'bg-red-500/10 text-red-400 border border-red-500/30'
            : 'bg-green-500/10 text-green-400 border border-green-500/30'
        }`}>
          {actionMessage}
        </div>
      )}

      {messages.length === 0 ? (
        <div className="admin-card text-center py-12">
          <HiMail className="mx-auto text-dark-500 mb-3" size={40} />
          <p className="text-dark-400 text-sm">No messages yet</p>
          <p className="text-dark-500 text-xs mt-1">Messages from the contact form will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.$id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`admin-card relative ${!msg.read ? 'border-l-2 border-l-blue-400' : ''}`}
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-white font-semibold text-sm truncate">{msg.name}</h4>
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-dark-400 text-xs truncate">{msg.email}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleToggleRead(msg)}
                    className="p-2 text-dark-300 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                    title={msg.read ? 'Mark as unread' : 'Mark as read'}
                  >
                    {msg.read ? <HiEyeOff size={16} /> : <HiEye size={16} />}
                  </button>
                  <button
                    onClick={() => handleDelete(msg.$id)}
                    disabled={deletingId === msg.$id}
                    className="p-2 text-dark-300 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all disabled:opacity-50"
                    title="Delete"
                  >
                    <HiTrash size={16} />
                  </button>
                </div>
              </div>

              {/* Subject */}
              <p className="text-white/70 text-sm font-medium mb-2">{msg.subject}</p>

              {/* Message body */}
              <p className="text-dark-300 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>

              {/* Timestamp */}
              <p className="text-dark-500 text-xs mt-3">
                {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'Unknown date'}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// Loading State
// ==========================================

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary-400/30 border-t-primary-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-dark-400 text-sm">Loading data...</p>
      </div>
    </div>
  );
}
