import { baseApi } from '../../../services/api/baseApi';

export const enquiryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitEnquiry: builder.mutation({
      query: (enquiryData) => ({
        url: '/enquiries',
        method: 'POST',
        body: enquiryData,
      }),
      invalidatesTags: ['Enquiries', 'DashboardStats'],
    }),
    getAdminEnquiries: builder.query({
      query: (params) => ({
        url: '/enquiries',
        params,
      }),
      providesTags: ['Enquiries'],
    }),
    getEnquiryById: builder.query({
      query: (id) => `/enquiries/${id}`,
      providesTags: (result, error, id) => [{ type: 'Enquiries', id }],
    }),
    updateEnquiryStatus: builder.mutation({
      query: ({ id, status, note }) => ({
        url: `/enquiries/${id}/status`,
        method: 'PATCH',
        body: { status, note },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Enquiries', id }, 'Enquiries', 'DashboardStats'],
    }),
    deleteEnquiry: builder.mutation({
      query: (arg) => {
        const id = typeof arg === 'string' ? arg : arg?.id;
        const permanent = typeof arg === 'object' && arg?.permanent;
        return {
          url: `/enquiries/${id}${permanent ? '?permanent=true' : ''}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Enquiries', 'DashboardStats'],
    }),
  }),
});

export const {
  useSubmitEnquiryMutation,
  useGetAdminEnquiriesQuery,
  useGetAdminEnquiriesQuery: useGetEnquiriesQuery,
  useGetEnquiryByIdQuery,
  useUpdateEnquiryStatusMutation,
  useDeleteEnquiryMutation,
} = enquiryApi;

