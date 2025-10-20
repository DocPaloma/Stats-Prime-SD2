from rest_framework import serializers
from .models import FarmEvent, FarmDrop, FarmSource, Game, FarmReward


class FarmDropSerializer(serializers.ModelSerializer):
    reward_name = serializers.CharField(source='reward.name', read_only=True)
    rarity = serializers.CharField(source='reward.get_rarity_display', read_only=True)

    class Meta:
        model = FarmDrop
        fields = ['reward', 'reward_name', 'rarity', 'quantity']


class FarmEventSerializer(serializers.ModelSerializer):
    drops = FarmDropSerializer(many=True, required=False)
    total_drops = serializers.IntegerField(read_only=True)

    class Meta:
        model = FarmEvent
        fields = ['id', 'farm_type', 'source', 'date', 'drops', 'total_drops']

    def validate(self, data):
        game_id = (
            self.context.get('view').kwargs.get('game_id')
            or self.context.get('view').kwargs.get('game_pk')
        )

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
        """
        La vista ya pasa user y game en serializer.save(),
        así que solo manejamos los drops aquí.
        """
        drops_data = validated_data.pop('drops', [])
        event = FarmEvent.objects.create(**validated_data)

        for drop_data in drops_data:
            FarmDrop.objects.create(event=event, **drop_data)

        return event

class FarmRewardSerializer(serializers.ModelSerializer):
    rarity_display = serializers.CharField(source='get_rarity_display', read_only=True)

    class Meta:
        model = FarmReward
        fields = ['id', 'name', 'rarity', 'rarity_display']


class FarmSourceSerializer(serializers.ModelSerializer):
    rewards = FarmRewardSerializer(many=True, read_only=True)

    class Meta:
        model = FarmSource
        fields = ['id', 'name', 'location', 'source_type', 'rewards']    

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'name']