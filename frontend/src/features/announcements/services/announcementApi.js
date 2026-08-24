import { baseApi } from '../../../services/api/baseApi';

export const announcementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicAnnouncements: builder.query({
      query: (params) => ({
        url: '/announcements',
        params,
      }),
      providesTags: ['Announcements'],
    }),
    getAnnouncementBySlug: builder.query({
      query: (slug) => `/announcements/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Announcements', id: slug }],
    }),
    getAdminAnnouncements: builder.query({
      query: (params) => ({
        url: '/announcements/admin/list',
        params,
      }),
      providesTags: ['Announcements'],
    }),
    getAdminAnnouncementById: builder.query({
      query: (id) => `/announcements/admin/${id}`,
      providesTags: (result, error, id) => [{ type: 'Announcements', id }],
    }),
    createAnnouncement: builder.mutation({
      query: (formData) => ({
        url: '/announcements',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Announcements'],
    }),
    updateAnnouncement: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/announcements/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Announcements', id }, 'Announcements'],
    }),
    togglePublishAnnouncement: builder.mutation({
      query: (id) => ({
        url: `/announcements/${id}/toggle-publish`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Announcements'],
    }),
    deleteAnnouncement: builder.mutation({
      query: (arg) => {
        const id = typeof arg === 'string' ? arg : arg?.id;
        const permanent = typeof arg === 'object' && arg?.permanent;
        return {
          url: `/announcements/${id}${permanent ? '?permanent=true' : ''}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Announcements'],
    }),
  }),
});

export const {
  useGetPublicAnnouncementsQuery,
  useGetAnnouncementBySlugQuery,
  useGetAdminAnnouncementsQuery,
  useGetAdminAnnouncementByIdQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useTogglePublishAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = announcementApi;
