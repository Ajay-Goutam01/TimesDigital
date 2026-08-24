import React from 'react';
import { Link } from 'react-router-dom';
import { Award, GraduationCap, ArrowRight } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { AppImage } from '../../../components/ui/AppImage';

export const FacultyCard = ({ faculty }) => {
  if (!faculty) return null;

  return (
    <Card hover className="flex flex-col h-full overflow-hidden group">
      {/* 4:5 Portrait Photo */}
      <div className="relative overflow-hidden">
        <AppImage
          src={faculty.profilePhoto?.url}
          alt={faculty.name}
          aspectRatio="faculty"
          rounded="none"
        />
        {faculty.category && (
          <div className="absolute top-3 left-3">
            <Badge variant="dark" size="sm">
              {faculty.category}
            </Badge>
          </div>
        )}
        {faculty.isExKota && (
          <div className="absolute top-3 right-3">
            <Badge variant="gold" size="sm">
              Ex-Kota Faculty
            </Badge>
          </div>
        )}
      </div>

      {/* Faculty Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5A55A] block">
            {faculty.subject || 'Faculty Mentor'}
          </span>
          <h3 className="text-base sm:text-lg font-extrabold text-[#17231D] group-hover:text-[#164A35] transition-colors leading-snug">
            {faculty.name}
          </h3>
          <p className="text-xs text-[#68736D] font-medium">
            {faculty.designation}
          </p>
        </div>

        {faculty.experienceYears && (
          <div className="pt-2 border-t border-[#E5E1D7] flex items-center justify-center gap-1.5 text-xs text-[#164A35] font-semibold">
            <Award className="w-3.5 h-3.5 text-[#C5A55A]" />
            <span>{faculty.experienceYears}+ Years Experience</span>
          </div>
        )}

        <Link
          to={`/faculty/${faculty.slug || faculty._id}`}
          className="pt-2 text-center text-xs font-bold text-[#164A35] hover:text-[#103728] flex items-center justify-center gap-1 transition-colors"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3 h-3 text-[#C5A55A]" />
        </Link>
      </div>
    </Card>
  );
};
