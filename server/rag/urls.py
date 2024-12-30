from django.urls import path
from .views import AddFileAPIView, QueryRAGAPIView, ListDocumentsAPIView, DeleteDocumentAPIView

urlpatterns = [
    path('add-file/', AddFileAPIView.as_view(), name='add-file'),
    path('query/', QueryRAGAPIView.as_view(), name='query-rag'),
    path('list-documents/', ListDocumentsAPIView.as_view(), name='list-documents'),
    path('delete-document/', DeleteDocumentAPIView.as_view(), name='delete-document'),
]