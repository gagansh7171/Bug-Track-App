from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from django.contrib.auth.models import User
import os
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    disabled = models.BooleanField(default=False)
    admin = models.BooleanField(default=False)
    enr = models.IntegerField(default=0)
    display_picture = models.ImageField(upload_to='pic/', default='/pic/default_profile_photo.jpeg')

    def __str__(self):
        return self.user.username
@receiver(models.signals.pre_save, sender=Profile)
def auto_delete_file_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return False

    try:
        old_file = sender.objects.get(pk=instance.pk).display_picture
    except sender.DoesNotExist:
        return False
    
    new_file = instance.display_picture
    try :
        if not old_file == new_file:
            if os.path.isfile(old_file.path):
                os.remove(old_file.path)
    except:
        pass

class Projects(models.Model):
    project_name = models.CharField(max_length=37, unique=True)
    wiki = RichTextUploadingField()
    date = models.DateTimeField(auto_now_add=True)
    teams = models.ManyToManyField(User, related_name='projects')

    def __str__(self):
        return self.project_name

class Bug(models.Model):
    project = models.ForeignKey(Projects, on_delete=models.CASCADE, related_name='bugs')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True,blank=True, related_name='assigned')
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='mybugs')
    description = RichTextUploadingField()
    head = models.CharField(max_length=36)
    status = models.IntegerField(default=2)
    #0 means solved
    #1 means assigned
    #2 means created
    tag = models.IntegerField(default=7)
    # 7 bug
    # 6 Security
    # 5 help wanted
    # 4 wontfix
    # 3 enhancement
    # 2 Back-end
    # 1 Front-end
    # 0 Typo
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.id)
    
    class Meta:
        ordering = ['-status', '-date']


class Comments(models.Model):
    description = RichTextUploadingField()
    date = models.DateTimeField(auto_now_add=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mycomments')
    bug = models.ForeignKey(Bug, on_delete=models.CASCADE, related_name='comments')
    
    def __str__(self):
        return self.creator.username + ' ' + self.description[:15]
    class Meta:
        ordering = ['-date']

class CKImages(models.Model):
    imagehash = models.CharField(max_length=100)
    url = models.ImageField(upload_to='uploads/')
