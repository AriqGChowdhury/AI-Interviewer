from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .models import *
from rest_framework import status, permissions
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.authentication import JWTAuthentication
import os
from groq import Groq
from django.http import JsonResponse
from sentence_transformers import SentenceTransformer, util

# Create your views here.

#User registration
class UserRegistrationViews(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print(request.data)
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#Login authentication
class UserLoginViews(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        return Response({
            'username': request.user.username,
            'email': request.user.email
        })




    def post(self, request):
        username = request.data['username']
        password = request.data['password']

        user = authenticate(request, username=username, password=password)

        if user is None:
            raise AuthenticationFailed('Invalid')
        
        
        return Response(
            {'message': 'success'}
        )
    

#Delete Account
class DeleteAccountViews(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def delete(self, request):
        try:
            user = request.user
            user.delete()
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'Account has been deleted.'}, status=status.HTTP_200_OK)
       



#Previous questions the user has answered
class PreviousQuestionsViews(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        previousQuestions = PreviousQuestions.objects.filter(user=request.user)
        serializer = PreviousQuestionsSerializer(previousQuestions, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = PreviousQuestionsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, questionID):
        try:
          question = PreviousQuestions.objects.get(questionID=questionID)
        except PreviousQuestions.DoesNotExist:
            return Response({'error': 'Question not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        question.delete()
        return Response(status=status.HTTP_200_OK)

#Reset Password
class RequestResetView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        old_pass = request.data['oldPassword']
        new_pass = request.data['newPassword']
        confirm = request.data['confirm']

        user = request.user

        if not user.check_password(old_pass):
            return Response({"message": "Incorrect password"})
        if new_pass != confirm:
            return Response({'message': "passwords do not match"})
        
        user.set_password(new_pass)
        user.save()

        return Response({"message": "Password changed"}, status=status.HTTP_200_OK)



#Generate Interview Quesetions
def generate_questions(request):
    client = Groq(
            api_key="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"
        )

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"""You are a software engineer recuiter giving an interview. Print out 12 technical questions include expected answers."
                Keep the formatting simple, for example questions 1 is 1. and expected answer for question 1 is A.
                Make sure none of these questions are generated: {PreviousQuestions.objects.all()}
                """
            }
        ],
        model="llama-3.3-70b-versatile",
    )
   

    return JsonResponse({"questions": chat_completion.choices[0].message.content})


#Generate Leetcode Questions
def generate_leetcode_questions(request):
    client = Groq(
            api_key="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"
        )

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"""Suggest 3 leetcode problems and provide the link. Include type also. Respond in this exact format: Type:Linked List Link:https://leetcode.com/link Problem: Reverse a linked list.
                Dont generate these questions: {PreviousLeetcode.objects.all()}
                """
            }
        ],
        model="llama-3.3-70b-versatile",
    )
    

    return JsonResponse({"questions": chat_completion.choices[0].message.content})


#Deletes Previous Questions when there are 50 previous questions 
class DeletePrevQs(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        PreviousQuestions.objects.filter(user=request.user).delete()
        return Response({"message": "Previous questions has reached a length of 50, will reset now."})

#Checks to see if user answer is correct
class CheckAnswerView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def __init__(self, **kwargs):
        self.threshold = 0.65

    def post(self, request):
        user = request.user
        userAns = request.data['answer']
        expectedAns = request.data['expected']
        model = SentenceTransformer('all-MiniLM-L6-v2')
        userEmb = model.encode(userAns, convert_to_tensor=True)
        expectedEmb = model.encode(expectedAns, convert_to_tensor=True)
        userScore = util.cos_sim(userEmb, expectedEmb).item()
        return Response({"correct?: ": userScore >= self.threshold, "score ":userScore})

#Prevents system from recommending the past 15 suggested leetcode problems
class PreviousLeetcodeView(APIView):
    
    def post(self, request):
        user = request.user
        question = request.data['question']
        link = request.data['link']
        if PreviousLeetcode.objects.count() > 15:
            PreviousLeetcode.objects.all().delete()
        
        serializer = PreviousLeetcodeSerializer(data={"questions":question, "link":link})
        if serializer.is_valid():
                serializer.save(user=user)
                return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    


    #Create temporary screen where it shows the score, possibly a page dedicated to previous interviews