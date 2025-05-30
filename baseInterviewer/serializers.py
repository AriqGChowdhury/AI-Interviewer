from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

class UserRegistrationSerializer(serializers.ModelSerializer):
    pass2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'pass2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['pass2']:
            print("unmatch pass")
            raise serializers.ValidationError({'password': 'password fields do not match'})
        return attrs
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    
class PreviousQuestionsSerializer(serializers.ModelSerializer):

    class Meta:
        model = PreviousQuestions
        fields = ['questionID', 'question', 'answer_text']


class PreviousLeetcodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreviousLeetcode
        fields = ['questions', 'link']