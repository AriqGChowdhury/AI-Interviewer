# Generated by Django 5.2.1 on 2025-05-10 06:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('baseInterviewer', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='previousquestions',
            name='answer_text',
            field=models.CharField(default=2, max_length=1000),
            preserve_default=False,
        ),
    ]
