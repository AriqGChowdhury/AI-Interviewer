from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class PreviousQuestions(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    id = models.AutoField(primary_key=True)
    question = models.CharField(max_length=1000, null=False)
    answer_text = models.CharField(max_length=1000, null=False)
    isCorrect = models.BooleanField(default=True, null=False)
    system_answer = models.CharField(max_length=1000, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
class UserScores(models.Model):
    question = models.ForeignKey(PreviousQuestions, on_delete=models.CASCADE)
    score = models.IntegerField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)

class TechnicalQuestions(models.Model):
    question = models.ForeignKey(PreviousQuestions, on_delete=models.CASCADE)
    tech_category = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Technical Question: {self.previous_question.questions}"

class NonTechQuestions(models.Model):
    question = models.ForeignKey(PreviousQuestions, on_delete=models.CASCADE)
    tech_category = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Non-Technical Question: {self.previous_question.questions}"

class PreviousLeetcode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    questions = models.CharField(max_length=100)
    link = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)