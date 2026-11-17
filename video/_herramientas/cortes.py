"""Detecta los cortes de un video de referencia (frame y segundo) para copiar su ritmo.
uso: python3 cortes.py referencia.mp4 [umbral=18]"""
import subprocess, sys, numpy as np
p = sys.argv[1]; th = float(sys.argv[2]) if len(sys.argv) > 2 else 18
fps = eval(subprocess.check_output(['ffprobe','-v','error','-select_streams','v','-show_entries','stream=r_frame_rate','-of','csv=p=0',p]).decode().strip())
raw = subprocess.run(['ffmpeg','-v','error','-i',p,'-vf','scale=36:64,format=gray','-f','rawvideo','-'],capture_output=True).stdout
a = np.frombuffer(raw, np.uint8).reshape(-1, 64, 36).astype(float)
d = np.abs(np.diff(a, axis=0)).mean((1, 2))
cuts = [i + 1 for i in np.where(d > th)[0]]
print(f'fps={fps} frames={len(a)}'); print('cortes (frame):', cuts); print('cortes (s):', [round(c / fps, 3) for c in cuts])
