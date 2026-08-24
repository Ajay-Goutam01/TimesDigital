import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { AppImage } from '../../../components/ui/AppImage';

export const CourseCard = ({ course }) => {
  if (!course) return null;

  return (
    <Card hover className="flex flex-col h-full overflow-hidden group">
      {/* Course Cover Image */}
      <div className="relative">
        <AppImage
          src={course.image?.url}
          alt={course.title}
          aspectRatio="course"
          rounded="none"
        />
        {course.category && (
          <div className="absolute top-3 left-3">
            <Badge variant="dark" size="sm">
              {course.category}
            </Badge>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-xs text-[#68736D]">
            {course.duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#C5A55A]" />
                {course.duration}
              </span>
            )}
            {course.class && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#C5A55A]" />
                Class {course.class}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-[#17231D] group-hover:text-[#164A35] transition-colors leading-snug">
            {course.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#68736D] line-clamp-2 leading-relaxed">
            {course.shortDescription || course.description}
          </p>

          {/* Key Features List */}
          {course.features && course.features.length > 0 && (
            <ul className="pt-2 space-y-1.5 border-t border-[#E5E1D7]">
              {course.features.slice(0, 3).map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-[#17231D]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A55A] shrink-0" />
                  <span className="truncate">{feat}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Card Actions */}
        <div className="pt-3 border-t border-[#E5E1D7] flex items-center justify-between gap-2">
          <Link to={`/courses/${course.slug || course._id}`} className="w-full">
            <Button
              variant="secondary"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              className="w-full"
            >
              Explore Course
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};
