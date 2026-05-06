from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_str
from ..tokens import generate_token
from django.conf import settings
import os

class SetNewPassService:
    def __init__(self, data):
        self.__data = data

    def change(self):
        return self.__change()
    
    def __change(self):
        try:
            uidb64 = self.__data['uidb64']
            token = self.__data['token']
            if not generate_token.check_token(user, token):
                return "Invalid or expired token"
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            user.set_password(self.__data['newPassword'])
            user.save()
            return "Password changed."
        except Exception:
            user = None
        return "Password not changed."
        

class EmailService:
    def __init__(self, data):
        self.__data = data
        
    def send_mail(self):
        return self.__send_mail()
    
    def reset(self, token, uidb64):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        
        if user is not None and generate_token.check_token(user, token):
            return True
        return False
    
    def __send_mail(self):
        user = User.objects.filter(username=self.__data['username']).first()
        
            
        reset_link = f"{os.environ.get('BASE')}forgotpass-reset/{urlsafe_base64_encode(force_bytes(user.pk))}/{generate_token.make_token(user)}"
        email_subject = "Reset AI Interviewer Account Password"
        message = f"""
            Hi, {user.username}.
            To reset your password please click the link below!\n
            {reset_link}
        """
        send_mail(
            email_subject, 
            message, 
            settings.EMAIL_HOST_USER, 
            [user.email], 
            fail_silently=True
        )
        return "Success"
        
            
        