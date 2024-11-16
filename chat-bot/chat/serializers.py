from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer( serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = ['id','username','password','email']

    def validate(self, data):
        if 'username' in data:
            # Check if email already exists
            if User.objects.filter(email=data['username']).exists():                
                error_msg = {"status": "001", "username": ["A user with that username already exists."]}
                raise serializers.ValidationError(error_msg)
        return data