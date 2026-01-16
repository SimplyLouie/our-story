
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteContent, RSVP, RSVPStatus, MeetingNote, ChecklistItem } from '../types';
import { storageService } from '../firebase-storage';

interface AdminPanelProps {
  content: SiteContent;
  onUpdateContent: (content: SiteContent) => void;
  rsvps: RSVP[];
  notes: MeetingNote[];
  onAddNote: (content: string) => void;
  onDeleteNote: (id: string) => void;
  onSendReminder: (rsvpId: string) => void;
  onBatchReminders: (ids: string[]) => void;
  onDeleteRSVP: (id: string) => void;
  guestbookEntries: any[];
  onDeleteGuestbookEntry: (id: string) => void;
  onClose: () => void;
}

type SortOption = 'name-asc' | 'name-desc' | 'recent' | 'status';
type StatusFilter = 'all' | RSVPStatus;

const SectionHeader = ({ icon, title, description }: { icon: string, title: string, description: string }) => (
  <div className="mb-6 flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border-l-4 border-gold shadow-sm">
    <div className="text-gold text-2xl mt-1"><i className={`fa-solid ${icon}`}></i></div>
    <div>
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800 font-body">{title}</h3>
      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>
    </div>
  </div>
);

const InputField = ({ label, value, onChange, placeholder }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] uppercase font-bold text-gray-500 font-body">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="w-full border border-gray-200 p-4 rounded-xl bg-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-gray-900 shadow-sm"
      placeholder={placeholder}
    />
  </div>
);

