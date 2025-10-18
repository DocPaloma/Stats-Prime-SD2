from rest_framework import serializers
from .models import FarmEvent, FarmSource, Game

class FarmEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmEvent
        fields = ['id', 'farm_type', 'source', 'date']

    def validate(self, data):
        request = self.context.get('request')
        game_id = self.context.get('view').kwargs.get('game_id')

        if not game_id:
            raise serializers.ValidationError("El ID del juego es requerido en la URL.")

        source = data.get('source')

        # Validar que la fuente pertenezca al mismo juego
        if source.game.id != int(game_id):
            raise serializers.ValidationError(
                f"La fuente '{source.name}' no pertenece al juego actual."
            )

        return data

    def create(self, validated_data):
        user = self.context['request'].user
        game_id = self.context['view'].kwargs.get('game_id')
        game = Game.objects.get(id=game_id)
        return FarmEvent.objects.create(user=user, game=game, **validated_data)
