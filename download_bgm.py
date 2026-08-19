import urllib.request

url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
output_path = r"C:\Users\염상민\.gemini\antigravity\scratch\lms_platform\public\bgm.wav" # Keep .wav name or update component. Actually let's name it bgm.mp3

req = urllib.request.Request(
    url, 
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
)

try:
    with urllib.request.urlopen(req) as response, open(output_path, 'wb') as out_file:
        data = response.read()
        out_file.write(data)
    print("Download successful!")
except Exception as e:
    print(f"Error downloading: {e}")
