# Generated by Django 5.2.1 on 2025-05-10 06:07

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('baseInterviewer', '0002_previousquestions_answer_text'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserScores',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('rightAnswers', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='baseInterviewer.rightanswer')),
                ('wrongAnswers', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='baseInterviewer.wronganswer')),
            ],
        ),
    ]
