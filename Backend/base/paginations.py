from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class MyPagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 16
    page_query_param = 'page'
    last_page_strings = ['last', 'end']

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'page_size': self.page.paginator.per_page, 
            'results': data,
        })