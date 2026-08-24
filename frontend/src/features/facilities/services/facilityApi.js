import { baseApi } from '../../../services/api/baseApi';

export const facilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicFacilities: builder.query({
      query: (params) => ({
        url: '/facilities',
        params,
      }),
      providesTags: ['Facilities'],
    }),
    getFacilityBySlug: builder.query({
      query: (slug) => `/facilities/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Facilities', id: slug }],
    }),
    getAdminFacilities: builder.query({
      query: (params) => ({
        url: '/facilities/admin/list',
        params,
      }),
      providesTags: ['Facilities'],
    }),
    getAdminFacilityById: builder.query({
      query: (id) => `/facilities/admin/${id}`,
      providesTags: (result, error, id) => [{ type: 'Facilities', id }],
    }),
    createFacility: builder.mutation({
      query: (formData) => ({
        url: '/facilities',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Facilities'],
    }),
    updateFacility: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/facilities/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Facilities', id }, 'Facilities'],
    }),
    togglePublishFacility: builder.mutation({
      query: (id) => ({
        url: `/facilities/${id}/toggle-publish`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Facilities'],
    }),
    deleteFacility: builder.mutation({
      query: (arg) => {
        const id = typeof arg === 'string' ? arg : arg?.id;
        const permanent = typeof arg === 'object' && arg?.permanent;
        return {
          url: `/facilities/${id}${permanent ? '?permanent=true' : ''}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Facilities'],
    }),
  }),
});

export const {
  useGetPublicFacilitiesQuery,
  useGetFacilityBySlugQuery,
  useGetAdminFacilitiesQuery,
  useGetAdminFacilityByIdQuery,
  useCreateFacilityMutation,
  useUpdateFacilityMutation,
  useTogglePublishFacilityMutation,
  useDeleteFacilityMutation,
} = facilityApi;
