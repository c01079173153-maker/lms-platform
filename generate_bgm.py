import numpy as np
from scipy.io import wavfile

fs = 44100
duration = 10  # seconds
t = np.linspace(0, duration, fs * duration, endpoint=False)

# Create a soothing, quiet ambient pad (A major chord: A3, C#4, E4)
freqs = [220.0, 277.18, 329.63]
audio = np.zeros_like(t)

for f in freqs:
    # Gentle sine wave with a slow LFO for volume
    lfo = 0.5 + 0.5 * np.sin(2 * np.pi * 0.1 * t)
    wave = np.sin(2 * np.pi * f * t) * lfo
    audio += wave

# Normalize and make it very quiet (volume 0.05)
audio = audio / np.max(np.abs(audio)) * 0.05

# Convert to 16-bit PCM
audio_int16 = (audio * 32767).astype(np.int16)

# Save to public directory
wavfile.write(r'C:\Users\염상민\.gemini\antigravity\scratch\lms_platform\public\bgm.wav', fs, audio_int16)
print("BGM generated successfully!")
