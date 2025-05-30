from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class PreviousQuestions(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    questionID = models.AutoField(primary_key=True)
    question = models.CharField(max_length=1000)
    answer_text = models.CharField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.question} (User: {self.user.username})"
    
class Answer(models.Model):
    question = models.ForeignKey(PreviousQuestions, on_delete=models.CASCADE)
    answer_text = models.CharField(max_length=1000)
    is_correct = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{'Correct' if self.is_correct else 'Wrong'}: {self.answer_text}"

class UserScores(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(PreviousQuestions, on_delete=models.CASCADE)
    is_correct = models.BooleanField(default=False)
    answer_text = models.ForeignKey(Answer, on_delete=models.CASCADE )
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