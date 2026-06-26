import React, { useState, useMemo, useRef } from 'react';
import { Card } from './Card';
import { useAppContext } from '../context/AppContext';
import { CheckCircle2, Circle, Clock, Trash2, Lock, Search, Sparkles, ChevronDown, ChevronUp, FileText, Video, Link as LinkIcon, BookOpen, ExternalLink, Pencil, Upload, Download, X, Paperclip } from 'lucide-react';
import { Modal } from './Modal';
import { Task } from '../data/mockData';
import { calculatePriority, formatDeadline } from '../utils/dateUtils';
import { motion, AnimatePresence } from 'motion/react';

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case 'overdue': return 'TERLAMBAT';
    case 'high': return 'WAKTU AKAN HABIS';
    case 'medium': return 'WAKTU DEKAT';
    default: return 'WAKTU SANTAI';
  }
};

// Konversi ISO string ke format datetime-local input (YYYY-MM-DDTHH:MM lokal)
const isoToLocalInput = (iso: string): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// Format ukuran file jadi readable
const formatFileSize = (bytes: number): string => {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const TasksView = () => {
  const { tasks, toggleTask, deleteTask, addTask, updateTask, getAttachmentUrl } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [taskForm, setTaskForm] = useState<Partial<Task>>({
    title: '', course: '', deadline: '', description: ''
  });
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [removeAttachment, setRemoveAttachment] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Buka modal untuk tambah task baru
  const openAddModal = () => {
    setEditingTask(null);
    setTaskForm({ title: '', course: '', deadline: '', description: '' });
    setAttachedFile(null);
    setRemoveAttachment(false);
    setIsModalOpen(true);
  };

  // Buka modal untuk edit task yang sudah ada (pre-fill semua field)
  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      course: task.course || '',
      deadline: isoToLocalInput(task.deadline),
      description: task.description || '',
    });
    setAttachedFile(null);
    setRemoveAttachment(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setAttachedFile(null);
    setRemoveAttachment(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title || !taskForm.deadline) return;

    const payload = {
      title: taskForm.title,
      course: taskForm.course || '',
      deadline: new Date(taskForm.deadline).toISOString(),
      priority: calculatePriority(taskForm.deadline),
      description: taskForm.description || '',
      completed: editingTask?.completed ?? false,
    };

    if (editingTask) {
      // Mode Edit: kirim field yang berubah + file baru (jika ada) + flag removeFile
      await updateTask(
        editingTask.id,
        payload,
        attachedFile,
        removeAttachment,
      );
    } else {
      // Mode Add: buat task baru + file (opsional)
      await addTask(payload, attachedFile);
    }

    closeModal();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setAttachedFile(f);
    // Kalau user milih file baru, batalin niat hapus file eksisting
    if (f) setRemoveAttachment(false);
  };

  const getMaterialIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video': return <Video className="w-4 h-4 text-rose-500" />;
      case 'pdf': case 'doc': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'book': case 'notes': return <BookOpen className="w-4 h-4 text-amber-500" />;
      default: return <LinkIcon className="w-4 h-4 text-purple" />;
    }
  };

  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.course?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.aiMaterials?.some(m => m.title.toLowerCase().includes(q) || m.type.toLowerCase().includes(q))
      );
    }

    return filtered.sort((a, b) => {
      const timeA = new Date(a.deadline).getTime();
      const timeB = new Date(b.deadline).getTime();
      if (isNaN(timeA)) return 1;
      if (isNaN(timeB)) return -1;
      return timeA - timeB;
    });
  }, [tasks, searchQuery]);

  const hasUrgentTasks = useMemo(() => {
    return tasks.some(t => {
      const p = calculatePriority(t.deadline ?? '');
      return !t.completed && (p === 'high' || p === 'overdue');
    });
  }, [tasks]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTaskId(expandedTaskId === id ? null : id);
  };

  // Helper kecil untuk render label dokumen eksisting saat mode Edit
  const renderExistingAttachment = () => {
    if (!editingTask?.attachment || removeAttachment) return null;
    return (
      <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200 text-sm">
        <div className="flex items-center gap-2 overflow-hidden text-slate-600">
          <Paperclip className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="truncate">{editingTask.attachment.originalName}</span>
          <span className="text-slate-400 text-xs flex-shrink-0">({formatFileSize(editingTask.attachment.size)})</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <a
            href={getAttachmentUrl(editingTask.id)}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1 text-slate-400 hover:text-purple"
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setRemoveAttachment(true); }}
            className="p-1 text-slate-400 hover:text-rose-500"
            title="Hapus file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-navy">All Tasks</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks or materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/50 focus:border-purple placeholder:text-slate-400 shadow-sm"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9, y: 4, transition: { type: "spring", stiffness: 400, damping: 10 } }}
            onClick={openAddModal}
            className="px-4 py-2 text-sm bg-purple text-white rounded-xl shadow-sm font-medium flex-shrink-0 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            + Add Task
          </motion.button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="divide-y divide-neutral-light">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center gap-3">
              <Search className="w-8 h-8 text-slate-300" />
              <p className="text-slate-500">{searchQuery ? 'No matching tasks found.' : 'No tasks remaining!'}</p>
            </div>
          ) : filteredTasks.map(task => {
            const priority = calculatePriority(task.deadline ?? '');
            const isUrgent = priority === 'high' || priority === 'overdue';
            const isLocked = hasUrgentTasks && !task.completed && !isUrgent;
            const isExpanded = expandedTaskId === task.id;

            return (
            <div key={task.id} className="transition-colors overflow-hidden border-b border-slate-100 last:border-0">
              {/* BAGIAN UTAMA BARIS TUGAS */}
              <div
                className={`p-5 flex items-center justify-between group hover:bg-slate-50/50 cursor-pointer ${task.completed ? 'opacity-60 bg-slate-50/30' : isLocked ? 'opacity-60 bg-slate-50/10' : ''}`}
                onClick={(e) => toggleExpand(task.id, e)}
              >
                <div className="flex items-start gap-4">
                   <motion.button
                      whileHover={!isLocked ? { scale: 1.15 } : {}}
                      whileTap={!isLocked ? { scale: 0.8, rotate: -20, transition: { type: "spring", stiffness: 400, damping: 10 } } : {}}
                      className={`mt-0.5 ${isLocked ? 'cursor-not-allowed' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        !isLocked && toggleTask(task.id);
                      }}
                      disabled={isLocked}
                      title={isLocked ? 'Complete high priority tasks first' : ''}
                   >
                     {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-purple" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5 text-slate-300" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-purple transition-colors" />
                      )}
                   </motion.button>
                   <div>
                     <h4 className={`font-medium ${task.completed ? 'text-slate-500 line-through' : isLocked ? 'text-slate-500' : 'text-navy'}`}>
                       {task.title}
                     </h4>
                     <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 flex-wrap">
                       {task.course && <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium">{task.course}</span>}
                       <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {formatDeadline(task.deadline)}</span>
                       {task.attachment && (
                         <span className="flex items-center text-purple" title={task.attachment.originalName}>
                           <Paperclip className="w-3.5 h-3.5 mr-1" /> {task.attachment.originalName}
                         </span>
                       )}
                     </div>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border uppercase tracking-wider hidden sm:block ${
                    priority === 'overdue' ? 'text-white bg-red-600 border-red-600 animate-pulse' :
                    priority === 'high' ? 'text-rose-500 bg-rose-50 border-rose-200' :
                    priority === 'medium' ? 'text-amber-500 bg-amber-50 border-amber-200' :
                    'text-slate-500 bg-slate-50 border-slate-200'
                  }`}>
                    {getPriorityLabel(priority)}
                  </span>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.8, y: 2, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                      onClick={(e) => { e.stopPropagation(); openEditModal(task); }}
                      className="p-1.5 text-slate-400 hover:text-purple transition-all rounded-lg hover:bg-purple-50 opacity-0 group-hover:opacity-100"
                      title="Edit task"
                    >
                      <Pencil className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      whileTap={{ scale: 0.8, y: 2, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if(window.confirm('Hapus tugas ini?')) {
                          deleteTask(task.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-all rounded-lg hover:bg-rose-50 opacity-0 group-hover:opacity-100"
                      title="Hapus task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                    {/* ICON CHEVRON UNTUK EXPAND */}
                    <div className="p-1.5 text-slate-400 group-hover:text-purple transition-colors">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* BAGIAN EXPANDED DETAIL */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-slate-50/50 border-t border-slate-100 overflow-hidden"
                  >
                    <div className="p-5 pl-14 space-y-4">
                      {/* DESCRIPTION */}
                      {task.description && (
                        <div>
                          <h5 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-purple" /> Description
                          </h5>
                          <p className="text-sm text-slate-600 whitespace-pre-wrap bg-white rounded-lg border border-slate-200 p-3">
                            {task.description}
                          </p>
                        </div>
                      )}

                      {/* ATTACHMENT DOWNLOAD */}
                      {task.attachment && (
                        <div>
                          <h5 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                            <Paperclip className="w-4 h-4 text-purple" /> Document
                          </h5>
                          <a
                            href={getAttachmentUrl(task.id)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-purple/50 hover:shadow-sm transition-all"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FileText className="w-4 h-4 text-blue-500" />
                            <div className="flex flex-col">
                              <span className="text-sm text-slate-700 font-medium">{task.attachment.originalName}</span>
                              <span className="text-xs text-slate-400">{formatFileSize(task.attachment.size)}</span>
                            </div>
                            <Download className="w-4 h-4 text-slate-400 ml-2" />
                          </a>
                        </div>
                      )}

                      {/* AI MATERIALS (tetap dipertahankan) */}
                      {task.aiMaterials && task.aiMaterials.length > 0 && (
                        <div>
                          <h5 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                            <Sparkles className="w-4 h-4 text-purple" /> AI Study Materials
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {task.aiMaterials.map((mat, idx) => (
                              <a
                                key={idx}
                                href={mat.link}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-purple/50 hover:shadow-sm transition-all group/link"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex items-center gap-3 overflow-hidden">
                                  {getMaterialIcon(mat.type)}
                                  <span className="text-sm text-slate-600 font-medium truncate">{mat.title}</span>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {!task.description && !task.attachment && (!task.aiMaterials || task.aiMaterials.length === 0) && (
                        <div className="flex items-center gap-2 text-sm text-slate-500 italic">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <p>No extra details attached to this task.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )})}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingTask ? 'Edit Task' : 'Add New Task'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Task Title *</label>
            <input
              required
              autoFocus
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/50 focus:border-purple"
              value={taskForm.title || ''}
              onChange={e => setTaskForm({...taskForm, title: e.target.value})}
              placeholder="e.g. Complete math assignment"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Course (Optional)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/50 focus:border-purple"
                value={taskForm.course || ''}
                onChange={e => setTaskForm({...taskForm, course: e.target.value})}
                placeholder="e.g. CS101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Deadline *</label>
              <input
                required
                type="datetime-local"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/50 focus:border-purple bg-white"
                value={taskForm.deadline || ''}
                onChange={e => setTaskForm({...taskForm, deadline: e.target.value})}
              />
            </div>
          </div>

          {/* DESCRIPTION (NEW) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/50 focus:border-purple resize-y"
              value={taskForm.description || ''}
              onChange={e => setTaskForm({...taskForm, description: e.target.value})}
              placeholder="Catatan / detail tambahan untuk tugas ini..."
            />
          </div>

          {/* FILE UPLOAD (NEW) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Document (PDF/TXT, Optional)</label>

            {/* Mode Edit + ada file eksisting: tampilkan dulu */}
            {renderExistingAttachment()}

            {/* File baru yang dipilih (Add atau Edit) */}
            {attachedFile && (
              <div className="mt-2 flex items-center justify-between p-2 bg-purple-50 rounded-lg border border-purple-200 text-sm">
                <div className="flex items-center gap-2 overflow-hidden text-slate-700">
                  <Upload className="w-4 h-4 text-purple flex-shrink-0" />
                  <span className="truncate">{attachedFile.name}</span>
                  <span className="text-slate-400 text-xs flex-shrink-0">({formatFileSize(attachedFile.size)})</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAttachedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="p-1 text-slate-400 hover:text-rose-500 flex-shrink-0"
                  title="Batal pilih file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Input file (selalu tampil kecuali user sudah pilih file baru atau eksplisit remove di edit mode) */}
            {!attachedFile && (
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,application/pdf,text/plain"
                onChange={handleFileChange}
                className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple file:text-white hover:file:bg-purple/90 cursor-pointer"
              />
            )}
            <p className="text-xs text-slate-400 mt-1">Maks 10MB. Hanya PDF atau TXT.</p>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-navy transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-purple text-white rounded-xl shadow-sm font-medium flex items-center gap-2"
            >
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
