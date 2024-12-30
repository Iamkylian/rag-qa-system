import os
import re

from django.conf import settings
from django.http import JsonResponse, StreamingHttpResponse
from django.shortcuts import render
from django.utils.text import slugify
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from django_eventstream import send_event
from langchain_chroma import Chroma

from .get_embedding_function import get_embedding_function
from .populate_database import add_to_chroma, load_documents, split_documents, populate_database
from .query_data import query_rag

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser

from rest_framework import status

class AddFileAPIView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        uploaded_files = request.FILES.getlist("files")
        for uploaded_file in uploaded_files:
            # Sauvegarder les fichiers et les traiter
            filename = uploaded_file.name
            file_path = f"{settings.DATA_PATH}/{filename}"
            with open(file_path, "wb") as f:
                for chunk in uploaded_file.chunks():
                    f.write(chunk)

        # Recharger les documents dans la base Chroma
        populate_database()
        return Response({"message": "Fichiers ajoutés avec succès"})

class QueryRAGAPIView(APIView):
    def post(self, request):
        query_text = request.data.get("query")
        if not query_text:
            return Response({"error": "La requête est vide"}, status=400)

        response_generator, sources = query_rag(query_text)
        response_text = "".join(response_generator)
        return Response({"response": response_text, "sources": sources})


class ListDocumentsAPIView(APIView):
    def get(self, request):
        db = Chroma(
            persist_directory=settings.CHROMA_PATH,
            embedding_function=get_embedding_function(),
        )
        documents = db.get(include=["documents"])["ids"]
        return Response({"documents": documents})


class DeleteDocumentAPIView(APIView):
    def post(self, request):
        doc_id = request.data.get("doc_id")  # Récupérer l'ID du document à supprimer
        if not doc_id:
            return Response({"error": "L'ID du document est requis"}, status=status.HTTP_400_BAD_REQUEST)

        # Charger la base de données Chroma
        db = Chroma(
            persist_directory=settings.CHROMA_PATH,
            embedding_function=get_embedding_function(),
        )

        # Supprimer le document de la base
        try:
            db.delete(ids=[doc_id])
            return Response({"message": f"Document {doc_id} supprimé avec succès"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
