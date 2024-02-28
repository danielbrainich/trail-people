# Generated by Django 4.2.7 on 2024-02-28 03:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("activities", "0005_savedtrail_delete_usertrail"),
        ("content", "0002_alter_postlike_options"),
    ]

    operations = [
        migrations.AddField(
            model_name="post",
            name="trail",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="posts",
                to="activities.trail",
            ),
        ),
    ]