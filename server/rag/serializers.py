from rest_framework import serializers

class DocumentSerializer(serializers.Serializer):
    id = serializers.CharField()
    content = serializers.CharField()
    metadata = serializers.JSONField()