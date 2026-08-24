import React from 'react';
import { Link } from 'react-router-dom';
import { Images, ArrowRight } from 'lucide-react';
import { Container } from '../../../components/layout/Container';
import { SectionHeading } from '../../../components/layout/SectionHeading';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { AppImage } from '../../../components/ui/AppImage';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { useGetPublicGalleryAlbumsQuery } from '../../gallery/services/galleryApi';

export const GallerySection = ({ data }) => {
  const { data: galleryData, isLoading } = useGetPublicGalleryAlbumsQuery({ limit: 4 });
  const albums = galleryData?.data?.albums || galleryData?.data || [];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white border-y border-[#E5E1D7]">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <SectionHeading
            badge="Campus Life"
            title={data?.title || 'Campus Moments & Photo Gallery'}
            subtitle={
              data?.subtitle ||
              'A glimpse into our campus activities, annual science festivals, seminars, and sports tournaments.'
            }
            align="left"
            className="mb-0"
          />

          <Link to="/gallery" className="hidden sm:inline-block shrink-0">
            <Button variant="secondary" size="md" icon={ArrowRight} iconPosition="right">
              View All Albums
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <CardSkeleton count={4} />
          </div>
        ) : albums.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {albums.map((album) => (
              <Link
                key={album._id}
                to={`/gallery/${album.slug || album._id}`}
                className="group block"
              >
                <Card hover className="overflow-hidden h-full flex flex-col justify-between">
                  <div className="relative overflow-hidden">
                    <AppImage
                      src={album.coverImage?.url || album.images?.[0]?.url}
                      alt={album.title}
                      aspectRatio="course"
                      rounded="none"
                    />
                    {album.images?.length > 0 && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Images className="w-3 h-3" />
                        <span>{album.images.length} Photos</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A55A] block">
                      {album.category || 'Event Album'}
                    </span>
                    <h3 className="text-sm font-bold text-[#17231D] group-hover:text-[#164A35] transition-colors leading-snug line-clamp-1">
                      {album.title}
                    </h3>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-8 text-center sm:hidden">
          <Link to="/gallery">
            <Button variant="secondary" size="md" className="w-full">
              View All Albums
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
};
