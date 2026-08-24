import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Images, Calendar, ArrowRight } from 'lucide-react';
import { PageHero } from '../../../components/layout/PageHero';
import { Container } from '../../../components/layout/Container';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { AppImage } from '../../../components/ui/AppImage';
import { EmptyState } from '../../../components/ui/EmptyState';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { useGetPublicGalleryAlbumsQuery } from '../services/galleryApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const GalleryPage = () => {
  useDocumentTitle('Campus Photo Gallery & Media Albums');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data, isLoading } = useGetPublicGalleryAlbumsQuery();
  const albums = data?.data?.albums || data?.data || [];

  const categories = ['All', 'Campus', 'Events', 'Academics', 'Sports', 'Celebrations'];

  const filteredAlbums =
    selectedCategory === 'All'
      ? albums
      : albums.filter(
          (a) => a.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="w-full">
      <PageHero
        badge="Campus Life in Photos"
        title="Photo Albums & Institutional Moments"
        subtitle="Explore life at TIME Public School and TIMES DIGITAL through photographs of campus events, science fairs, workshops, and sports meets."
        breadcrumbs={[{ label: 'Gallery' }]}
      />

      <section className="py-12 sm:py-16 md:py-20 bg-[#FAF8F2]">
        <Container>
          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-8 sm:mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#164A35] text-white shadow-xs'
                    : 'bg-white text-[#17231D] border border-[#E5E1D7] hover:bg-[#F3F0E7]'
                }`}
              >
                {cat} {cat !== 'All' && 'Albums'}
              </button>
            ))}
          </div>

          {/* Albums Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <CardSkeleton count={8} />
            </div>
          ) : filteredAlbums.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAlbums.map((album) => (
                <Link
                  key={album._id}
                  to={`/gallery/${album.slug || album._id}`}
                  className="group block h-full"
                >
                  <Card hover className="overflow-hidden flex flex-col justify-between h-full bg-white border border-[#E5E1D7]">
                    <div className="relative overflow-hidden">
                      <AppImage
                        src={album.coverImage?.url || album.images?.[0]?.url}
                        alt={album.title}
                        aspectRatio="course"
                        rounded="none"
                      />
                      {album.images?.length > 0 && (
                        <div className="absolute bottom-2 right-2 bg-black/75 text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Images className="w-3.5 h-3.5" />
                          <span>{album.images.length} Photos</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A55A] block">
                          {album.category || 'Event Album'}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-[#17231D] group-hover:text-[#164A35] transition-colors leading-snug line-clamp-2">
                          {album.title}
                        </h3>
                      </div>

                      <div className="pt-2 text-xs font-bold text-[#164A35] flex items-center gap-1">
                        <span>View Album</span>
                        <ArrowRight className="w-3 h-3 text-[#C5A55A]" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No albums found"
              message="No photo albums match the selected filter."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedCategory('All')}
                >
                  View All Albums
                </Button>
              }
            />
          )}
        </Container>
      </section>
    </div>
  );
};

export default GalleryPage;
