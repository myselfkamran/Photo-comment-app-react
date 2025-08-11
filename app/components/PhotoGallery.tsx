'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Comment {
  id: string;
  content: string;
}

interface Photo {
  id: string;
  url: string;
  comments: Comment[];
}

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPhotos();
    window.addEventListener('photoUploaded', fetchPhotos);
    return () => window.removeEventListener('photoUploaded', fetchPhotos);
  }, []);

  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/photos');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setPhotos(data.photos);
        } else {
          throw new Error(data.error || 'Failed to fetch photos');
        }
      } else {
        throw new Error('Failed to fetch photos');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (photoId: string, content: string) => {
    try {
      const res = await fetch('/api/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photoId, content }),
      });

      if (res.ok) {
        fetchPhotos();
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      console.error('Comment error:', error);
      setError(error instanceof Error ? error.message : 'Failed to add comment');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="border rounded-lg p-4">
          <Image src={photo.url} alt="Uploaded photo" width={300} height={300} className="w-full h-64 object-cover mb-4" />
          <div className="mb-4">
            {photo.comments.map((comment) => (
              <p key={comment.id} className="text-sm text-gray-600 mb-1">{comment.content}</p>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const input = form.elements.namedItem('comment') as HTMLInputElement;
              addComment(photo.id, input.value);
              form.reset();
            }}
            className="flex"
          >
            <input 
              name="comment" 
              type="text" 
              className="flex-grow border rounded-l-md p-2" 
              placeholder="Add a comment..."
            />
            <button 
              type="submit" 
              className="bg-green-500 text-white px-4 py-2 rounded-r-md"
            >
              Post
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}

