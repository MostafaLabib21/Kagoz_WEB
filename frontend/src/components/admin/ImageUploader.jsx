import React, { useRef, useState } from 'react';
import { Upload, X, GripVertical } from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axiosInstance from '../../utils/axiosInstance';

const SortableImage = ({ image, idx, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.publicId || idx.toString() });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="relative aspect-square group">
      <img src={image.url} alt="" className="w-full h-full object-cover rounded-lg" />
      <button {...attributes} {...listeners} className="absolute top-1 left-1 bg-white/80 rounded p-0.5 opacity-0 group-hover:opacity-100 cursor-grab">
        <GripVertical size={14} className="text-gray-600" />
      </button>
      <button
        onClick={() => onDelete(image)}
        className="absolute top-1 right-1 bg-white/80 rounded p-0.5 opacity-0 group-hover:opacity-100 hover:bg-red-100"
      >
        <X size={14} className="text-red-600" />
      </button>
      {idx === 0 && (
        <span className="absolute bottom-1 left-1 bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded">Main</span>
      )}
    </div>
  );
};

const ImageUploader = ({ images = [], onUpload, onDelete, onReorder, maxImages = 6 }) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState({});
  const [errors, setErrors] = useState([]);

  const handleFiles = async (files) => {
    setErrors([]);
    const fileList = Array.from(files);

    for (const file of fileList) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setErrors((p) => [...p, `${file.name}: only JPG, PNG, WEBP allowed`]);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((p) => [...p, `${file.name}: exceeds 5MB limit`]);
        continue;
      }
      if (images.length >= maxImages) break;

      const id = Date.now() + Math.random();
      setUploading((p) => ({ ...p, [id]: { name: file.name, progress: 0 } }));

      try {
        const formData = new FormData();
        formData.append('images', file);
        const { data } = await axiosInstance.post('/api/admin/upload', formData, {
          onUploadProgress: (e) => {
            const pct = Math.round((e.loaded * 100) / e.total);
            setUploading((p) => ({ ...p, [id]: { ...p[id], progress: pct } }));
          },
        });
        if (data[0]) onUpload(data[0]);
      } catch (err) {
        setErrors((p) => [...p, `${file.name}: upload failed`]);
      } finally {
        setUploading((p) => { const n = { ...p }; delete n[id]; return n; });
      }
    }
  };

  const handleDelete = async (image) => {
    try {
      if (image.publicId) {
        await axiosInstance.delete('/api/admin/upload', { data: { publicId: image.publicId } });
      }
      onDelete(image.publicId);
    } catch { /* ignore */ }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = images.findIndex((img) => (img.publicId || images.indexOf(img).toString()) === active.id);
    const newIdx = images.findIndex((img) => (img.publicId || images.indexOf(img).toString()) === over.id);
    onReorder(arrayMove(images, oldIdx, newIdx));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <div
        onClick={() => fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-6 text-center cursor-pointer hover:border-indigo-400 transition relative"
      >
        <Upload size={24} className="mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">Drag & drop images here</p>
        <p className="text-xs text-gray-400">or click to browse</p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP · Max 5MB · Up to {maxImages} images</p>
        <span className="absolute top-2 right-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
          {images.length} / {maxImages}
        </span>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {Object.entries(uploading).map(([id, info]) => (
        <div key={id} className="mt-2 text-xs text-gray-600">
          <p>{info.name}</p>
          <div className="w-full bg-gray-200 rounded h-1.5 mt-1">
            <div className="bg-indigo-600 h-1.5 rounded transition-all" style={{ width: `${info.progress}%` }} />
          </div>
        </div>
      ))}

      {errors.map((err, i) => (
        <p key={i} className="text-xs text-red-500 mt-1">{err}</p>
      ))}

      {images.length > 0 && (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images.map((img, i) => img.publicId || i.toString())} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {images.map((img, idx) => (
                <SortableImage key={img.publicId || idx} image={img} idx={idx} onDelete={handleDelete} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default ImageUploader;
