import glob
import shutil

thumb_files = glob.glob('D:/복순할매/*.png')
video_files = glob.glob('D:/복순할매/*.mp4')

if thumb_files:
    shutil.copy(thumb_files[0], 'C:/Users/염상민/.gemini/antigravity/scratch/lms_platform/public/boksoon_thumb.png')
    print("Thumbnail copied.")
else:
    print("Thumbnail not found.")

if video_files:
    shutil.copy(video_files[0], 'C:/Users/염상민/.gemini/antigravity/scratch/lms_platform/public/boksoon_video.mp4')
    print("Video copied.")
else:
    print("Video not found.")
