import { baseApi } from '../../../services/api/baseApi';

export const eventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicEvents: builder.query({
      query: (params) => ({
        url: '/events',
        params,
      }),
      providesTags: ['Events'],
    }),
    getEventBySlug: builder.query({
      query: (slug) => `/events/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Events', id: slug }],
    }),
    getAdminEvents: builder.query({
      query: (params) => ({
        url: '/events/admin/list',
        params,
      }),
      providesTags: ['Events'],
    }),
    getAdminEventById: builder.query({
      query: (id) => `/events/admin/${id}`,
      providesTags: (result, error, id) => [{ type: 'Events', id }],
    }),
    createEvent: builder.mutation({
      query: (formData) => ({
        url: '/events',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Events'],
    }),
    updateEvent: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/events/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Events', id }, 'Events'],
    }),
    togglePublishEvent: builder.mutation({
      query: (id) => ({
        url: `/events/${id}/toggle-publish`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Events'],
    }),
    toggleFeatureEvent: builder.mutation({
      query: (id) => ({
        url: `/events/${id}/toggle-feature`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Events'],
    }),
    deleteEvent: builder.mutation({
      query: (arg) => {
        const id = typeof arg === 'string' ? arg : arg?.id;
        const permanent = typeof arg === 'object' && arg?.permanent;
        return {
          url: `/events/${id}${permanent ? '?permanent=true' : ''}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Events'],
    }),
  }),
});

export const {
  useGetPublicEventsQuery,
  useGetEventBySlugQuery,
  useGetAdminEventsQuery,
  useGetAdminEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useTogglePublishEventMutation,
  useToggleFeatureEventMutation,
  useDeleteEventMutation,
} = eventApi;
