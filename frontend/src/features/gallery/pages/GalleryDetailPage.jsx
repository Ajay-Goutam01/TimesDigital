import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Images, ArrowLeft, Eye } from 'lucide-react';
import { PageHero } from '../../../components/layout/PageHero';
import { Container } from '../../../components/layout/Container';
import { Button } from '../../../components/ui/Button';
import { AppImage } from '../../../components/ui/AppImage';
import { ImageLightbox } from '../../../components/ui/ImageLightbox';
import { PageLoader } from '../../../components/ui/Loader';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useGetGalleryAlbumBySlugQuery } from '../services/galleryApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const GalleryDetailPage = () => {
  const { slug } = useParams();
  const { data, isLoading, isError, refetch } = useGetGalleryAlbumBySlugQuery(slug);
  const album = data?.data?.album || data?.data;

  useDocumentTitle(album?.title || 'Album Details');

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (isLoading) return <PageLoader message="Loading photo album..." />;
  if (isError || !album) {
    return (
      <Container className="py-20">
        <ErrorState
          title="Album Not Found"
          message="The requested photo album could not be loaded."
          onRetry={refetch}
        />
      </Container>
    );
  }

  const images = album.images || [];

  const handleOpenLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="w-full">
      <PageHero
        badge={album.category || 'Gallery Album'}
        title={album.title}
        subtitle={album.description}
        breadcrumbs={[
          { label: 'Gallery', path: '/gallery' },
          { label: album.title },
        ]}
        actions={
          <Link to="/gallery">
            <Button variant="secondary" size="sm" icon={ArrowLeft}>
              Back to All Albums
            </Button>
          </Link>
        }
      />

      <section className="py-12 sm:py-16 md:py-20 bg-[#FAF8F2]">
        <Container>
          {images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => handleOpenLightbox(idx)}
                  className="group relative rounded-[16px] overflow-hidden border border-[#E5E1D7] shadow-xs cursor-pointer bg-white"
                >
                  <AppImage
                    src={img.url || img}
                    alt={img.caption || `${album.title} photo ${idx + 1}`}
                    aspectRatio="course"
                    rounded="none"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
                      <Eye className="w-5 h-5" />
                    </div>
                  </div>
                  {img.caption && (
                    <div className="p-3 bg-white text-xs font-semibold text-[#17231D] truncate">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No photos in this album"
              message="This album does not currently contain uploaded images."
            />
          )}

          {/* Lightbox Component */}
          <ImageLightbox
            isOpen={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            images={images}
            currentIndex={lightboxIndex}
            onIndexChange={setLightboxIndex}
          />
        </Container>
      </section>
    </div>
  );
};

export default GalleryDetailPage;
