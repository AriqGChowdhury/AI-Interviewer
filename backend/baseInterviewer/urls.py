from django.urls import path
from . import views


urlpatterns = [
    path('register', views.UserRegistrationViews.as_view(), name='register'),
    path('previousQuestions', views.PreviousQuestionsViews.as_view(), name='previous'),
    path('login', views.UserLoginViews.as_view(), name='login'),
    path('forgotPass',views.ForgotPassView.as_view(), name='forgot'),
    path('forgotpass-reset/<uidb64>/<token>', views.ForgotPassResetView.as_view(), name='reset-pass-email'),
    path('set-new-pass', views.SetNewPassView.as_view(), name='new-pass'),
    path('delete', views.DeleteAccountViews.as_view(), name='delete'),
    path('questions/', views.generate_questions),
    path('leetcodeQs/', views.MultiLeetcodeView.as_view(), name='multi'),
    path('1/leetcodeQs/', views.OneLeetcodeView.as_view(), name='one'),
    path('checkAns', views.CheckAnswerView.as_view(), name='checkAns'),
    path('clearPrevQs', views.DeletePrevQs.as_view(), name='deletePrev'),
    path('logLeetcode', views.PreviousLeetcodeView.as_view(), name='leetcode'),
    path('reset', views.RequestResetView.as_view(), name='reset'),
    path('me', views.GetUserView.as_view(), name='me')
]


