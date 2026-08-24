import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, X } from 'lucide-react';
import { Container } from '../../../components/layout/Container';
import { SectionHeading } from '../../../components/layout/SectionHeading';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { AppImage } from '../../../components/ui/AppImage';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { useGetPublicVideosQuery } from '../../videos/services/videoApi';

export const VideoSection = ({ data }) => {
  const { data: videoData, isLoading } = useGetPublicVideosQuery({ limit: 3 });
  const videos = videoData?.data?.videos || videoData?.data || [];
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#FAF8F2]">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <SectionHeading
            badge="Video Library"
            title={data?.title || 'Campus Life & Academic Masterclasses'}
            subtitle={
              data?.subtitle ||
              'Watch classroom pedagogy clips, topper reaction interviews, and campus walkthroughs.'
            }
            align="left"
            className="mb-0"
          />

          <Link to="/videos" className="hidden sm:inline-block shrink-0">
            <Button variant="secondary" size="md" icon={ArrowRight} iconPosition="right">
              View All Videos
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton count={3} />
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((vid) => (
              <Card key={vid._id} hover className="overflow-hidden group flex flex-col h-full bg-white">
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
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-[#C5A55A] text-[#103728] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                  <span className="text-[11px] font-bold text-[#C5A55A] uppercase tracking-wider block">
                    {vid.category || 'Classroom Video'}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-[#17231D] group-hover:text-[#164A35] transition-colors leading-snug">
                    {vid.title}
                  </h3>
                </div>
              </Card>
            ))}
          </div>
        ) : null}

        {/* Video Player Modal */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="relative w-full max-w-3xl bg-black rounded-[18px] overflow-hidden shadow-2xl">
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
  );
};
