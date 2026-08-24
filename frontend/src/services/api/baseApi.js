import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL || '/api';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include',
  }),
  tagTypes: [
    'Auth',
    'WebsiteSettings',
    'Homepage',
    'Courses',
    'Batches',
    'Faculty',
    'Results',
    'Gallery',
    'Videos',
    'Announcements',
    'Events',
    'Facilities',
    'Testimonials',
    'Admissions',
    'Enquiries',
    'AdminUsers',
    'DashboardStats',
  ],
  endpoints: () => ({}),
});
