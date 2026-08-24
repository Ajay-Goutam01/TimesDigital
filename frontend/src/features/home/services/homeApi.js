import { baseApi } from '../../../services/api/baseApi';

export const homeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHomepageData: builder.query({
      query: () => '/homepage',
      providesTags: ['Homepage'],
    }),
    updateHomepageData: builder.mutation({
      query: (formData) => ({
        url: '/homepage',
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Homepage'],
    }),
  }),
});

export const {
  useGetHomepageDataQuery,
  useUpdateHomepageDataMutation,
} = homeApi;
