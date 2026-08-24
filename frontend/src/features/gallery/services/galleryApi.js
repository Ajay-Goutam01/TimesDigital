import { baseApi } from '../../../services/api/baseApi';

export const galleryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicGalleryAlbums: builder.query({
      query: (params) => ({
        url: '/gallery',
        params,
      }),
      providesTags: ['Gallery'],
    }),
    getGalleryAlbumBySlug: builder.query({
      query: (slug) => `/gallery/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Gallery', id: slug }],
    }),
    getAdminGalleryAlbums: builder.query({
      query: (params) => ({
        url: '/gallery/admin/list',
        params,
      }),
      providesTags: ['Gallery'],
    }),
    getAdminGalleryAlbumById: builder.query({
      query: (id) => `/gallery/admin/${id}`,
      providesTags: (result, error, id) => [{ type: 'Gallery', id }],
    }),
    createGalleryAlbum: builder.mutation({
      query: (formData) => ({
        url: '/gallery',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Gallery'],
    }),
    updateGalleryAlbum: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/gallery/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Gallery', id }, 'Gallery'],
    }),
    togglePublishGalleryAlbum: builder.mutation({
      query: (id) => ({
        url: `/gallery/${id}/toggle-publish`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Gallery'],
    }),
    toggleFeatureGalleryAlbum: builder.mutation({
      query: (id) => ({
        url: `/gallery/${id}/toggle-feature`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Gallery'],
    }),
    deleteGalleryAlbum: builder.mutation({
      query: (arg) => {
        const id = typeof arg === 'string' ? arg : arg?.id;
        const permanent = typeof arg === 'object' && arg?.permanent;
        return {
          url: `/gallery/${id}${permanent ? '?permanent=true' : ''}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Gallery'],
    }),
  }),
});

export const {
  useGetPublicGalleryAlbumsQuery,
  useGetGalleryAlbumBySlugQuery,
  useGetAdminGalleryAlbumsQuery,
  useGetAdminGalleryAlbumByIdQuery,
  useCreateGalleryAlbumMutation,
  useUpdateGalleryAlbumMutation,
  useTogglePublishGalleryAlbumMutation,
  useToggleFeatureGalleryAlbumMutation,
  useDeleteGalleryAlbumMutation,
} = galleryApi;
