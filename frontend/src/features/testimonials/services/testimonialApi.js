import { baseApi } from '../../../services/api/baseApi';

export const testimonialApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicTestimonials: builder.query({
      query: (params) => ({
        url: '/testimonials',
        params,
      }),
      providesTags: ['Testimonials'],
    }),
    getAdminTestimonials: builder.query({
      query: (params) => ({
        url: '/testimonials/admin/list',
        params,
      }),
      providesTags: ['Testimonials'],
    }),
    getAdminTestimonialById: builder.query({
      query: (id) => `/testimonials/admin/${id}`,
      providesTags: (result, error, id) => [{ type: 'Testimonials', id }],
    }),
    createTestimonial: builder.mutation({
      query: (formData) => ({
        url: '/testimonials',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Testimonials'],
    }),
    updateTestimonial: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/testimonials/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Testimonials', id }, 'Testimonials'],
    }),
    togglePublishTestimonial: builder.mutation({
      query: (id) => ({
        url: `/testimonials/${id}/toggle-publish`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Testimonials'],
    }),
    deleteTestimonial: builder.mutation({
      query: (arg) => {
        const id = typeof arg === 'string' ? arg : arg?.id;
        const permanent = typeof arg === 'object' && arg?.permanent;
        return {
          url: `/testimonials/${id}${permanent ? '?permanent=true' : ''}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Testimonials'],
    }),
  }),
});

export const {
  useGetPublicTestimonialsQuery,
  useGetAdminTestimonialsQuery,
  useGetAdminTestimonialByIdQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useTogglePublishTestimonialMutation,
  useDeleteTestimonialMutation,
} = testimonialApi;
