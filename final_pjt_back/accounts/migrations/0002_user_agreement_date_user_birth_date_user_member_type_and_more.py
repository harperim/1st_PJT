# Generated by Django 4.2.16 on 2024-11-20 00:34

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='agreement_date',
            field=models.DateTimeField(blank=True, null=True, verbose_name='약관 동의 일시'),
        ),
        migrations.AddField(
            model_name='user',
            name='birth_date',
            field=models.DateField(default=datetime.date(1900, 1, 1), verbose_name='생년월일'),
        ),
        migrations.AddField(
            model_name='user',
            name='member_type',
            field=models.CharField(choices=[('regular', '일반회원'), ('expert', '전문가회원')], default='regular', max_length=10, verbose_name='회원종류'),
        ),
        migrations.AddField(
            model_name='user',
            name='name',
            field=models.CharField(default='1900-01-01', max_length=30, verbose_name='이름'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='privacy_agreement',
            field=models.BooleanField(default=False, verbose_name='개인정보 처리방침 동의'),
        ),
        migrations.AddField(
            model_name='user',
            name='terms_agreement',
            field=models.BooleanField(default=False, verbose_name='서비스 이용약관 동의'),
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=254, unique=True, verbose_name='이메일'),
        ),
    ]
