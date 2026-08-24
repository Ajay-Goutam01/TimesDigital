import React, { useState } from 'react';
import { Play, X, Video as VideoIcon } from 'lucide-react';
import { PageHero } from '../../../components/layout/PageHero';
import { Container } from '../../../components/layout/Container';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { AppImage } from '../../../components/ui/AppImage';
import { EmptyState } from '../../../components/ui/EmptyState';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { useGetPublicVideosQuery } from '../services/videoApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const VideosPage = () => {
  useDocumentTitle('Campus Video Library & Masterclasses');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeVideo, setActiveVideo] = useState(null);

  const { data, isLoading } = useGetPublicVideosQuery();
  const videos = data?.data?.videos || data?.data || [];

  const categories = ['All', 'Masterclass', 'Campus Tour', 'Toppers', 'Events'];

  const filteredVideos =
    selectedCategory === 'All'
      ? videos
      : videos.filter(
          (v) => v.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="w-full">
      <PageHero
        badge="Video Hub"
        title="Campus Video Library & Lecture Insights"
        subtitle="Watch classroom pedagogy demonstrations, mentor guidance clips, student topper reactions, and campus events."
        breadcrumbs={[{ label: 'Videos' }]}
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
                {cat} {cat !== 'All' && 'Videos'}
              </button>
            ))}
          </div>

          {/* Videos Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <CardSkeleton count={6} />
            </div>
          ) : filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((vid) => (
                <Card
                  key={vid._id}
                  hover
                  className="overflow-hidden flex flex-col justify-between h-full bg-white border border-[#E5E1D7] group"
                >
                  <div
                    className="relative cursor-pointer overflow-hidden"
                    onClick={() => setActiveVideo(vid)}
                  >
                    <AppImage
                      src={vid.thumbnail?.url}
                      alt={vid.title}
                      aspectRatio="course"
                      rounded="none"
                    />
                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center group-hover:bg-black/45 transition-colors">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#C5A55A] text-[#103728] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 ml-0.5 fill-current" />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A55A] block">
                        {vid.category || 'Classroom Video'}
                      </span>
                      <h3 className="text-base font-bold text-[#17231D] group-hover:text-[#164A35] transition-colors leading-snug">
                        {vid.title}
                      </h3>
                      {vid.description && (
                        <p className="text-xs text-[#68736D] line-clamp-2 leading-relaxed pt-1">
                          {vid.description}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveVideo(vid)}
                      className="pt-2 text-xs font-bold text-[#164A35] hover:text-[#103728] flex items-center gap-1 cursor-pointer text-left"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch Video</span>
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No videos found"
              message="No video recordings match the selected filter."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedCategory('All')}
                >
                  View All Videos
                </Button>
              }
            />
          )}

          {/* Video Player Modal */}
          {activeVideo && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="relative w-full max-w-4xl bg-black rounded-[20px] overflow-hidden shadow-2xl">
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="aspect-video w-full">
                  {activeVideo.youtubeId || activeVideo.videoUrl?.includes('youtube.com') || activeVideo.videoUrl?.includes('youtu.be') ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${
                        activeVideo.youtubeId ||
                        activeVideo.videoUrl.split('v=')[1]?.split('&')[0] ||
                        activeVideo.videoUrl.split('/').pop()
                      }?autoplay=1`}
                      title={activeVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <video
                      src={activeVideo.videoUrl}
                      controls
                      autoPlay
                      className="w-full h-full"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
};

export default VideosPage;
