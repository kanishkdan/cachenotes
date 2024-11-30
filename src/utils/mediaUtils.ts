import { openDB } from 'idb';

const DB_NAME = 'cachenotes-media';
const STORE_NAME = 'media';

interface MediaMetadata {
  id: string;
  type: 'image' | 'video';
  size: number;
  mimeType: string;
  createdAt: Date;
}

const db = await openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME);
  },
});

export async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Max dimensions
      const MAX_WIDTH = 1920;
      const MAX_HEIGHT = 1080;
      
      let width = img.width;
      let height = img.height;
      
      if (width > MAX_WIDTH) {
        height = (MAX_WIDTH * height) / width;
        width = MAX_WIDTH;
      }
      
      if (height > MAX_HEIGHT) {
        width = (MAX_HEIGHT * width) / height;
        height = MAX_HEIGHT;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/jpeg', 0.8);
    };
  });
}

export async function storeMedia(file: File): Promise<string> {
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_VIDEO_SIZE = 25 * 1024 * 1024; // 25MB
  
  if (file.size > MAX_IMAGE_SIZE && file.type.startsWith('image/')) {
    throw new Error('Image size exceeds 5MB limit');
  }
  
  if (file.size > MAX_VIDEO_SIZE && file.type.startsWith('video/')) {
    throw new Error('Video size exceeds 25MB limit');
  }
  
  const id = crypto.randomUUID();
  let processedFile = file;
  
  if (file.type.startsWith('image/')) {
    processedFile = await compressImage(file);
  }
  
  const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        const metadata: MediaMetadata = {
          id,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          size: processedFile.size,
          mimeType: file.type,
          createdAt: new Date()
        };
        
        await db.put(STORE_NAME, reader.result, id);
        await db.put(STORE_NAME, metadata, `${id}_meta`);
        
        resolve(id);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(processedFile);
  });
}

export async function getMedia(id: string): Promise<string | null> {
  return db.get(STORE_NAME, id);
}

export async function deleteMedia(id: string): Promise<void> {
  await db.delete(STORE_NAME, id);
  await db.delete(STORE_NAME, `${id}_meta`);
}

export async function getMediaMetadata(id: string): Promise<MediaMetadata | null> {
  return db.get(STORE_NAME, `${id}_meta`);
}