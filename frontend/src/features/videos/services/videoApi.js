import { baseApi } from '../../../services/api/baseApi';

export const videoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicVideos: builder.query({
      query: (params) => ({
        url: '/videos',
        params,
      }),
      providesTags: ['Videos'],
    }),
    getAdminVideos: builder.query({
      query: (params) => ({
        url: '/videos/admin/list',
        params,
      }),
      providesTags: ['Videos'],
    }),
    getAdminVideoById: builder.query({
      query: (id) => `/videos/admin/${id}`,
      providesTags: (result, error, id) => [{ type: 'Videos', id }],
    }),
    createVideo: builder.mutation({
      query: (formData) => ({
        url: '/videos',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Videos'],
    }),
    updateVideo: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/videos/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Videos', id }, 'Videos'],
    }),
    togglePublishVideo: builder.mutation({
      query: (id) => ({
        url: `/videos/${id}/toggle-publish`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Videos'],
    }),
    toggleFeatureVideo: builder.mutation({
      query: (id) => ({
        url: `/videos/${id}/toggle-feature`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Videos'],
    }),
    deleteVideo: builder.mutation({
      query: (arg) => {
        const id = typeof arg === 'string' ? arg : arg?.id;
        const permanent = typeof arg === 'object' && arg?.permanent;
        return {
          url: `/videos/${id}${permanent ? '?permanent=true' : ''}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Videos'],
    }),
  }),
});

export const {
  useGetPublicVideosQuery,
  useGetAdminVideosQuery,
  useGetAdminVideoByIdQuery,
  useCreateVideoMutation,
  useUpdateVideoMutation,
  useTogglePublishVideoMutation,
  useToggleFeatureVideoMutation,
  useDeleteVideoMutation,
} = videoApi;
