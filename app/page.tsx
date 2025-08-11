import PhotoUpload from './components/PhotoUpload';
import PhotoGallery from './components/PhotoGallery';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Photo Comment App</h1>
      <PhotoUpload />
      <PhotoGallery />
    </main>
  );
}

