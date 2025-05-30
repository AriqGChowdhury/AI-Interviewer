from django.urls import path
from . import views


urlpatterns = [
    path('register', views.UserRegistrationViews.as_view(), name='register'),
    path('previousQuestions', views.PreviousQuestionsViews.as_view(), name='previous'),
    path('login', views.UserLoginViews.as_view(), name='login'),
    path('delete', views.DeleteAccountViews.as_view(), name='delete'),
    path('questions/', views.generate_questions),
    path('leetcodeQs/', views.generate_leetcode_questions),
    path('checkAns', views.CheckAnswerView.as_view(), name='checkAns'),
    path('clearPrevQs', views.DeletePrevQs.as_view(), name='deletePrev'),
    path('logLeetcode', views.PreviousLeetcodeView.as_view(), name='leetcode'),
    path('reset', views.RequestResetView.as_view(), name='reset')
]