const AdminPanel: React.FC<AdminPanelProps> = ({
  content, onUpdateContent, rsvps, notes, onAddNote, onDeleteNote, onSendReminder, onBatchReminders, onDeleteRSVP, guestbookEntries, onDeleteGuestbookEntry, onClose
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'guests' | 'lists' | 'notes' | 'guestbook'>('content');
  const [newNote, setNewNote] = useState('');
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; field: keyof SiteContent; index: number; itemName: string } | null>(null);
  const [urlEditModal, setUrlEditModal] = useState<{ show: boolean; index: number; currentUrl: string; newUrl: string } | null>(null);
  const [emailModal, setEmailModal] = useState<{ show: boolean; recipients: RSVP[]; subject: string; message: string } | null>(null);

  // Guest list optimization states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [selectedGuests, setSelectedGuests] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Image upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  // Memoized statistics
  const stats = useMemo(() => {
    const totalGuests = rsvps.reduce((acc, r) => acc + (r.status === RSVPStatus.ATTENDING ? (1 + (r.plusOne ? 1 : 0)) : 0), 0);
    const attendingCount = rsvps.filter(r => r.status === RSVPStatus.ATTENDING).length;
    const declinedCount = rsvps.filter(r => r.status === RSVPStatus.NOT_ATTENDING).length;
    const pendingCount = rsvps.filter(r => r.status === RSVPStatus.UNDECIDED).length;
    const plusOneCount = rsvps.filter(r => r.status === RSVPStatus.ATTENDING && r.plusOne).length;

    return { totalGuests, attendingCount, declinedCount, pendingCount, plusOneCount };
  }, [rsvps]);

  // Filtered and sorted guests
  const filteredGuests = useMemo(() => {
    let filtered = rsvps.filter(rsvp => {
      const matchesSearch = rsvp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rsvp.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      const matchesStatus = statusFilter === 'all' || rsvp.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'recent': return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime();
        case 'status': {
          const statusOrder = { [RSVPStatus.ATTENDING]: 0, [RSVPStatus.UNDECIDED]: 1, [RSVPStatus.NOT_ATTENDING]: 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        }
        default: return 0;
      }
    });

    return filtered;
  }, [rsvps, searchTerm, statusFilter, sortBy]);

  // Toast notification
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Export to CSV
  const exportToCSV = useCallback(() => {
    const headers = ['Name', 'Email', 'Status', 'Plus One', 'Notes', 'Date'];
    const rows = filteredGuests.map(r => [
      r.name,
      r.email,
      r.status,
      r.plusOne ? 'Yes' : 'No',
      r.notes || '',
      r.timestamp || ''
    ]);

    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guest-list-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Guest list exported successfully!', 'success');
  }, [filteredGuests, showToast]);

  // Bulk selection handlers
  const toggleSelectAll = useCallback(() => {
    if (selectedGuests.size === filteredGuests.length) {
      setSelectedGuests(new Set());
    } else {
      setSelectedGuests(new Set(filteredGuests.map(g => g.id)));
    }
  }, [filteredGuests, selectedGuests]);

  const toggleSelectGuest = useCallback((id: string) => {
    const newSelected = new Set(selectedGuests);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedGuests(newSelected);
  }, [selectedGuests]);

  const handleBulkDelete = useCallback(() => {
    if (selectedGuests.size === 0) return;
    if (confirm(`Delete ${selectedGuests.size} selected guests?`)) {
      selectedGuests.forEach(id => onDeleteRSVP(id));
      setSelectedGuests(new Set());
      showToast(`${selectedGuests.size} guests deleted`, 'success');
    }
  }, [selectedGuests, onDeleteRSVP, showToast]);

  const handleBulkEmail = useCallback(() => {
    if (selectedGuests.size === 0) return;
    const recipients = rsvps.filter(r => selectedGuests.has(r.id));
    setEmailModal({
      show: true,
      recipients,
      subject: "Update: Louie & Florie's Wedding",
      message: "Hi!\n\nWe're reaching out with some updates about our wedding...\n\nBest,\nLouie & Florie"
    });
  }, [selectedGuests, rsvps]);

  const handleContentChange = (field: keyof SiteContent, value: any) => {
    onUpdateContent({ ...content, [field]: value });
  };

  const handleArrayUpdate = (field: keyof SiteContent, index: number, subField: string, value: any) => {
    const newArray = [...(content[field] as any[])];
    newArray[index] = { ...newArray[index], [subField]: value };
    handleContentChange(field, newArray);
  };

  const handleAddItem = (field: keyof SiteContent, template: any) => {
    const newArray = [...((content[field] as any[]) || []), template];
    handleContentChange(field, newArray);
  };

  const requestDeleteConfirmation = (field: keyof SiteContent, index: number, itemName: string) => {
    setDeleteConfirmation({ show: true, field, index, itemName });
  };

  const confirmDelete = () => {
    if (!deleteConfirmation) return;
    const { field, index } = deleteConfirmation;
    const currentArray = content[field] as any[];
    if (Array.isArray(currentArray)) {
      const newArray = currentArray.filter((_, i) => i !== index);
      handleContentChange(field, newArray);
    }
    setDeleteConfirmation(null);
  };

  const handleRemoveItem = (field: keyof SiteContent, index: number, itemName: string) => {
    requestDeleteConfirmation(field, index, itemName);
  };

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    const newItem: ChecklistItem = { id: Date.now().toString(), text: newChecklistItem, completed: false };
    handleContentChange('checklist', [...(content.checklist || []), newItem]);
    setNewChecklistItem('');
  };

  const toggleChecklistItem = (id: string) => {
    const newList = (content.checklist || []).map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    handleContentChange('checklist', newList);
  };

  const removeChecklistItem = (id: string) => {
    const newList = (content.checklist || []).filter(item => item.id !== id);
    handleContentChange('checklist', newList);
  };

  const handleSave = () => {
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  // Image Upload Handlers
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith('image/')) {
          showToast(`${file.name} is not an image file`, 'error');
          continue;
        }

        // Upload to Firebase Storage
        const url = await storageService.uploadGalleryImage(file);
        uploadedUrls.push(url);

        setUploadProgress(((i + 1) / files.length) * 100);
      }

      // Add uploaded URLs to gallery
      if (uploadedUrls.length > 0) {
        const newGallery = [...(content.galleryImages || []), ...uploadedUrls];
        handleContentChange('galleryImages', newGallery);
        showToast(`Successfully uploaded ${uploadedUrls.length} image(s)!`, 'success');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Failed to upload images. Please try again.', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleDeleteImage = async (imageUrl: string, index: number) => {
    try {
      // Delete from Firebase Storage
      await storageService.deleteGalleryImage(imageUrl);

      // Remove from gallery array
      const newGallery = content.galleryImages.filter((_, i) => i !== index);
      handleContentChange('galleryImages', newGallery);

      showToast('Image deleted successfully', 'success');
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Failed to delete image', 'error');
    }
  };

  const safeContent = {
    ...content,
    venues: content.venues || [],
    socialLinks: Array.isArray(content.socialLinks) ? content.socialLinks : [],
    checklist: content.checklist || [],
    openingScreen: content.openingScreen || { welcome: '', title: '', subtitle: '', brand: '' }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/50 backdrop-blur-xl relative overflow-hidden">
      {/* Toast Notifications */}
      <AnimatePresence>
        {toast?.show && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`fixed top-24 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full shadow-2xl z-[60] flex items-center gap-3 font-bold uppercase text-[10px] tracking-widest ${toast.type === 'success' ? 'bg-green-600 text-white' : toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
            <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : toast.type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info'}`}></i> {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSaveSuccess && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-24 left-1/2 -translate-x-1/2 bg-green-600 text-white px-8 py-3 rounded-full shadow-2xl z-[60] flex items-center gap-3 font-bold uppercase text-[10px] tracking-widest">
            <i className="fa-solid fa-circle-check"></i> Changes Published Successfully
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmation?.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteConfirmation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 md:p-10 max-w-md w-full shadow-2xl border border-gold/20"
            >
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fa-solid fa-trash-can text-red-500 text-xl md:text-2xl"></i>
                </div>
                <h3 className="text-xl md:text-2xl font-serif text-gray-900 mb-3">Confirm Deletion</h3>
                <p className="text-sm md:text-base text-gray-500 mb-2 font-body">Are you sure you want to delete:</p>
                <p className="text-gold font-bold text-base md:text-lg mb-6 font-body">"{deleteConfirmation.itemName}"</p>
                <p className="text-[10px] md:text-sm text-gray-400 mb-8">This action cannot be undone.</p>
                <div className="flex gap-3 md:gap-4">
                  <button
                    onClick={() => setDeleteConfirmation(null)}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 md:px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 bg-red-500 text-white px-4 md:px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* URL Edit Modal */}
      <AnimatePresence>
        {urlEditModal?.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setUrlEditModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 md:p-10 max-w-2xl w-full shadow-2xl border border-gold/20"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gold/10 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-pen text-gold text-lg md:text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-serif text-gray-900">Edit Image URL</h3>
                    <p className="text-xs md:text-sm text-gray-400">Image #{urlEditModal.index + 1}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <InputField
                    label="Image URL"
                    value={urlEditModal.newUrl}
                    onChange={(e: any) => setUrlEditModal({ ...urlEditModal, newUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                  />
                  {urlEditModal.newUrl && urlEditModal.newUrl !== urlEditModal.currentUrl && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 md:p-4">
                      <p className="text-[10px] md:text-xs text-blue-800 font-body">
                        <i className="fa-solid fa-info-circle mr-2"></i>
                        Press "Save Changes" to update the image URL
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 md:gap-4">
                  <button
                    onClick={() => setUrlEditModal(null)}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 md:px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (urlEditModal.newUrl && urlEditModal.newUrl.trim() !== '' && urlEditModal.newUrl !== urlEditModal.currentUrl) {
                        const newGallery = [...safeContent.galleryImages];
                        newGallery[urlEditModal.index] = urlEditModal.newUrl;
                        handleContentChange('galleryImages', newGallery);
                      }
                      setUrlEditModal(null);
                    }}
                    disabled={!urlEditModal.newUrl || urlEditModal.newUrl.trim() === '' || urlEditModal.newUrl === urlEditModal.currentUrl}
                    className="flex-1 bg-gold text-white px-4 md:px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-gold/90 transition-all shadow-lg shadow-gold/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Modal */}
      <AnimatePresence>
        {emailModal?.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setEmailModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 md:p-10 max-w-2xl w-full shadow-2xl border border-gold/20 flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center gap-3 mb-6 shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-paper-plane text-gold text-lg md:text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-serif text-gray-900">Send Email</h3>
                  <p className="text-xs md:text-sm text-gray-400">Targeting {emailModal.recipients.length} guests</p>
                </div>
              </div>

              <div className="space-y-4 mb-6 md:mb-8 overflow-y-auto pr-2">
                <div className="bg-gray-50 rounded-xl p-3 md:p-4 border border-gray-100">
                  <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => {
                    const el = document.getElementById('recipient-list');
                    if (el) el.classList.toggle('hidden');
                  }}>
                    <label className="text-xs uppercase font-bold text-gray-500 font-body">Recipients</label>
                    <i className="fa-solid fa-chevron-down text-gray-400 text-xs"></i>
                  </div>
                  <div id="recipient-list" className="hidden flex flex-wrap gap-2 transition-all">
                    {emailModal.recipients.map(r => (
                      <span key={r.id} className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded text-gray-600">
                        {r.name}
                      </span>
                    ))}
                  </div>
                  {emailModal.recipients.length > 0 && <div className="text-xs text-gray-400 mt-1">{emailModal.recipients.slice(0, 3).map(r => r.name).join(', ')} {emailModal.recipients.length > 3 && `+ ${emailModal.recipients.length - 3} others`}</div>}
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-gray-500 font-body mb-2 block">Subject Line</label>
                  <input
                    type="text"
                    value={emailModal.subject}
                    onChange={(e) => setEmailModal({ ...emailModal, subject: e.target.value })}
                    className="w-full border border-gray-200 p-3 md:p-4 rounded-xl bg-white focus:border-gold outline-none transition-all text-sm mb-2"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-gray-500 font-body mb-2 block">Message Body</label>
                  <textarea
                    rows={6}
                    value={emailModal.message}
                    onChange={(e) => setEmailModal({ ...emailModal, message: e.target.value })}
                    className="w-full border border-gray-200 p-3 md:p-4 rounded-xl bg-white focus:border-gold outline-none transition-all text-sm resize-none font-body leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex gap-3 md:gap-4 shrink-0">
                <button
                  onClick={() => setEmailModal(null)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 md:px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onBatchReminders(emailModal.recipients.map(r => r.id));
                    showToast(`Sent ${emailModal.recipients.length} emails successfully!`, 'success');
                    setEmailModal(null);
                  }}
                  className="flex-1 bg-gold text-white px-4 md:px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-gold/90 shadow-lg shadow-gold/30 transition-all"
                >
                  Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 md:p-8 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl md:text-3xl font-serif text-gray-900 leading-tight">{content.adminPanelTitle || 'Wedding CMS'}</h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold mt-1">{content.adminPanelSubtitle || 'Digital Experience Architect'}</p>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={handleSave} className="bg-gold text-white px-3 md:px-6 py-2 md:py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-gold/20 hover:scale-105 transition-all flex items-center gap-2">
              <i className="fa-solid fa-cloud-arrow-up"></i>
              <span className="hidden sm:inline">Publish</span>
            </button>
            <button onClick={onClose} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all group">
              <i className="fa-solid fa-xmark text-gray-400 group-hover:text-gray-900 transition-colors"></i>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">

          {/* Main Content Area */}
          <div className="flex-grow overflow-y-auto p-4 sm:p-8 lg:p-12 bg-gray-50/50">
            <div className="max-w-7xl mx-auto">
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-10 border-b border-gray-100 pb-2">
                {[
                  { id: 'content', label: 'Art & Identity', icon: 'fa-palette' },
                  { id: 'guests', label: 'Guest Orchestrator', icon: 'fa-users-gear' },
                  { id: 'lists', label: 'Planning Assets', icon: 'fa-list-ul' },
                  { id: 'notes', label: 'Strategic Intel', icon: 'fa-brain' },
                  { id: 'guestbook', label: 'Legacy Wall', icon: 'fa-pen-nib' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 md:px-6 py-2 md:py-3 rounded-t-xl text-[10px] uppercase font-black tracking-widest transition-all relative ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <i className={`fa-solid ${tab.icon} mr-2`}></i>
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                    {activeTab === tab.id && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-gold rounded-full" />}
                  </button>
                ))}
              </div>

              {activeTab === 'content' && (
                <div className="space-y-6 md:space-y-10 animate-fadeIn">
                  <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
                    <SectionHeader icon="fa-display" title="Main Branding & Hero" description="Configure the primary titles and visual backdrop for your wedding site." />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                      <InputField label="Hero Section Title" value={content.heroTitle} onChange={(e: any) => handleContentChange('heroTitle', e.target.value)} />
                      <InputField label="Hero Background Image URL" value={content.heroImageUrl} onChange={(e: any) => handleContentChange('heroImageUrl', e.target.value)} placeholder="https://unsplash.com/..." />
                      <InputField label="Seal Initials (SL/FL)" value={content.openingScreen?.sealInitials} onChange={(e: any) => handleContentChange('openingScreen', { ...content.openingScreen, sealInitials: e.target.value })} />
                      <InputField label="Admin Panel Header Title" value={content.adminPanelTitle} onChange={(e: any) => handleContentChange('adminPanelTitle', e.target.value)} />
                      <InputField label="Admin Panel Header Subtitle" value={content.adminPanelSubtitle} onChange={(e: any) => handleContentChange('adminPanelSubtitle', e.target.value)} />
                    </div>
                  </div>

                  {/* Music Selector Section */}
                  <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
                    <SectionHeader icon="fa-music" title="Background Music" description="Choose from curated romantic tracks or add your own custom music URL." />

                    <div className="space-y-6">
                      {/* Predefined Music Options */}
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 font-body mb-4 block">Curated Wedding Tracks</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { name: 'Romantic Piano', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', icon: 'fa-piano' },
                            { name: 'Classical Romance', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', icon: 'fa-violin' },
                            { name: 'Acoustic Love', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', icon: 'fa-guitar' },
                            { name: 'Elegant Strings', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', icon: 'fa-music' },
                          ].map((track) => (
                            <button
                              key={track.url}
                              onClick={() => handleContentChange('musicUrl', track.url)}
                              className={`p-4 rounded-xl border-2 transition-all text-left group hover:border-gold hover:bg-gold/5 ${content.musicUrl === track.url
                                ? 'border-gold bg-gold/10'
                                : 'border-gray-200 bg-gray-50'
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all ${content.musicUrl === track.url
                                  ? 'bg-gold text-white'
                                  : 'bg-white text-gray-400 group-hover:bg-gold/20 group-hover:text-gold'
                                  }`}>
                                  <i className={`fa-solid ${track.icon}`}></i>
                                </div>
                                <div>
                                  <div className="font-bold text-sm text-gray-800">{track.name}</div>
                                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">Preview Available</div>
                                </div>
                                {content.musicUrl === track.url && (
                                  <i className="fa-solid fa-check text-gold ml-auto"></i>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom URL Input */}
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 font-body mb-2 block">Custom Music URL</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <input
                            type="text"
                            value={content.musicUrl}
                            onChange={(e) => handleContentChange('musicUrl', e.target.value)}
                            placeholder="https://your-music-url.com/song.mp3"
                            className="flex-1 border border-gray-200 p-4 rounded-xl bg-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-gray-900 shadow-sm"
                          />
                          <button
                            onClick={() => {
                              if (content.musicUrl) {
                                const audio = new Audio(content.musicUrl);
                                audio.volume = 0.5;
                                audio.play().catch(() => showToast('Could not play audio', 'error'));
                                setTimeout(() => audio.pause(), 5000);
                              }
                            }}
                            className="w-full sm:w-auto px-6 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all flex items-center justify-center gap-2 text-sm font-bold"
                            title="Preview 5 seconds"
                          >
                            <i className="fa-solid fa-play"></i> Preview
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          <i className="fa-solid fa-info-circle mr-1"></i>
                          Supports MP3, OGG, and WAV formats. Use a direct file URL.
                        </p>
                      </div>

                      {/* Current Music Info */}
                      {content.musicUrl && (
                        <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-gold/20 rounded-full flex items-center justify-center shrink-0">
                            <i className="fa-solid fa-music text-gold text-lg md:text-xl"></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Currently Selected</div>
                            <div className="text-xs md:text-sm text-gray-800 font-mono truncate">{content.musicUrl}</div>
                          </div>
                          <button
                            onClick={() => handleContentChange('musicUrl', '')}
                            className="w-full sm:w-auto px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all text-[10px] font-bold uppercase"
                          >
                            <i className="fa-solid fa-trash mr-2"></i>Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
                    <SectionHeader icon="fa-map-marked-alt" title="Venue Orchestration" description="Manage ceremony and reception locations." />
                    <SectionHeader icon="fa-gem" title="Wedding Foundation" description="Update the key details that anchor your entire website." />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      <InputField label="Couple Names" value={content.coupleNames} onChange={(e: any) => handleContentChange('coupleNames', e.target.value)} />
                      <InputField label="Public Date String" value={content.weddingDate} onChange={(e: any) => handleContentChange('weddingDate', e.target.value)} />
                      <InputField label="Wedding Time" value={content.weddingTime} onChange={(e: any) => handleContentChange('weddingTime', e.target.value)} placeholder="3:00 PM" />
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-500 font-body">Countdown Timer (Asia/Manila Time)</label>
                        <input type="datetime-local" value={content.countdownDate.substring(0, 16)} onChange={e => handleContentChange('countdownDate', e.target.value)} className="w-full border border-gray-200 p-4 rounded-xl bg-white focus:border-gold outline-none transition-all text-gray-900 shadow-sm" />
                      </div>
                      <div className="md:col-span-2">
                        <InputField
                          label="Footer Text"
                          value={content.footerText || ''}
                          onChange={(e: any) => handleContentChange('footerText', e.target.value)}
                          placeholder="Handcrafted with love for the celebration of a lifetime"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'lists' && (
                <div className="space-y-6 md:space-y-12 animate-fadeIn">
                  <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                      <SectionHeader icon="fa-clock" title="Timeline Orchestrator" description="Manage the moments of your celebration." />
                      <button onClick={() => handleAddItem('timelineItems', { time: '0:00 PM', event: 'New Event', description: 'Detail' })} className="w-full sm:w-auto bg-gold text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-gold/20">Add Event</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {safeContent.timelineItems.map((item, i) => (
                        <div key={i} className="p-4 md:p-6 border border-gray-100 rounded-2xl bg-gray-50 relative group">
                          <button onClick={() => handleRemoveItem('timelineItems', i, item.event || 'Event')} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all"><i className="fa-solid fa-trash-can"></i></button>
                          <input value={item.time} onChange={e => handleArrayUpdate('timelineItems', i, 'time', e.target.value)} className="w-full mb-2 text-gold font-bold bg-white border border-gray-200 rounded px-3 py-2 outline-none focus:border-gold text-sm" />
                          <input value={item.event} onChange={e => handleArrayUpdate('timelineItems', i, 'event', e.target.value)} className="w-full mb-3 text-lg font-cursive bg-white border border-gray-200 rounded px-3 py-2 outline-none focus:border-gold" />
                          <textarea value={item.description} onChange={e => handleArrayUpdate('timelineItems', i, 'description', e.target.value)} className="w-full text-xs text-gray-600 bg-white border border-gray-200 rounded px-3 py-2 outline-none focus:border-gold resize-none" rows={2} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                      <div className="shrink-0">
                        <SectionHeader icon="fa-images" title="Gallery Curator" description="Upload photos or link to external albums." />
                        <div className="mt-2 text-xs text-gray-400 font-body">
                          <i className="fa-solid fa-image mr-2"></i>
                          {safeContent.galleryImages.length} {safeContent.galleryImages.length === 1 ? 'image' : 'images'} in gallery
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:flex gap-3 w-full md:w-auto items-end">
                        <div className="flex-grow">
                          <InputField label="Google Photos Shared Link" value={content.googlePhotosLink} onChange={(e: any) => handleContentChange('googlePhotosLink', e.target.value)} placeholder="https://photos.app.goo.gl/..." />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => handleContentChange('googlePhotosLinkEnabled', !(content.googlePhotosLinkEnabled ?? true))}
                            className={`flex-1 sm:flex-none px-4 py-4 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all sm:h-[58px] flex items-center justify-center gap-2 ${content.googlePhotosLinkEnabled !== false
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                              }`}
                            title={content.googlePhotosLinkEnabled !== false ? 'Album link is visible to guests' : 'Album link is hidden from guests'}
                          >
                            <i className={`fa-solid ${content.googlePhotosLinkEnabled !== false ? 'fa-lock-open' : 'fa-lock'}`}></i>
                            <span className="sm:hidden lg:inline">{content.googlePhotosLinkEnabled !== false ? 'Unlocked' : 'Locked'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Upload Zone */}
                    <div
                      className={`relative mb-8 border-2 border-dashed rounded-2xl p-8 text-center transition-all ${dragActive ? 'border-gold bg-gold/5' : 'border-gray-200 hover:border-gold/50'
                        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        id="gallery-upload"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files)}
                        className="hidden"
                        disabled={isUploading}
                      />

                      {isUploading ? (
                        <div className="space-y-4">
                          <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto">
                            <i className="fa-solid fa-spinner fa-spin text-gold text-2xl"></i>
                          </div>
                          <p className="text-sm font-bold text-gray-700">Uploading to Firebase Storage...</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
                            <div
                              className="bg-gold h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500">{Math.round(uploadProgress)}%</p>
                        </div>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fa-solid fa-cloud-arrow-up text-gray-400 text-2xl"></i>
                          </div>
                          <h3 className="text-lg font-serif text-gray-800 mb-2">Upload Images</h3>
                          <p className="text-sm text-gray-500 mb-4">Drag and drop images here, or click to browse</p>
                          <label
                            htmlFor="gallery-upload"
                            className="inline-block bg-gold text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-gold/20 hover:bg-gold/90 cursor-pointer transition-all"
                          >
                            <i className="fa-solid fa-plus mr-2"></i>
                            Select Images
                          </label>
                          <p className="text-xs text-gray-400 mt-4">Supports JPG, PNG, WebP • Max 10MB per file</p>
                        </>
                      )}
                    </div>

                    {safeContent.galleryImages.length === 0 ? (
                      <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="fa-solid fa-image text-gray-400 text-2xl"></i>
                        </div>
                        <h3 className="text-lg font-serif text-gray-600 mb-2">No Images Yet</h3>
                        <p className="text-sm text-gray-400 mb-6">Click "Add Photo" to start building your gallery</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {safeContent.galleryImages.map((img, i) => (
                          <div key={i} className="relative group aspect-square rounded-xl overflow-hidden shadow-sm border-2 border-gray-100 hover:border-gold/30 transition-all">
                            <img src={img} className="w-full h-full object-cover" alt="Gallery preview" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col p-3 justify-between">
                              <div className="flex justify-between items-start">
                                <span className="text-white text-xs bg-black/50 px-2 py-1 rounded font-body">#{i + 1}</span>
                                <button onClick={() => handleDeleteImage(img, i)} className="text-white hover:text-red-400 bg-black/50 w-8 h-8 rounded-full flex items-center justify-center transition-all">
                                  <i className="fa-solid fa-trash-can"></i>
                                </button>
                              </div>
                              <div className="space-y-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setUrlEditModal({ show: true, index: i, currentUrl: img, newUrl: img });
                                  }}
                                  className="w-full bg-white/90 hover:bg-white text-gray-800 px-3 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
                                >
                                  <i className="fa-solid fa-pen"></i> Edit URL
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'guests' && (
                <div className="space-y-10 animate-fadeIn">
                  <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
                    <SectionHeader icon="fa-chart-pie" title="Guest Analytics" description="Live statistics of your wedding attendance." />
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                      {[
                        { label: 'Total Souls', value: stats.totalGuests, color: 'text-gold', icon: 'fa-users', bg: 'bg-gold/10' },
                        { label: 'Attending', value: stats.attendingCount, color: 'text-green-500', icon: 'fa-heart', bg: 'bg-green-50' },
                        { label: 'Declined', value: stats.declinedCount, color: 'text-red-400', icon: 'fa-heart-crack', bg: 'bg-red-50' },
                        { label: 'Pending', value: stats.pendingCount, color: 'text-gray-400', icon: 'fa-question', bg: 'bg-gray-50' },
                        { label: 'Plus Ones', value: stats.plusOneCount, color: 'text-blue-500', icon: 'fa-user-plus', bg: 'bg-blue-50' }
                      ].map(stat => (
                        <div key={stat.label} className={`p-6 ${stat.bg} rounded-2xl border border-gray-100 flex flex-col items-center transition-all hover:scale-105`}>
                          <i className={`fa-solid ${stat.icon} ${stat.color} mb-3 text-xl`}></i>
                          <div className="text-3xl font-serif-sc mb-1">{stat.value}</div>
                          <div className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
                    <SectionHeader icon="fa-users-gear" title="Guest List Management" description="Advanced search, filter, and bulk operations." />

                    {/* Search & Filter Controls */}
                    <div className="flex flex-col gap-4 mb-8">
                      <div className="relative flex-1">
                        <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input
                          type="text"
                          placeholder="Search by name or email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold outline-none transition-all text-sm"
                        />
                        {searchTerm && (
                          <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gold">
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:flex gap-2">
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                          className="flex-1 md:flex-none px-3 md:px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold outline-none text-xs md:text-sm"
                        >
                          <option value="all">All Status</option>
                          <option value={RSVPStatus.ATTENDING}>Attending</option>
                          <option value={RSVPStatus.NOT_ATTENDING}>Declined</option>
                          <option value={RSVPStatus.UNDECIDED}>Pending</option>
                        </select>

                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as SortOption)}
                          className="flex-1 md:flex-none px-3 md:px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold outline-none text-xs md:text-sm"
                        >
                          <option value="name-asc">Name A-Z</option>
                          <option value="name-desc">Name Z-A</option>
                          <option value="recent">Recent First</option>
                          <option value="status">By Status</option>
                        </select>

                        <button
                          onClick={exportToCSV}
                          className="col-span-2 md:col-span-1 px-4 md:px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all flex items-center justify-center gap-2 text-xs md:text-sm font-bold"
                        >
                          <i className="fa-solid fa-download"></i>
                          <span className="hidden sm:inline">Export CSV</span>
                          <span className="sm:hidden">Export</span>
                        </button>
                      </div>
                    </div>

                    {/* Bulk Actions Toolbar */}
                    {selectedGuests.size > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gold/10 border border-gold/30 rounded-xl p-3 md:p-4 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <i className="fa-solid fa-check-double text-gold"></i>
                          <span className="font-bold text-xs md:text-sm">{selectedGuests.size} guest{selectedGuests.size > 1 ? 's' : ''} selected</span>
                        </div>
                        <div className="flex gap-2 flex-wrap w-full md:w-auto">
                          <button
                            onClick={handleBulkEmail}
                            className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-all flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase"
                          >
                            <i className="fa-solid fa-paper-plane"></i>
                            <span className="hidden sm:inline">Email</span>
                          </button>
                          <button
                            onClick={handleBulkDelete}
                            className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase"
                          >
                            <i className="fa-solid fa-trash"></i>
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                          <button
                            onClick={() => setSelectedGuests(new Set())}
                            className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all text-[10px] md:text-xs font-bold uppercase"
                          >
                            Clear
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Follow Up Pending Guests */}
                    {stats.pendingCount > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 md:p-4 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <i className="fa-solid fa-clock text-yellow-600"></i>
                          <span className="text-xs md:text-sm text-yellow-800">{stats.pendingCount} guest{stats.pendingCount > 1 ? 's' : ''} haven't responded yet</span>
                        </div>
                        <button
                          onClick={() => {
                            const undecidedGuests = rsvps.filter(r => r.status === RSVPStatus.UNDECIDED);
                            setEmailModal({
                              show: true,
                              recipients: undecidedGuests,
                              subject: "Quick Reminder: Louie & Florie's Wedding",
                              message: "Hi!\n\nWe hope you're doing well. We're finalizing our wedding numbers and wanted to check if you'll be able to join us.\n\nPlease let us know by visiting our website.\n\nBest,\nLouie & Florie"
                            });
                          }}
                          className="w-full md:w-auto px-4 md:px-6 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase"
                        >
                          <i className="fa-solid fa-paper-plane"></i> Follow Up All
                        </button>
                      </div>
                    )}

                    {/* Guest Table - Desktop */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-100 text-left">
                            <th className="pb-4 pl-4 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                              <input
                                type="checkbox"
                                checked={selectedGuests.size === filteredGuests.length && filteredGuests.length > 0}
                                onChange={toggleSelectAll}
                                className="w-4 h-4 rounded border-gray-300 text-gold focus:ring-gold cursor-pointer"
                              />
                            </th>
                            <th className="pb-4 pl-4 text-[10px] uppercase tracking-widest text-gray-400 font-black">Guest</th>
                            <th className="pb-4 text-[10px] uppercase tracking-widest text-gray-400 font-black">Status</th>
                            <th className="pb-4 text-[10px] uppercase tracking-widest text-gray-400 font-black">Email</th>
                            <th className="pb-4 text-[10px] uppercase tracking-widest text-gray-400 font-black text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredGuests.map(rsvp => (
                            <tr key={rsvp.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                              <td className="py-5 pl-4">
                                <input
                                  type="checkbox"
                                  checked={selectedGuests.has(rsvp.id)}
                                  onChange={() => toggleSelectGuest(rsvp.id)}
                                  className="w-4 h-4 rounded border-gray-300 text-gold focus:ring-gold cursor-pointer"
                                />
                              </td>
                              <td className="py-5 pl-4">
                                <div className="font-bold text-gray-800">{rsvp.name}</div>
                                {rsvp.plusOne && <div className="text-xs text-gray-400 mt-1 flex items-center gap-1"><i className="fa-solid fa-user-plus text-[10px]"></i> +1 Guest</div>}
                              </td>
                              <td className="py-5">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${rsvp.status === RSVPStatus.ATTENDING ? 'bg-green-100 text-green-600' : rsvp.status === RSVPStatus.NOT_ATTENDING ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                  {rsvp.status === RSVPStatus.ATTENDING ? 'Accepted' : rsvp.status === RSVPStatus.NOT_ATTENDING ? 'Declined' : 'Pending'}
                                </span>
                              </td>
                              <td className="py-5 text-sm text-gray-500 font-body">{rsvp.email}</td>
                              <td className="py-5 text-right">
                                <div className="flex gap-2 items-center justify-end">
                                  {rsvp.notes && (
                                    <div className="text-xs text-gray-500 italic max-w-xs truncate mr-2" title={rsvp.notes}>
                                      "{rsvp.notes}"
                                    </div>
                                  )}
                                  <button onClick={() => onSendReminder(rsvp.id)} className="text-gray-300 hover:text-gold transition-colors p-2" title="Send Reminder">
                                    <i className="fa-solid fa-bell"></i>
                                  </button>
                                  <button onClick={() => onDeleteRSVP(rsvp.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2" title="Delete Guest">
                                    <i className="fa-solid fa-trash-can"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {filteredGuests.length === 0 && (
                            <tr>
                              <td colSpan={5} className="py-20 text-center text-gray-300 italic">
                                {searchTerm || statusFilter !== 'all' ? 'No guests match your filters' : 'No responses recorded yet.'}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Guest Cards - Mobile */}
                    <div className="md:hidden space-y-4">
                      {filteredGuests.length > 0 ? (
                        filteredGuests.map(rsvp => (
                          <div key={rsvp.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start gap-3 flex-1">
                                <input
                                  type="checkbox"
                                  checked={selectedGuests.has(rsvp.id)}
                                  onChange={() => toggleSelectGuest(rsvp.id)}
                                  className="w-5 h-5 rounded border-gray-300 text-gold focus:ring-gold cursor-pointer mt-1"
                                />
                                <div className="flex-1">
                                  <div className="font-bold text-gray-800 text-base mb-1">{rsvp.name}</div>
                                  {rsvp.plusOne && (
                                    <div className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                                      <i className="fa-solid fa-user-plus text-[10px]"></i> +1 Guest
                                    </div>
                                  )}
                                  <div className="text-xs text-gray-500 mb-2 break-all">{rsvp.email}</div>
                                  <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${rsvp.status === RSVPStatus.ATTENDING ? 'bg-green-100 text-green-600' : rsvp.status === RSVPStatus.NOT_ATTENDING ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                    {rsvp.status === RSVPStatus.ATTENDING ? 'Accepted' : rsvp.status === RSVPStatus.NOT_ATTENDING ? 'Declined' : 'Pending'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {rsvp.notes && (
                              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Notes</div>
                                <div className="text-xs text-gray-600 italic">"{rsvp.notes}"</div>
                              </div>
                            )}

                            <div className="flex gap-2 pt-2 border-t border-gray-100">
                              <button
                                onClick={() => onSendReminder(rsvp.id)}
                                className="flex-1 bg-gold/10 text-gold px-4 py-2 rounded-lg hover:bg-gold/20 transition-all flex items-center justify-center gap-2 text-xs font-bold"
                              >
                                <i className="fa-solid fa-bell"></i> Remind
                              </button>
                              <button
                                onClick={() => onDeleteRSVP(rsvp.id)}
                                className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-all flex items-center justify-center gap-2 text-xs font-bold"
                              >
                                <i className="fa-solid fa-trash-can"></i> Delete
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-gray-50 rounded-xl p-12 text-center">
                          <i className="fa-solid fa-users-slash text-4xl text-gray-300 mb-4"></i>
                          <p className="text-gray-400 italic">
                            {searchTerm || statusFilter !== 'all' ? 'No guests match your filters' : 'No responses recorded yet.'}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 text-xs text-gray-400 text-center">
                      Showing {filteredGuests.length} of {rsvps.length} total guests
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fadeIn">
                  <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
                    <SectionHeader icon="fa-list-check" title="Planning Checklist" description="Manage tasks with completion status." />
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8">
                      <input value={newChecklistItem} onChange={e => setNewChecklistItem(e.target.value)} placeholder="Add a new task..." className="flex-1 border border-gray-200 p-4 rounded-xl outline-none focus:border-gold bg-gray-50 transition-colors text-sm" />
                      <button onClick={addChecklistItem} className="w-full sm:w-auto bg-gold text-white px-8 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-gold/20 transition-all">Add Task</button>
                    </div>
                    <div className="space-y-4">
                      {safeContent.checklist.map(item => (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 ${item.completed ? 'bg-green-50 border-green-100 opacity-60' : 'bg-gray-50 border-gray-50'}`}
                        >
                          <div className="flex items-center gap-3 md:gap-4 cursor-pointer" onClick={() => toggleChecklistItem(item.id)}>
                            <button className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${item.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 bg-white hover:border-gold'}`}>
                              {item.completed && <i className="fa-solid fa-check text-[8px] md:text-[10px]"></i>}
                            </button>
                            <span className={`text-xs md:text-sm transition-all select-none ${item.completed ? 'line-through text-gray-400 italic' : 'text-gray-700 font-medium'}`}>{item.text}</span>
                          </div>
                          <button onClick={() => removeChecklistItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2"><i className="fa-solid fa-xmark"></i></button>
                        </div>
                      ))}
                      {safeContent.checklist.length === 0 && <p className="text-center text-gray-300 italic py-10">No items in your checklist.</p>}
                    </div>
                  </div>


                  <div className="space-y-6 md:space-y-8">
                    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
                      <SectionHeader icon="fa-pen-fancy" title="Meeting Notes" description="Keep track of conversations with vendors." />
                      <textarea rows={5} value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Type notes here..." className="w-full border border-gray-200 p-4 md:p-5 rounded-2xl bg-gray-50 focus:bg-white focus:border-gold outline-none transition-all mb-4 md:mb-6 resize-none text-sm leading-relaxed" />
                      <button onClick={() => { if (newNote.trim()) { onAddNote(newNote); setNewNote(''); } }} className="w-full bg-gold text-white py-4 md:py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-gold/20 transition-all hover:bg-gold/90">Store Note</button>
                    </div>
                    <div className="space-y-6">
                      {notes.map(note => (
                        <div key={note.id} className="bg-white p-8 rounded-3xl border border-gray-50 relative group">
                          <button onClick={() => onDeleteNote(note.id)} className="absolute top-6 right-6 text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100"><i className="fa-solid fa-trash-can"></i></button>
                          <div className="text-gold text-[10px] font-black uppercase mb-4 tracking-widest">{note.date}</div>
                          <div className="text-gray-600 italic font-body whitespace-pre-wrap leading-relaxed">"{note.content}"</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'guestbook' && (
                <div className="animate-fadeIn">
                  <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 mb-10">
                    <SectionHeader icon="fa-book-open" title="Guestbook Entries" description="Manage public messages from your guests." />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {guestbookEntries.map(entry => (
                        <div key={entry.id} className="p-6 border border-gray-100 rounded-2xl relative group bg-gray-50 hover:bg-white transition-all shadow-sm">
                          <button
                            onClick={() => onDeleteGuestbookEntry(entry.id)}
                            className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-serif text-gold text-lg">{entry.name}</h4>
                            <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">{new Date(entry.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-gray-600 text-sm italic font-body">"{entry.message}"</p>
                        </div>
                      ))}
                      {guestbookEntries.length === 0 && (
                        <div className="col-span-full py-20 text-center text-gray-300 italic">No guestbook entries yet.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Bottom Tab Bar */}
        <div className="md:hidden bg-white border-t border-gray-100 flex justify-around items-center py-4 px-2 safe-bottom z-[60] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] shrink-0">
          {[
            { id: 'content', label: 'Core', icon: 'fa-pen-nib' },
            { id: 'lists', label: 'Lists', icon: 'fa-list-check' },
            { id: 'guests', label: 'Guests', icon: 'fa-users-gear' },
            { id: 'guestbook', label: 'Book', icon: 'fa-book-open' },
            { id: 'notes', label: 'Notes', icon: 'fa-flask' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center gap-1.5 transition-all w-full ${activeTab === tab.id ? 'text-gold' : 'text-gray-400'}`}
            >
              <div className={`p-2 rounded-xl transition-all ${activeTab === tab.id ? 'bg-gold/10' : ''}`}>
                <i className={`fa-solid ${tab.icon} text-lg`}></i>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
