# -*- coding: utf-8 -*-
"""
👑 조선힙합소리꾼 × AI 무료 나눔 홈페이지 자동 관리기 (GUI v3)
- 탭 1: 🎵 홈페이지 명곡 선곡표 & 첫 시작 음악 지정 (수정/저장 기능 탑재)
- 탭 2: 📺 메인 화면 유튜브 영상 쇼케이스 관리 (선택 시 자동 불러오기 & 수정/저장 기능, 8대 카테고리, 배지 선택 콤보박스)
- 탭 3: 🛠️ 무료 프로그램 / 전자책 / 자료실 관리 (선택 시 수정/저장 기능)
- 공통: 음악 무단 다운로드 원천 방지 처리 완료
"""
import json
import os
import re
import shutil
import subprocess
import threading
import time
import urllib.request
import urllib.parse
import webbrowser
from pathlib import Path
import tkinter as tk
from tkinter import ttk, filedialog, messagebox

BASE_DIR = Path(r"D:\lms_platform")
BGM_JSON = BASE_DIR / "src" / "data" / "bgm.json"
SONGS_JSON = BASE_DIR / "src" / "data" / "songs.json"
PROGRAMS_JSON = BASE_DIR / "src" / "data" / "programs.json"
SUNO_PROMPTS_JSON = BASE_DIR / "src" / "data" / "suno_prompts.json"
SORIKKUN_PUBLIC_DIR = BASE_DIR / "public" / "sorikkun"
DOWNLOADS_PUBLIC_DIR = BASE_DIR / "public" / "downloads"
SITE_URL = "https://lms-platform-ten-coral.vercel.app/"

SORIKKUN_PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
DOWNLOADS_PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

CATEGORIES_DICT = {
    "comfort": "😭 눈물·인생 위로곡",
    "cider": "🤬 속시원한 사이다곡",
    "parents": "🙇 부모님·가족 효도곡",
    "work": "💼 직장인·퇴근길 공감곡",
    "healing": "🌙 새벽 감성·힐링곡",
    "gugak": "🥁 국악·사자후 힙합",
    "hope": "🌅 희망·응원·역전곡",
    "playlist": "🎶 연속듣기·모음집",
}


SUNO_CATEGORIES = [
    "EDM / 페스티벌",
    "국악 힙합",
    "붐뱁 & 트랩",
    "감성 발라드",
    "판소리 록",
    "팝 & 댄스",
    "힐링 & 명상",
    "기타 장르",
]

SUNO_BADGE_PRESETS = [
    "🔥 140 BPM 페스티벌 드롭",
    "👑 시그니처 판소리 트랩",
    "😭 눈물주의 감성 발라드",
    "🥁 가슴을 울리는 국악 비트",
    "✨ 추천 명곡 스타일",
    "⚡ 폭발적인 댄스 앤섬",
    "🌙 새벽 감성 칠(Chill)",
    "직접 입력",
]

def translate_en_to_ko_helper(text: str) -> str:
    if not text or not text.strip():
        return ""
    try:
        url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=" + urllib.parse.quote(text.strip())
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return "".join([part[0] for part in data[0] if part[0]])
    except Exception as e:
        return f"[번역 실패: {e}]"

def fetch_suno_details_helper(suno_url: str):
    suno_url = suno_url.strip()
    if not suno_url:
        return None
    req = urllib.request.Request(suno_url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    with urllib.request.urlopen(req, timeout=12) as resp:
        final_url = resp.geturl()
        html = resp.read().decode("utf-8", errors="ignore")

    clip_id = ""
    m = re.search(r"song/([a-f0-9-]{36})", final_url)
    if not m:
        m = re.search(r"([a-f0-9-]{36})", html)
    if m:
        clip_id = m.group(1)

    title = ""
    tm = re.search(r'<meta property="og:title" content="(.*?)"', html)
    if tm:
        title = tm.group(1).replace("&amp;", "&")

    tags = ""
    tags_m = re.search(r'\\?"tags\\?":\s*\\?"(.*?)\\?"', html)
    if tags_m:
        tags = tags_m.group(1).encode("utf-8", errors="ignore").decode("unicode_escape", errors="ignore")

    lyrics = ""
    pm = re.search(r'\\?"prompt\\?":\s*\\?"(.*?)(?=\\?",\\?"type\\?")', html)
    if pm:
        raw_l = pm.group(1).encode("utf-8", errors="ignore").decode("unicode_escape", errors="ignore")
        lyrics = raw_l.replace(r"\n", "\n").replace(r'\"', '"').replace(r"\'", "'")

    image_url = f"https://cdn2.suno.ai/image_large_{clip_id}.jpeg" if clip_id else ""
    audio_url = f"https://d2lwuy8qc234o3.cloudfront.net/1/clip/{clip_id}.m4a" if clip_id else ""

    return {
        "title": title,
        "clip_id": clip_id,
        "tags": tags,
        "lyrics": lyrics,
        "image_url": image_url,
        "audio_url": audio_url,
    }

BADGE_PRESETS = [
    "🔥 최신 신곡",
    "😭 눈물 주의 대표곡",
    "🤬 속시원한 사이다",
    "🌿 5060 폭풍 공감",
    "👑 조선힙합소리꾼 명곡",
    "💼 직장인 필청곡",
    "🙇 부모님 헌정곡",
    "🌙 새벽 감성 힐링",
    "🥁 국악 힙합 사자후",
    "🌅 인생 응원가",
    "🎶 연속듣기 인기 모음집",
]

def extract_youtube_id(url_or_id: str) -> str:
    s = url_or_id.strip()
    if re.fullmatch(r"[A-Za-z0-9_-]{11}", s):
        return s
    patterns = [
        r"youtu\.be/([A-Za-z0-9_-]{11})",
        r"v=([A-Za-z0-9_-]{11})",
        r"shorts/([A-Za-z0-9_-]{11})",
        r"embed/([A-Za-z0-9_-]{11})",
    ]
    for p in patterns:
        m = re.search(p, s)
        if m:
            return m.group(1)
    return s

def load_json(path: Path, default_val):
    if not path.exists():
        return default_val
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default_val

def save_json(path: Path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

class HomepageManagerApp:
    def __init__(self, root: tk.Tk):
        self.root = root
        self.root.title("👑 조선힙합소리꾼 홈페이지 자동 관리기 v3 (수정/저장 · 분류확장 · 배지선택)")
        self.root.geometry("1180x880")
        self.root.configure(bg="#121216")

        self.bgm_data = load_json(BGM_JSON, {"defaultTrackId": "", "tracks": []})
        self.songs = load_json(SONGS_JSON, [])
        self.programs = load_json(PROGRAMS_JSON, [])
        self.suno_prompts = load_json(SUNO_PROMPTS_JSON, [])

        self.current_song_edit_index = None
        self.current_suno_edit_index = None
        self.current_prog_edit_index = None

        self._build_ui()
        self.refresh_bgm_list()
        self.refresh_songs_list()
        self.refresh_programs_list()
        self.refresh_suno_list()

    def _build_ui(self):
        header = tk.Frame(self.root, bg="#1b1b22", pady=14, padx=20)
        header.pack(fill="x")

        tk.Label(
            header,
            text="👑 조선힙합소리꾼 홈페이지 자동 관리기",
            font=("맑은 고딕", 18, "bold"),
            fg="#d4af37",
            bg="#1b1b22",
        ).pack(side="left")

        tk.Button(
            header,
            text="🌐 현재 홈페이지 열기",
            font=("맑은 고딕", 11, "bold"),
            bg="#3182f6",
            fg="white",
            padx=14,
            pady=6,
            relief="flat",
            cursor="hand2",
            command=lambda: webbrowser.open(SITE_URL),
        ).pack(side="right", padx=6)

        style = ttk.Style()
        style.theme_use("default")
        style.configure("TNotebook", background="#121216", borderwidth=0)
        style.configure(
            "TNotebook.Tab",
            font=("맑은 고딕", 12, "bold"),
            padding=[18, 10],
            background="#23232e",
            foreground="#cccccc",
        )
        style.map(
            "TNotebook.Tab",
            background=[("selected", "#d4af37")],
            foreground=[("selected", "#000000")],
        )

        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill="both", expand=True, padx=18, pady=10)

        self.tab_bgm = tk.Frame(self.notebook, bg="#181820", padx=18, pady=14)
        self.tab_songs = tk.Frame(self.notebook, bg="#181820", padx=18, pady=14)
        self.tab_suno = tk.Frame(self.notebook, bg="#181820", padx=18, pady=14)
        self.tab_programs = tk.Frame(self.notebook, bg="#181820", padx=18, pady=14)

        self.notebook.add(self.tab_bgm, text=" 🎵 1. 명곡 선곡표 & 첫 시작 음악 ")
        self.notebook.add(self.tab_songs, text=" 📺 2. 유튜브 영상 쇼케이스 ")
        self.notebook.add(self.tab_suno, text=" ⚡ 3. Suno AI 프롬프트·가사 관리 (한글 자동번역) ")
        self.notebook.add(self.tab_programs, text=" 🛠️ 4. 무료 프로그램 / 자료실 ")

        self._build_bgm_tab()
        self._build_songs_tab()
        self._build_suno_tab()
        self._build_programs_tab()

        footer = tk.Frame(self.root, bg="#1b1b22", pady=14, padx=20)
        footer.pack(fill="x", side="bottom")

        self.status_label = tk.Label(
            footer,
            text="💡 항목을 추가/수정한 뒤 오른쪽 [🚀 홈페이지 서버에 즉시 반영하기]를 눌러주세요!",
            font=("맑은 고딕", 11, "bold"),
            fg="#a7f3d0",
            bg="#1b1b22",
        )
        self.status_label.pack(side="left")

        self.deploy_btn = tk.Button(
            footer,
            text="🚀 홈페이지 서버에 즉시 반영하기 (자동 배포)",
            font=("맑은 고딕", 13, "bold"),
            bg="#ff0033",
            fg="white",
            padx=24,
            pady=10,
            relief="flat",
            cursor="hand2",
            command=self.deploy_to_server,
        )
        self.deploy_btn.pack(side="right")

    # ================= 탭 1 =================
    def _build_bgm_tab(self):
        left = tk.Frame(self.tab_bgm, bg="#181820")
        left.pack(side="left", fill="both", expand=True, padx=(0, 14))

        tk.Label(
            left,
            text="🎧 홈페이지 좌측 하단 [조선힙합소리꾼 명곡 선곡표] 목록",
            font=("맑은 고딕", 14, "bold"),
            fg="#d4af37",
            bg="#181820",
        ).pack(anchor="w", pady=(0, 4))

        self.current_default_banner = tk.Label(
            left,
            text="👑 현재 홈페이지 열면 바로 나오는 시작 음악: 불러오는 중...",
            font=("맑은 고딕", 12, "bold"),
            fg="#000000",
            bg="#f5d061",
            padx=12,
            pady=8,
            anchor="w",
        )
        self.current_default_banner.pack(fill="x", pady=(0, 10))

        self.bgm_listbox = tk.Listbox(
            left,
            font=("맑은 고딕", 12, "bold"),
            bg="#0f0f14",
            fg="#ffffff",
            selectbackground="#d4af37",
            selectforeground="#000000",
            height=13,
            relief="flat",
        )
        self.bgm_listbox.pack(fill="both", expand=True)
        self.bgm_listbox.bind("<Double-Button-1>", lambda e: self.set_as_opening_bgm())

        tk.Button(
            left,
            text="👑 선택한 곡을 [홈페이지 열면 바로 나오는 첫 음악]으로 지정하기",
            font=("맑은 고딕", 12, "bold"),
            bg="#d4af37",
            fg="#000000",
            pady=12,
            relief="flat",
            cursor="hand2",
            command=self.set_as_opening_bgm,
        ).pack(fill="x", pady=(10, 6))

        btn_row = tk.Frame(left, bg="#181820", pady=4)
        btn_row.pack(fill="x")

        tk.Button(btn_row, text="🔼 위로 이동", font=("맑은 고딕", 10, "bold"), bg="#2d2d3a", fg="white", padx=12, pady=6, relief="flat", command=self.move_bgm_up).pack(side="left", padx=4)
        tk.Button(btn_row, text="🔽 아래로 이동", font=("맑은 고딕", 10, "bold"), bg="#2d2d3a", fg="white", padx=12, pady=6, relief="flat", command=self.move_bgm_down).pack(side="left", padx=4)
        tk.Button(btn_row, text="🗑️ 선곡표에서 삭제", font=("맑은 고딕", 10, "bold"), bg="#b91c1c", fg="white", padx=12, pady=6, relief="flat", command=self.delete_selected_bgm).pack(side="right", padx=4)

        right = tk.Frame(self.tab_bgm, bg="#22222c", padx=18, pady=16)
        right.pack(side="right", fill="both", expand=True)

        tk.Label(right, text="➕ 명곡 선곡표에 새 MP3 음악 추가하기", font=("맑은 고딕", 14, "bold"), fg="#fff1b8", bg="#22222c").pack(anchor="w", pady=(0, 14))

        tk.Label(right, text="① 추가할 MP3 음악 파일 선택 (D:\\음악 등):", font=("맑은 고딕", 11, "bold"), fg="white", bg="#22222c").pack(anchor="w")
        mp3_row = tk.Frame(right, bg="#22222c")
        mp3_row.pack(fill="x", pady=(6, 14))
        self.new_bgm_path_entry = tk.Entry(mp3_row, font=("맑은 고딕", 11), bg="#121216", fg="#a7f3d0", insertbackground="white")
        self.new_bgm_path_entry.pack(side="left", fill="x", expand=True, ipady=5)
        tk.Button(mp3_row, text="📂 MP3 파일 선택", font=("맑은 고딕", 10, "bold"), bg="#10b981", fg="black", padx=12, pady=5, relief="flat", command=self.browse_new_bgm_mp3).pack(side="right", padx=(8, 0))

        tk.Label(right, text="② 선곡표에 표시될 노래 제목:", font=("맑은 고딕", 11, "bold"), fg="white", bg="#22222c").pack(anchor="w")
        self.new_bgm_title_entry = tk.Entry(right, font=("맑은 고딕", 11), bg="#121216", fg="white", insertbackground="white")
        self.new_bgm_title_entry.pack(fill="x", pady=(6, 14), ipady=5)

        self.set_new_as_default_var = tk.BooleanVar(value=True)
        tk.Checkbutton(
            right,
            text="👑 이 노래를 추가함과 동시에 [홈페이지 첫 시작 음악]으로 지정",
            variable=self.set_new_as_default_var,
            font=("맑은 고딕", 11, "bold"),
            fg="#f5d061",
            bg="#22222c",
            selectcolor="#121216",
            activebackground="#22222c",
            activeforeground="#f5d061",
        ).pack(anchor="w", pady=(4, 18))

        tk.Button(
            right,
            text="➕ 명곡 선곡표에 이 노래 등록하기",
            font=("맑은 고딕", 13, "bold"),
            bg="#10b981",
            fg="black",
            pady=12,
            relief="flat",
            cursor="hand2",
            command=self.add_bgm_track,
        ).pack(fill="x")

    # ================= 탭 2: 쇼케이스 (수정 기능 완벽 탑재) =================
    def _build_songs_tab(self):
        left = tk.Frame(self.tab_songs, bg="#181820")
        left.pack(side="left", fill="both", expand=True, padx=(0, 12))

        tk.Label(
            left,
            text="📋 등록된 곡 목록 (클릭하면 오른쪽에 불러와서 바로 수정 가능!)",
            font=("맑은 고딕", 12, "bold"),
            fg="#d4af37",
            bg="#181820",
        ).pack(anchor="w", pady=(0, 8))

        self.songs_listbox = tk.Listbox(
            left,
            font=("맑은 고딕", 11),
            bg="#0f0f14",
            fg="#ffffff",
            selectbackground="#d4af37",
            selectforeground="#000000",
            height=18,
            relief="flat",
        )
        self.songs_listbox.pack(fill="both", expand=True)
        self.songs_listbox.bind("<<ListboxSelect>>", self.on_song_select)

        btn_row = tk.Frame(left, bg="#181820", pady=8)
        btn_row.pack(fill="x")

        tk.Button(btn_row, text="🔼 위로 이동", font=("맑은 고딕", 10, "bold"), bg="#2d2d3a", fg="white", padx=12, pady=6, relief="flat", command=self.move_song_up).pack(side="left", padx=4)
        tk.Button(btn_row, text="🔽 아래로 이동", font=("맑은 고딕", 10, "bold"), bg="#2d2d3a", fg="white", padx=12, pady=6, relief="flat", command=self.move_song_down).pack(side="left", padx=4)
        tk.Button(btn_row, text="🗑️ 선택 곡 삭제", font=("맑은 고딕", 10, "bold"), bg="#b91c1c", fg="white", padx=12, pady=6, relief="flat", command=self.delete_selected_song).pack(side="right", padx=4)

        right = tk.Frame(self.tab_songs, bg="#22222c", padx=18, pady=14)
        right.pack(side="right", fill="both", expand=True)

        self.song_mode_label = tk.Label(
            right,
            text="➕ [새 곡 추가 모드] 정보를 입력하세요",
            font=("맑은 고딕", 13, "bold"),
            fg="#fff1b8",
            bg="#22222c",
        )
        self.song_mode_label.pack(anchor="w", pady=(0, 10))

        tk.Label(right, text="① 유튜브 영상 주소(URL) 또는 ID:", font=("맑은 고딕", 10, "bold"), fg="white", bg="#22222c").pack(anchor="w")
        url_frame = tk.Frame(right, bg="#22222c")
        url_frame.pack(fill="x", pady=(2, 8))
        self.song_url_entry = tk.Entry(url_frame, font=("맑은 고딕", 10), bg="#121216", fg="white", insertbackground="white")
        self.song_url_entry.pack(side="left", fill="x", expand=True, ipady=4)
        tk.Button(url_frame, text="🔍 제목 자동 불러오기", font=("맑은 고딕", 9, "bold"), bg="#d4af37", fg="black", padx=8, pady=3, relief="flat", command=self.autofill_youtube_info).pack(side="right", padx=(6, 0))

        tk.Label(right, text="② 곡 제목:", font=("맑은 고딕", 10, "bold"), fg="white", bg="#22222c").pack(anchor="w")
        self.song_title_entry = tk.Entry(right, font=("맑은 고딕", 10), bg="#121216", fg="white", insertbackground="white")
        self.song_title_entry.pack(fill="x", pady=(2, 8), ipady=4)

        tk.Label(right, text="③ 한 줄 소개 (부제):", font=("맑은 고딕", 10, "bold"), fg="white", bg="#22222c").pack(anchor="w")
        self.song_sub_entry = tk.Entry(right, font=("맑은 고딕", 10), bg="#121216", fg="white", insertbackground="white")
        self.song_sub_entry.pack(fill="x", pady=(2, 8), ipady=4)

        cat_frame = tk.Frame(right, bg="#22222c")
        cat_frame.pack(fill="x", pady=(0, 8))

        tk.Label(cat_frame, text="④ 분류:", font=("맑은 고딕", 10, "bold"), fg="white", bg="#22222c").pack(side="left")
        self.song_cat_var = tk.StringVar(value="comfort")
        cat_values = [f"{k} ({v})" for k, v in CATEGORIES_DICT.items()]
        self.cat_combo = ttk.Combobox(
            cat_frame,
            textvariable=self.song_cat_var,
            values=cat_values,
            font=("맑은 고딕", 9),
            width=25,
            state="readonly",
        )
        self.cat_combo.current(0)
        self.cat_combo.pack(side="left", padx=6)

        tk.Label(cat_frame, text="배지 문구:", font=("맑은 고딕", 10, "bold"), fg="white", bg="#22222c").pack(side="left", padx=(8, 4))
        self.song_badge_var = tk.StringVar(value="🔥 최신 신곡")
        self.badge_combo = ttk.Combobox(
            cat_frame,
            textvariable=self.song_badge_var,
            values=BADGE_PRESETS,
            font=("맑은 고딕", 9),
            width=18,
        )
        self.badge_combo.pack(side="left", ipady=2)

        tk.Label(right, text="⑤ 곡 상세 설명:", font=("맑은 고딕", 10, "bold"), fg="white", bg="#22222c").pack(anchor="w")
        self.song_desc_entry = tk.Entry(right, font=("맑은 고딕", 10), bg="#121216", fg="white", insertbackground="white")
        self.song_desc_entry.pack(fill="x", pady=(2, 8), ipady=4)

        tk.Label(
            right,
            text="⑥ MP3 원곡 파일 (선택 - 다운로드 방지 스트리밍 플레이어로 재생됨):",
            font=("맑은 고딕", 9, "bold"),
            fg="#a7f3d0",
            bg="#22222c",
        ).pack(anchor="w")
        mp3_frame = tk.Frame(right, bg="#22222c")
        mp3_frame.pack(fill="x", pady=(2, 10))
        self.song_mp3_entry = tk.Entry(mp3_frame, font=("맑은 고딕", 9), bg="#121216", fg="#a7f3d0", insertbackground="white")
        self.song_mp3_entry.pack(side="left", fill="x", expand=True, ipady=3)
        tk.Button(mp3_frame, text="📂 MP3 찾기", font=("맑은 고딕", 9, "bold"), bg="#10b981", fg="black", padx=8, pady=2, relief="flat", command=self.browse_mp3).pack(side="right", padx=(6, 0))

        btn_action_frame = tk.Frame(right, bg="#22222c")
        btn_action_frame.pack(fill="x", pady=(6, 0))

        self.save_song_btn = tk.Button(
            btn_action_frame,
            text="💾 선택한 곡 수정 내용 저장하기",
            font=("맑은 고딕", 11, "bold"),
            bg="#3b82f6",
            fg="white",
            pady=8,
            relief="flat",
            cursor="hand2",
            command=self.save_current_song_edit,
        )
        self.save_song_btn.pack(fill="x", pady=(0, 6))

        tk.Button(
            btn_action_frame,
            text="➕ 새 곡으로 목록에 추가하기",
            font=("맑은 고딕", 11, "bold"),
            bg="#d4af37",
            fg="black",
            pady=8,
            relief="flat",
            cursor="hand2",
            command=self.add_song,
        ).pack(fill="x", pady=(0, 4))

        tk.Button(
            btn_action_frame,
            text="🧹 입력칸 비우기 (새 곡 작성)",
            font=("맑은 고딕", 9),
            bg="#374151",
            fg="#d1d5db",
            pady=4,
            relief="flat",
            command=self.clear_song_inputs,
        ).pack(fill="x")

    def on_song_select(self, event=None):
        sel = self.songs_listbox.curselection()
        if not sel:
            return
        idx = sel[0]
        if idx >= len(self.songs):
            return
        self.current_song_edit_index = idx
        song = self.songs[idx]

        self.song_mode_label.config(text=f"✏️ [{idx + 1}번 곡 수정 모드] 내용을 수정한 뒤 [💾 수정 내용 저장하기]를 누르세요", fg="#60a5fa")
        self.song_url_entry.delete(0, tk.END)
        self.song_url_entry.insert(0, song.get("youtubeUrl", f"https://youtu.be/{song.get('videoId')}"))

        self.song_title_entry.delete(0, tk.END)
        self.song_title_entry.insert(0, song.get("title", ""))

        self.song_sub_entry.delete(0, tk.END)
        self.song_sub_entry.insert(0, song.get("subtitle", ""))

        cat_code = song.get("category", "comfort")
        matched_idx = 0
        for i, (k, v) in enumerate(CATEGORIES_DICT.items()):
            if k == cat_code:
                matched_idx = i
                break
        self.cat_combo.current(matched_idx)

        self.song_badge_var.set(song.get("badge", "🔥 최신 신곡"))

        self.song_desc_entry.delete(0, tk.END)
        self.song_desc_entry.insert(0, song.get("desc", ""))

        self.song_mp3_entry.delete(0, tk.END)
        self.song_mp3_entry.insert(0, song.get("mp3Src", ""))

    def clear_song_inputs(self):
        self.current_song_edit_index = None
        self.song_mode_label.config(text="➕ [새 곡 추가 모드] 정보를 입력하세요", fg="#fff1b8")
        self.song_url_entry.delete(0, tk.END)
        self.song_title_entry.delete(0, tk.END)
        self.song_sub_entry.delete(0, tk.END)
        self.cat_combo.current(0)
        self.song_badge_var.set("🔥 최신 신곡")
        self.song_desc_entry.delete(0, tk.END)
        self.song_mp3_entry.delete(0, tk.END)

    def save_current_song_edit(self):
        if self.current_song_edit_index is None or self.current_song_edit_index >= len(self.songs):
            messagebox.showwarning("선택 확인", "먼저 왼쪽 목록에서 수정할 곡을 마우스로 클릭해 주세요!")
            return

        raw_url = self.song_url_entry.get().strip()
        title = self.song_title_entry.get().strip()
        subtitle = self.song_sub_entry.get().strip() or "조선힙합소리꾼 공식 추천곡"
        desc = self.song_desc_entry.get().strip() or "지금 바로 감상해 보세요."
        badge = self.song_badge_var.get().strip() or "🔥 최신 신곡"
        cat_raw = self.song_cat_var.get().split()[0]
        mp3_input = self.song_mp3_entry.get().strip()

        if not raw_url or not title:
            messagebox.showwarning("필수 입력", "유튜브 주소와 곡 제목은 필수입니다!")
            return

        vid = extract_youtube_id(raw_url)
        target = self.songs[self.current_song_edit_index]
        target["videoId"] = vid
        target["title"] = title if title.startswith("🎧") else f"🎧 {title}"
        target["subtitle"] = subtitle
        target["category"] = cat_raw
        target["badge"] = badge
        target["badgeColor"] = "#ff3b30" if cat_raw in ["cider", "gugak"] else "#f59e0b"
        target["desc"] = desc
        target["youtubeUrl"] = f"https://youtu.be/{vid}"

        if mp3_input and os.path.exists(mp3_input):
            safe_name = f"track_{vid}.mp3"
            dest = SORIKKUN_PUBLIC_DIR / safe_name
            shutil.copy2(mp3_input, dest)
            target["mp3Src"] = f"/sorikkun/{safe_name}"
        elif mp3_input:
            target["mp3Src"] = mp3_input

        save_json(SONGS_JSON, self.songs)
        self.refresh_songs_list()
        self.songs_listbox.selection_set(self.current_song_edit_index)

        self.status_label.config(text=f"✅ '{title}' 곡 수정이 저장되었습니다! [🚀 홈페이지 서버에 즉시 반영하기]를 눌러주세요.")
        messagebox.showinfo("수정 저장 완료", f"'{title}' 곡의 수정 내용이 저장되었습니다!\n\n오른쪽 아래 [🚀 홈페이지 서버에 즉시 반영하기] 버튼을 누르면 실제 사이트에 즉시 반영됩니다.")

    # ================= 탭 3: 무료 프로그램 =================
    def _build_programs_tab(self):
        left = tk.Frame(self.tab_programs, bg="#181820")
        left.pack(side="left", fill="both", expand=True, padx=(0, 12))

        tk.Label(
            left,
            text="📋 등록된 무료 자료 목록 (클릭 시 오른쪽에 불러와서 수정 가능)",
            font=("맑은 고딕", 12, "bold"),
            fg="#10b981",
            bg="#181820",
        ).pack(anchor="w", pady=(0, 8))

        self.programs_listbox = tk.Listbox(
            left,
            font=("맑은 고딕", 11),
            bg="#0f0f14",
            fg="#ffffff",
            selectbackground="#10b981",
            selectforeground="#000000",
            height=18,
            relief="flat",
        )
        self.programs_listbox.pack(fill="both", expand=True)
        self.programs_listbox.bind("<<ListboxSelect>>", self.on_program_select)

        btn_row = tk.Frame(left, bg="#181820", pady=8)
        btn_row.pack(fill="x")

        tk.Button(btn_row, text="🔼 위로 이동", font=("맑은 고딕", 10, "bold"), bg="#2d2d3a", fg="white", padx=12, pady=6, relief="flat", command=self.move_program_up).pack(side="left", padx=4)
        tk.Button(btn_row, text="🔽 아래로 이동", font=("맑은 고딕", 10, "bold"), bg="#2d2d3a", fg="white", padx=12, pady=6, relief="flat", command=self.move_program_down).pack(side="left", padx=4)
        tk.Button(btn_row, text="🗑️ 선택 항목 삭제", font=("맑은 고딕", 10, "bold"), bg="#b91c1c", fg="white", padx=12, pady=6, relief="flat", command=self.delete_selected_program).pack(side="right", padx=4)

        right = tk.Frame(self.tab_programs, bg="#22222c", padx=18, pady=14)
        right.pack(side="right", fill="both", expand=True)

        self.prog_mode_label = tk.Label(
            right,
            text="➕ [새 무료 프로그램/자료 추가 모드]",
            font=("맑은 고딕", 13, "bold"),
            fg="#a7f3d0",
            bg="#22222c",
        )
        self.prog_mode_label.pack(anchor="w", pady=(0, 10))

        tk.Label(right, text="① 배포할 파일(.zip, .exe, .pdf, .html) 또는 링크:", font=("맑은 고딕", 10, "bold"), fg="white", bg="#22222c").pack(anchor="w")
        file_frame = tk.Frame(right, bg="#22222c")
        file_frame.pack(fill="x", pady=(2, 8))
        self.prog_file_entry = tk.Entry(file_frame, font=("맑은 고딕", 10), bg="#121216", fg="#a7f3d0", insertbackground="white")
        self.prog_file_entry.pack(side="left", fill="x", expand=True, ipady=4)
        tk.Button(file_frame, text="📂 내 컴퓨터에서 선택", font=("맑은 고딕", 9, "bold"), bg="#10b981", fg="black", padx=10, pady=3, relief="flat", command=self.browse_program_file).pack(side="right", padx=(6, 0))

        tk.Label(right, text="② 프로그램/자료 제목:", font=("맑은 고딕", 10, "bold"), fg="white", bg="#22222c").pack(anchor="w")
        self.prog_title_entry = tk.Entry(right, font=("맑은 고딕", 10), bg="#121216", fg="white", insertbackground="white")
        self.prog_title_entry.pack(fill="x", pady=(2, 8), ipady=4)

        tk.Label(right, text="③ 설명 문구:", font=("맑은 고딕", 10, "bold"), fg="white", bg="#22222c").pack(anchor="w")
        self.prog_desc_entry = tk.Entry(right, font=("맑은 고딕", 10), bg="#121216", fg="white", insertbackground="white")
        self.prog_desc_entry.pack(fill="x", pady=(2, 8), ipady=4)

        meta_frame = tk.Frame(right, bg="#22222c")
        meta_frame.pack(fill="x", pady=(0, 10))

        tk.Label(meta_frame, text="④ 배지:", font=("맑은 고딕", 10, "bold"), fg="white", bg="#22222c").pack(side="left")
        self.prog_badge_entry = tk.Entry(meta_frame, font=("맑은 고딕", 10), bg="#121216", fg="white", width=18)
        self.prog_badge_entry.insert(0, "🎁 신규 무료 프로그램")
        self.prog_badge_entry.pack(side="left", padx=6, ipady=3)

        tk.Label(meta_frame, text="아이콘:", font=("맑은 고딕", 10, "bold"), fg="white", bg="#22222c").pack(side="left", padx=(6, 4))
        self.prog_icon_entry = tk.Entry(meta_frame, font=("맑은 고딕", 10), bg="#121216", fg="white", width=6)
        self.prog_icon_entry.insert(0, "🛠️")
        self.prog_icon_entry.pack(side="left", ipady=3)

        prog_btn_frame = tk.Frame(right, bg="#22222c")
        prog_btn_frame.pack(fill="x", pady=(6, 0))

        tk.Button(
            prog_btn_frame,
            text="💾 선택한 항목 수정 내용 저장하기",
            font=("맑은 고딕", 11, "bold"),
            bg="#3b82f6",
            fg="white",
            pady=8,
            relief="flat",
            cursor="hand2",
            command=self.save_current_program_edit,
        ).pack(fill="x", pady=(0, 6))

        tk.Button(
            prog_btn_frame,
            text="➕ 새 자료로 목록에 추가하기",
            font=("맑은 고딕", 11, "bold"),
            bg="#10b981",
            fg="black",
            pady=8,
            relief="flat",
            cursor="hand2",
            command=self.add_program,
        ).pack(fill="x", pady=(0, 4))

        tk.Button(
            prog_btn_frame,
            text="🧹 입력칸 비우기 (새 자료 작성)",
            font=("맑은 고딕", 9),
            bg="#374151",
            fg="#d1d5db",
            pady=4,
            relief="flat",
            command=self.clear_program_inputs,
        ).pack(fill="x")

    def on_program_select(self, event=None):
        sel = self.programs_listbox.curselection()
        if not sel:
            return
        idx = sel[0]
        if idx >= len(self.programs):
            return
        self.current_prog_edit_index = idx
        p = self.programs[idx]

        self.prog_mode_label.config(text=f"✏️ [{idx + 1}번 자료 수정 모드] 내용을 수정한 뒤 [💾 수정 내용 저장하기]를 누르세요", fg="#60a5fa")
        self.prog_file_entry.delete(0, tk.END)
        self.prog_file_entry.insert(0, p.get("href", ""))

        self.prog_title_entry.delete(0, tk.END)
        self.prog_title_entry.insert(0, p.get("title", ""))

        self.prog_desc_entry.delete(0, tk.END)
        self.prog_desc_entry.insert(0, p.get("desc", ""))

        self.prog_badge_entry.delete(0, tk.END)
        self.prog_badge_entry.insert(0, p.get("badge", "🎁 무료 배포"))

        self.prog_icon_entry.delete(0, tk.END)
        self.prog_icon_entry.insert(0, p.get("icon", "🛠️"))

    def clear_program_inputs(self):
        self.current_prog_edit_index = None
        self.prog_mode_label.config(text="➕ [새 무료 프로그램/자료 추가 모드]", fg="#a7f3d0")
        self.prog_file_entry.delete(0, tk.END)
        self.prog_title_entry.delete(0, tk.END)
        self.prog_desc_entry.delete(0, tk.END)
        self.prog_badge_entry.delete(0, tk.END)
        self.prog_badge_entry.insert(0, "🎁 신규 무료 프로그램")
        self.prog_icon_entry.delete(0, tk.END)
        self.prog_icon_entry.insert(0, "🛠️")

    def save_current_program_edit(self):
        if self.current_prog_edit_index is None or self.current_prog_edit_index >= len(self.programs):
            messagebox.showwarning("선택 확인", "먼저 왼쪽 목록에서 수정할 항목을 마우스로 클릭해 주세요!")
            return

        file_or_url = self.prog_file_entry.get().strip()
        title = self.prog_title_entry.get().strip()
        desc = self.prog_desc_entry.get().strip() or "누구나 조건 없이 100% 무료로 다운로드하여 사용하실 수 있습니다."
        badge = self.prog_badge_entry.get().strip() or "🎁 무료 배포"
        icon = self.prog_icon_entry.get().strip() or "🛠️"

        if not file_or_url or not title:
            messagebox.showwarning("필수 입력", "파일 주소와 제목은 필수입니다!")
            return

        target = self.programs[self.current_prog_edit_index]
        target["title"] = title
        target["desc"] = desc
        target["badge"] = badge
        target["icon"] = icon

        if os.path.exists(file_or_url):
            fname = os.path.basename(file_or_url)
            dest = DOWNLOADS_PUBLIC_DIR / fname
            shutil.copy2(file_or_url, dest)
            target["href"] = f"/downloads/{fname}"
            target["isDownload"] = True
            target["downloadName"] = fname
            target["buttonText"] = "📥 무료 다운로드 (₩0)"
        else:
            target["href"] = file_or_url

        save_json(PROGRAMS_JSON, self.programs)
        self.refresh_programs_list()
        self.refresh_suno_list()
        self.programs_listbox.selection_set(self.current_prog_edit_index)

        self.status_label.config(text=f"✅ '{title}' 자료 수정이 저장되었습니다! [🚀 홈페이지 서버에 즉시 반영하기]를 눌러주세요.")
        messagebox.showinfo("수정 저장 완료", f"'{title}' 자료의 수정 내용이 저장되었습니다!")

    # ================= 공통 로직 =================
    def refresh_bgm_list(self):
        self.bgm_listbox.delete(0, tk.END)
        tracks = self.bgm_data.get("tracks", [])
        default_id = self.bgm_data.get("defaultTrackId", "")
        default_title = "지정 안됨"

        for i, t in enumerate(tracks, 1):
            is_def = t["id"] == default_id
            if is_def:
                default_title = f"{i}번. {t['title']}"
            prefix = "👑 [홈페이지 첫 시작 음악] " if is_def else "🎵 "
            self.bgm_listbox.insert(tk.END, f"{prefix}{i}. {t['title']}")
            if is_def:
                self.bgm_listbox.itemconfig(i - 1, {"fg": "#fff1b8", "bg": "#3b2f10"})

        self.current_default_banner.config(
            text=f"👑 현재 홈페이지 열면 바로 나오는 시작 음악:  {default_title}"
        )

    def set_as_opening_bgm(self):
        sel = self.bgm_listbox.curselection()
        if not sel:
            messagebox.showwarning("곡 선택", "먼저 목록에서 노래를 클릭해 선택해 주세요!")
            return
        idx = sel[0]
        tracks = self.bgm_data.get("tracks", [])
        chosen = tracks[idx]
        self.bgm_data["defaultTrackId"] = chosen["id"]
        save_json(BGM_JSON, self.bgm_data)
        self.refresh_bgm_list()
        self.bgm_listbox.selection_set(idx)
        self.status_label.config(
            text=f"👑 '{chosen['title']}' 곡이 홈페이지 첫 시작 음악으로 지정되었습니다!"
        )
        messagebox.showinfo(
            "첫 시작 음악 지정 완료 👑",
            f"이제 홈페이지를 열면\n\n🎵 《{chosen['title']}》\n\n노래가 가장 먼저 자동으로 재생됩니다!\n\n오른쪽 아래 [🚀 홈페이지 서버에 즉시 반영하기]를 눌러주세요.",
        )

    def browse_new_bgm_mp3(self):
        initial = r"D:\음악" if os.path.exists(r"D:\음악") else str(BASE_DIR)
        path = filedialog.askopenfilename(
            initialdir=initial,
            title="명곡 선곡표에 추가할 MP3 파일 선택",
            filetypes=[("MP3 Audio", "*.mp3"), ("All Files", "*.*")],
        )
        if path:
            self.new_bgm_path_entry.delete(0, tk.END)
            self.new_bgm_path_entry.insert(0, path)
            if not self.new_bgm_title_entry.get().strip():
                stem = Path(path).stem
                self.new_bgm_title_entry.insert(0, stem)

    def add_bgm_track(self):
        mp3_path = self.new_bgm_path_entry.get().strip()
        title = self.new_bgm_title_entry.get().strip()
        if not mp3_path or not os.path.exists(mp3_path):
            messagebox.showwarning("파일 확인", "먼저 [📂 MP3 파일 선택] 버튼으로 음악 파일을 선택해 주세요!")
            return
        if not title:
            title = Path(mp3_path).stem

        size_mb = os.path.getsize(mp3_path) / (1024 * 1024)
        if size_mb > 50:
            messagebox.showerror(
                "파일 크기 초과",
                f"선택하신 파일의 크기가 {size_mb:.1f}MB로 너무 큽니다!\n(서버 업로드 제한: 최대 50MB 이하)\n\n보통 노래 MP3 파일은 3~10MB입니다. 영상 파일이나 너무 큰 파일이 아닌 순수 음악 MP3 파일을 선택해 주세요!"
            )
            return

        safe_name = f"bgm_{int(time.time())}.mp3"
        dest = SORIKKUN_PUBLIC_DIR / safe_name
        shutil.copy2(mp3_path, dest)

        new_id = f"bgm-{int(time.time())}"
        new_track = {
            "id": new_id,
            "title": title,
            "src": f"/sorikkun/{safe_name}",
        }
        self.bgm_data.setdefault("tracks", []).append(new_track)
        if self.set_new_as_default_var.get():
            self.bgm_data["defaultTrackId"] = new_id

        save_json(BGM_JSON, self.bgm_data)
        self.refresh_bgm_list()

        self.new_bgm_path_entry.delete(0, tk.END)
        self.new_bgm_title_entry.delete(0, tk.END)

        self.status_label.config(text=f"✅ '{title}' 곡이 명곡 선곡표에 등록되었습니다!")
        messagebox.showinfo("선곡표 등록 완료", f"'{title}' 곡이 등록되었습니다!")

    def move_bgm_up(self):
        sel = self.bgm_listbox.curselection()
        if not sel or sel[0] == 0:
            return
        i = sel[0]
        tracks = self.bgm_data["tracks"]
        tracks[i - 1], tracks[i] = tracks[i], tracks[i - 1]
        save_json(BGM_JSON, self.bgm_data)
        self.refresh_bgm_list()
        self.bgm_listbox.selection_set(i - 1)

    def move_bgm_down(self):
        sel = self.bgm_listbox.curselection()
        tracks = self.bgm_data.get("tracks", [])
        if not sel or sel[0] >= len(tracks) - 1:
            return
        i = sel[0]
        tracks[i + 1], tracks[i] = tracks[i], tracks[i + 1]
        save_json(BGM_JSON, self.bgm_data)
        self.refresh_bgm_list()
        self.bgm_listbox.selection_set(i + 1)

    def delete_selected_bgm(self):
        sel = self.bgm_listbox.curselection()
        if not sel:
            return
        i = sel[0]
        tracks = self.bgm_data["tracks"]
        removed = tracks.pop(i)
        if self.bgm_data.get("defaultTrackId") == removed["id"] and tracks:
            self.bgm_data["defaultTrackId"] = tracks[0]["id"]
        save_json(BGM_JSON, self.bgm_data)
        self.refresh_bgm_list()
        self.status_label.config(text=f"🗑️ 선곡표에서 '{removed['title']}' 곡을 삭제했습니다.")

    def refresh_songs_list(self):
        self.songs_listbox.delete(0, tk.END)
        for i, s in enumerate(self.songs, 1):
            mp3_tag = " [🎵MP3보호재생]" if s.get("mp3Src") else ""
            cat_tag = f"[{CATEGORIES_DICT.get(s.get('category'), s.get('category'))}]"
            self.songs_listbox.insert(tk.END, f"{i}. {cat_tag} {s['title']} ({s['videoId']}){mp3_tag}")

    def autofill_youtube_info(self):
        raw = self.song_url_entry.get().strip()
        if not raw:
            messagebox.showwarning("입력 확인", "먼저 유튜브 영상 주소(URL)를 입력해 주세요!")
            return
        vid = extract_youtube_id(raw)
        try:
            oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json"
            req = urllib.request.Request(oembed_url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=6) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                title = data.get("title", "")
                if title and not title.startswith("🎧"):
                    title = "🎧 " + title
                self.song_title_entry.delete(0, tk.END)
                self.song_title_entry.insert(0, title)
                if not self.song_sub_entry.get().strip():
                    self.song_sub_entry.insert(0, "조선힙합소리꾼의 가슴 울리는 명곡")
                if not self.song_desc_entry.get().strip():
                    self.song_desc_entry.insert(0, "유튜브 '조선힙합소리꾼' 채널에서 풀버전 뮤직비디오와 가사를 감상하세요.")
                self.status_label.config(text=f"✅ 유튜브 영상({vid}) 제목을 자동으로 불러왔습니다!")
        except Exception:
            messagebox.showinfo("알림", f"유튜브 영상 ID({vid})를 확인했습니다. 제목을 직접 입력해 주세요.")

    def browse_mp3(self):
        initial = r"D:\음악" if os.path.exists(r"D:\음악") else str(BASE_DIR)
        path = filedialog.askopenfilename(
            initialdir=initial,
            title="첨부할 MP3 음원 파일 선택",
            filetypes=[("MP3 Audio", "*.mp3"), ("All Files", "*.*")],
        )
        if path:
            self.song_mp3_entry.delete(0, tk.END)
            self.song_mp3_entry.insert(0, path)

    def add_song(self):
        raw_url = self.song_url_entry.get().strip()
        title = self.song_title_entry.get().strip()
        subtitle = self.song_sub_entry.get().strip() or "조선힙합소리꾼 공식 추천곡"
        desc = self.song_desc_entry.get().strip() or "지금 바로 감상해 보세요."
        badge = self.song_badge_var.get().strip() or "🔥 최신 신곡"
        cat_raw = self.song_cat_var.get().split()[0]
        mp3_local = self.song_mp3_entry.get().strip()

        if not raw_url or not title:
            messagebox.showwarning("필수 입력", "유튜브 주소와 곡 제목은 필수입니다!")
            return

        vid = extract_youtube_id(raw_url)
        new_item = {
            "id": f"song-{int(time.time())}",
            "videoId": vid,
            "title": title if title.startswith("🎧") else f"🎧 {title}",
            "subtitle": subtitle,
            "category": cat_raw,
            "badge": badge,
            "badgeColor": "#ff3b30" if cat_raw in ["cider", "gugak"] else "#f59e0b",
            "desc": desc,
            "youtubeUrl": f"https://youtu.be/{vid}",
        }

        if mp3_local and os.path.exists(mp3_local):
            safe_name = f"track_{vid}.mp3"
            dest = SORIKKUN_PUBLIC_DIR / safe_name
            shutil.copy2(mp3_local, dest)
            new_item["mp3Src"] = f"/sorikkun/{safe_name}"

        self.songs.insert(0, new_item)
        save_json(SONGS_JSON, self.songs)
        self.refresh_songs_list()
        self.clear_song_inputs()

        self.status_label.config(text=f"✅ '{title}' 곡이 추가되었습니다! [🚀 홈페이지 서버에 즉시 반영하기]를 눌러주세요.")
        messagebox.showinfo("추가 완료", f"'{title}' 곡이 목록에 추가되었습니다!")

    def move_song_up(self):
        sel = self.songs_listbox.curselection()
        if not sel or sel[0] == 0:
            return
        i = sel[0]
        self.songs[i - 1], self.songs[i] = self.songs[i], self.songs[i - 1]
        save_json(SONGS_JSON, self.songs)
        self.refresh_songs_list()
        self.songs_listbox.selection_set(i - 1)

    def move_song_down(self):
        sel = self.songs_listbox.curselection()
        if not sel or sel[0] >= len(self.songs) - 1:
            return
        i = sel[0]
        self.songs[i + 1], self.songs[i] = self.songs[i], self.songs[i + 1]
        save_json(SONGS_JSON, self.songs)
        self.refresh_songs_list()
        self.songs_listbox.selection_set(i + 1)

    def delete_selected_song(self):
        sel = self.songs_listbox.curselection()
        if not sel:
            return
        i = sel[0]
        removed = self.songs.pop(i)
        save_json(SONGS_JSON, self.songs)
        self.refresh_songs_list()
        self.clear_song_inputs()
        self.status_label.config(text=f"🗑️ '{removed['title']}' 항목을 삭제했습니다.")

    def refresh_programs_list(self):
        self.programs_listbox.delete(0, tk.END)
        for i, p in enumerate(self.programs, 1):
            self.programs_listbox.insert(tk.END, f"{i}. {p.get('icon', '🛠️')} [{p.get('badge', '')}] {p['title']}")

    def browse_program_file(self):
        path = filedialog.askopenfilename(title="무료 배포할 파일 선택", filetypes=[("All Files", "*.*")])
        if path:
            self.prog_file_entry.delete(0, tk.END)
            self.prog_file_entry.insert(0, path)
            if not self.prog_title_entry.get().strip():
                self.prog_title_entry.insert(0, f"[무료 배포] {Path(path).stem}")

    def add_program(self):
        file_or_url = self.prog_file_entry.get().strip()
        title = self.prog_title_entry.get().strip()
        desc = self.prog_desc_entry.get().strip() or "누구나 조건 없이 100% 무료로 다운로드하여 사용하실 수 있습니다."
        badge = self.prog_badge_entry.get().strip() or "🎁 무료 배포"
        icon = self.prog_icon_entry.get().strip() or "🛠️"

        if not file_or_url or not title:
            messagebox.showwarning("필수 입력", "파일 주소와 제목은 필수입니다!")
            return

        if os.path.exists(file_or_url):
            fname = os.path.basename(file_or_url)
            dest = DOWNLOADS_PUBLIC_DIR / fname
            shutil.copy2(file_or_url, dest)
            href = f"/downloads/{fname}"
            is_download = True
            download_name = fname
            btn_text = "📥 무료 다운로드 (₩0)"
        else:
            href = file_or_url
            is_download = False
            download_name = ""
            btn_text = "🚀 무료로 바로 열기"

        new_prog = {
            "id": f"prog-{int(time.time())}",
            "badge": badge,
            "badgeBg": "#10b981",
            "badgeColor": "#000",
            "icon": icon,
            "title": title,
            "desc": desc,
            "href": href,
            "downloadName": download_name,
            "buttonText": btn_text,
            "isDownload": is_download,
        }

        self.programs.insert(0, new_prog)
        save_json(PROGRAMS_JSON, self.programs)
        self.refresh_programs_list()
        self.refresh_suno_list()
        self.clear_program_inputs()

        self.status_label.config(text=f"✅ '{title}' 자료가 추가되었습니다!")
        messagebox.showinfo("추가 완료", f"'{title}' 항목이 추가되었습니다!")

    def move_program_up(self):
        sel = self.programs_listbox.curselection()
        if not sel or sel[0] == 0:
            return
        i = sel[0]
        self.programs[i - 1], self.programs[i] = self.programs[i], self.programs[i - 1]
        save_json(PROGRAMS_JSON, self.programs)
        self.refresh_programs_list()
        self.refresh_suno_list()
        self.programs_listbox.selection_set(i - 1)

    def move_program_down(self):
        sel = self.programs_listbox.curselection()
        if not sel or sel[0] >= len(self.programs) - 1:
            return
        i = sel[0]
        self.programs[i + 1], self.programs[i] = self.programs[i], self.programs[i + 1]
        save_json(PROGRAMS_JSON, self.programs)
        self.refresh_programs_list()
        self.refresh_suno_list()
        self.programs_listbox.selection_set(i + 1)

    def delete_selected_program(self):
        sel = self.programs_listbox.curselection()
        if not sel:
            return
        i = sel[0]
        removed = self.programs.pop(i)
        save_json(PROGRAMS_JSON, self.programs)
        self.refresh_programs_list()
        self.refresh_suno_list()
        self.clear_program_inputs()
        self.status_label.config(text=f"🗑️ '{removed['title']}' 항목을 삭제했습니다.")


    # ================= 탭 4: Suno AI 프롬프트 관리 =================
    def _build_suno_tab(self):
        left = tk.Frame(self.tab_suno, bg="#181820")
        left.pack(side="left", fill="both", expand=True, padx=(0, 14))

        tk.Label(
            left,
            text="🎵 홈페이지 등록된 Suno 프롬프트 목록 (클릭 시 즉시 수정)",
            font=("맑은 고딕", 13, "bold"),
            fg="#fb923c",
            bg="#181820",
        ).pack(anchor="w", pady=(0, 4))

        list_frame = tk.Frame(left, bg="#181820")
        list_frame.pack(fill="both", expand=True)

        scrollbar = tk.Scrollbar(list_frame)
        scrollbar.pack(side="right", fill="y")

        self.suno_listbox = tk.Listbox(
            list_frame,
            font=("맑은 고딕", 10),
            bg="#101015",
            fg="#f3f4f6",
            selectbackground="#f43f5e",
            selectforeground="white",
            relief="flat",
            highlightthickness=1,
            highlightbackground="#374151",
            yscrollcommand=scrollbar.set,
        )
        self.suno_listbox.pack(side="left", fill="both", expand=True)
        scrollbar.config(command=self.suno_listbox.yview)
        self.suno_listbox.bind("<<ListboxSelect>>", self.on_suno_select)

        btn_box = tk.Frame(left, bg="#181820", pady=8)
        btn_box.pack(fill="x")

        tk.Button(
            btn_box,
            text="▲ 위로",
            font=("맑은 고딕", 10, "bold"),
            bg="#272730",
            fg="white",
            relief="flat",
            padx=10,
            pady=4,
            command=self.move_suno_up,
        ).pack(side="left", padx=2)

        tk.Button(
            btn_box,
            text="▼ 아래로",
            font=("맑은 고딕", 10, "bold"),
            bg="#272730",
            fg="white",
            relief="flat",
            padx=10,
            pady=4,
            command=self.move_suno_down,
        ).pack(side="left", padx=2)

        tk.Button(
            btn_box,
            text="🗑️ 선택 삭제",
            font=("맑은 고딕", 10, "bold"),
            bg="#dc2626",
            fg="white",
            relief="flat",
            padx=12,
            pady=4,
            command=self.delete_selected_suno,
        ).pack(side="right")

        # 오른쪽: 수정 및 추가 폼
        right = tk.Frame(self.tab_suno, bg="#202028", padx=16, pady=12, relief="flat")
        right.pack(side="right", fill="both", expand=True)

        self.suno_form_header = tk.Label(
            right,
            text="➕ 새 Suno 프롬프트 등록",
            font=("맑은 고딕", 13, "bold"),
            fg="#f43f5e",
            bg="#202028",
        )
        self.suno_form_header.pack(anchor="w", pady=(0, 6))

        # 1) Suno 링크 + 자동 정보 가져오기 버튼
        url_frame = tk.Frame(right, bg="#202028")
        url_frame.pack(fill="x", pady=2)
        tk.Label(url_frame, text="Suno 공유 링크:", font=("맑은 고딕", 9, "bold"), fg="#e5e7eb", bg="#202028").pack(side="left")
        self.suno_url_entry = tk.Entry(url_frame, font=("맑은 고딕", 9), bg="#121216", fg="white", relief="flat")
        self.suno_url_entry.pack(side="left", fill="x", expand=True, padx=6)
        tk.Button(
            url_frame,
            text="🔍 자동 정보 가져오기",
            font=("맑은 고딕", 9, "bold"),
            bg="#f43f5e",
            fg="white",
            relief="flat",
            padx=8,
            pady=2,
            command=self.auto_fetch_suno,
        ).pack(side="right")

        # 2) 제목 & 카테고리
        row2 = tk.Frame(right, bg="#202028")
        row2.pack(fill="x", pady=3)
        tk.Label(row2, text="곡 제목:", font=("맑은 고딕", 9, "bold"), fg="#e5e7eb", bg="#202028").pack(side="left")
        self.suno_title_entry = tk.Entry(row2, font=("맑은 고딕", 10, "bold"), bg="#121216", fg="white", relief="flat")
        self.suno_title_entry.pack(side="left", fill="x", expand=True, padx=(6, 12))

        tk.Label(row2, text="장르/분류:", font=("맑은 고딕", 9, "bold"), fg="#e5e7eb", bg="#202028").pack(side="left")
        self.suno_cat_combo = ttk.Combobox(row2, values=SUNO_CATEGORIES, state="normal", width=14, font=("맑은 고딕", 9))
        self.suno_cat_combo.set("EDM / 페스티벌")
        self.suno_cat_combo.pack(side="left", padx=4)

        # 3) 배지 문구
        row3 = tk.Frame(right, bg="#202028")
        row3.pack(fill="x", pady=3)
        tk.Label(row3, text="배지 문구:", font=("맑은 고딕", 9, "bold"), fg="#e5e7eb", bg="#202028").pack(side="left")
        self.suno_badge_combo = ttk.Combobox(row3, values=SUNO_BADGE_PRESETS, state="normal", font=("맑은 고딕", 9))
        self.suno_badge_combo.set("🔥 140 BPM 페스티벌 드롭")
        self.suno_badge_combo.pack(side="left", fill="x", expand=True, padx=6)

        # 4) 영문 스타일 프롬프트
        en_hdr = tk.Frame(right, bg="#202028")
        en_hdr.pack(fill="x", pady=(6, 2))
        tk.Label(en_hdr, text="🇺🇸 영문 스타일 프롬프트 (Suno Style of Music 입력용):", font=("맑은 고딕", 9, "bold"), fg="#f43f5e", bg="#202028").pack(side="left")
        tk.Button(
            en_hdr,
            text="🌐 영문 → 한글 자동 번역 실행",
            font=("맑은 고딕", 9, "bold"),
            bg="#3b82f6",
            fg="white",
            relief="flat",
            padx=8,
            pady=1,
            command=self.auto_translate_suno_prompt,
        ).pack(side="right")

        self.suno_prompt_en_text = tk.Text(right, font=("Consolas", 9), height=3, bg="#121216", fg="#f1f5f9", relief="flat")
        self.suno_prompt_en_text.pack(fill="x", pady=2)

        # 5) 한글 스타일 프롬프트 (번역 & 해설)
        tk.Label(right, text="🇰🇷 한글 번역 및 음악 요소 해설 (방문자 학습 가이드용):", font=("맑은 고딕", 9, "bold"), fg="#fbbf24", bg="#202028").pack(anchor="w", pady=(4, 2))
        self.suno_prompt_ko_text = tk.Text(right, font=("맑은 고딕", 9), height=3, bg="#121216", fg="#fef08a", relief="flat")
        self.suno_prompt_ko_text.pack(fill="x", pady=2)

        # 6) 실전 가사
        tk.Label(right, text="🎤 실전 가사 (Lyrics with [Intro], [Drop], [Verse] etc.):", font=("맑은 고딕", 9, "bold"), fg="#e5e7eb", bg="#202028").pack(anchor="w", pady=(4, 2))
        self.suno_lyrics_text = tk.Text(right, font=("Consolas", 9), height=4, bg="#121216", fg="#e2e8f0", relief="flat")
        self.suno_lyrics_text.pack(fill="x", pady=2)

        # 7) 간단 설명
        desc_frame = tk.Frame(right, bg="#202028")
        desc_frame.pack(fill="x", pady=3)
        tk.Label(desc_frame, text="설명/팁:", font=("맑은 고딕", 9, "bold"), fg="#9ca3af", bg="#202028").pack(side="left")
        self.suno_desc_entry = tk.Entry(desc_frame, font=("맑은 고딕", 9), bg="#121216", fg="white", relief="flat")
        self.suno_desc_entry.pack(side="left", fill="x", expand=True, padx=6)

        # 8) MP3 파일 직접 등록 (등록 시 홈페이지에서 방문자가 바로 다운로드 가능!)
        mp3_row = tk.Frame(right, bg="#202028")
        mp3_row.pack(fill="x", pady=3)
        tk.Label(mp3_row, text="💾 MP3 직접 다운로드용 파일:", font=("맑은 고딕", 9, "bold"), fg="#10b981", bg="#202028").pack(side="left")
        self.suno_mp3_entry = tk.Entry(mp3_row, font=("맑은 고딕", 9), bg="#121216", fg="#a7f3d0", relief="flat")
        self.suno_mp3_entry.pack(side="left", fill="x", expand=True, padx=6)
        tk.Button(
            mp3_row,
            text="📁 MP3 찾기...",
            font=("맑은 고딕", 9, "bold"),
            bg="#059669",
            fg="white",
            relief="flat",
            padx=8,
            pady=2,
            command=self.browse_suno_mp3,
        ).pack(side="right")

        # 하단 액션 버튼
        action_frame = tk.Frame(right, bg="#202028", pady=6)
        action_frame.pack(fill="x")

        self.save_suno_edit_btn = tk.Button(
            action_frame,
            text="💾 선택 프롬프트 수정 저장",
            font=("맑은 고딕", 10, "bold"),
            bg="#d4af37",
            fg="black",
            relief="flat",
            padx=12,
            pady=6,
            command=self.save_suno_edit,
            state="disabled",
        )
        self.save_suno_edit_btn.pack(side="left", padx=4)

        tk.Button(
            action_frame,
            text="➕ 새 프롬프트로 등록",
            font=("맑은 고딕", 10, "bold"),
            bg="#f43f5e",
            fg="white",
            relief="flat",
            padx=12,
            pady=6,
            command=self.add_new_suno,
        ).pack(side="left", padx=4)

        tk.Button(
            action_frame,
            text="🔄 입력창 초기화",
            font=("맑은 고딕", 9),
            bg="#374151",
            fg="white",
            relief="flat",
            padx=10,
            pady=6,
            command=self.clear_suno_inputs,
        ).pack(side="right")


    def browse_suno_mp3(self):
        f = filedialog.askopenfilename(
            title="Suno 다운로드용 MP3 파일 선택",
            filetypes=[("오디오 파일", "*.mp3 *.m4a *.wav"), ("모든 파일", "*.*")]
        )
        if f:
            size_mb = os.path.getsize(f) / (1024 * 1024)
            if size_mb > 50:
                messagebox.showerror("용량 초과", f"선택한 파일이 {size_mb:.1f}MB로 너무 큽니다. (50MB 이하 파일만 등록 가능)")
                return
            self.suno_mp3_entry.delete(0, tk.END)
            self.suno_mp3_entry.insert(0, f)

    def refresh_suno_list(self):
        self.suno_listbox.delete(0, tk.END)
        for idx, item in enumerate(self.suno_prompts):
            title = item.get("title", "제목 없음")
            badge = item.get("badge", "")
            cat = item.get("category", "")
            self.suno_listbox.insert(tk.END, f"{idx+1}. [{cat}] {title} ({badge})")

    def on_suno_select(self, event):
        sel = self.suno_listbox.curselection()
        if not sel:
            return
        idx = sel[0]
        self.current_suno_edit_index = idx
        item = self.suno_prompts[idx]

        self.suno_form_header.config(text=f"✏️ '{item.get('title')}' 프롬프트 수정 중", fg="#d4af37")
        self.save_suno_edit_btn.config(state="normal")

        self.suno_url_entry.delete(0, tk.END)
        self.suno_url_entry.insert(0, item.get("sunoUrl", ""))

        self.suno_title_entry.delete(0, tk.END)
        self.suno_title_entry.insert(0, item.get("title", ""))

        self.suno_cat_combo.set(item.get("category", "EDM / 페스티벌"))
        self.suno_badge_combo.set(item.get("badge", "🔥 140 BPM 페스티벌 드롭"))

        self.suno_prompt_en_text.delete("1.0", tk.END)
        self.suno_prompt_en_text.insert("1.0", item.get("stylePromptEn", ""))

        self.suno_prompt_ko_text.delete("1.0", tk.END)
        self.suno_prompt_ko_text.insert("1.0", item.get("stylePromptKo", ""))

        self.suno_lyrics_text.delete("1.0", tk.END)
        self.suno_lyrics_text.insert("1.0", item.get("lyrics", ""))

        self.suno_desc_entry.delete(0, tk.END)
        self.suno_mp3_entry.delete(0, tk.END)
        self.suno_desc_entry.insert(0, item.get("desc", ""))

        self.suno_mp3_entry.delete(0, tk.END)
        self.suno_mp3_entry.insert(0, item.get("audioUrl", ""))

        self.status_label.config(text=f"선택한 Suno 프롬프트 '{item.get('title')}'을(를) 불러왔습니다.")

    def clear_suno_inputs(self):
        self.current_suno_edit_index = None
        self.suno_form_header.config(text="➕ 새 Suno 프롬프트 등록", fg="#f43f5e")
        self.save_suno_edit_btn.config(state="disabled")

        self.suno_url_entry.delete(0, tk.END)
        self.suno_title_entry.delete(0, tk.END)
        self.suno_cat_combo.set("EDM / 페스티벌")
        self.suno_badge_combo.set("🔥 140 BPM 페스티벌 드롭")
        self.suno_prompt_en_text.delete("1.0", tk.END)
        self.suno_prompt_ko_text.delete("1.0", tk.END)
        self.suno_lyrics_text.delete("1.0", tk.END)
        self.suno_desc_entry.delete(0, tk.END)
        self.suno_mp3_entry.delete(0, tk.END)

    def auto_fetch_suno(self):
        url = self.suno_url_entry.get().strip()
        if not url:
            messagebox.showwarning("입력 필요", "Suno 공유 링크(예: https://suno.com/s/...)를 입력해 주세요.")
            return

        self.status_label.config(text="⏳ Suno에서 정보(제목, 프롬프트, 가사)를 가져오는 중입니다...")
        self.root.update_idletasks()

        def worker():
            res = fetch_suno_details_helper(url)
            def update_ui():
                if not res:
                    messagebox.showerror("가져오기 실패", "Suno 링크 정보를 가져오지 못했습니다. 링크를 확인해 주세요.")
                    self.status_label.config(text="⚠️ Suno 정보 가져오기 실패")
                    return

                if res.get("title") and not self.suno_title_entry.get().strip():
                    self.suno_title_entry.delete(0, tk.END)
                    self.suno_title_entry.insert(0, res["title"])

                if res.get("tags"):
                    self.suno_prompt_en_text.delete("1.0", tk.END)
                    self.suno_prompt_en_text.insert("1.0", res["tags"])

                if res.get("lyrics"):
                    self.suno_lyrics_text.delete("1.0", tk.END)
                    self.suno_lyrics_text.insert("1.0", res["lyrics"])

                self.status_label.config(text="✅ Suno 정보(제목, 프롬프트, 가사)를 성공적으로 불러왔습니다! 이제 [한글 자동 번역]을 눌러보세요.")
                msg_txt = f"Suno에서 정보를 성공적으로 불러왔습니다!\n- 곡명: {res.get('title')}\n- 프롬프트 및 가사가 자동 채워졌습니다."
                messagebox.showinfo("가져오기 성공 🎉", msg_txt)

            self.root.after(0, update_ui)

        threading.Thread(target=worker, daemon=True).start()

    def auto_translate_suno_prompt(self):
        en_text = self.suno_prompt_en_text.get("1.0", tk.END).strip()
        if not en_text:
            messagebox.showwarning("입력 필요", "먼저 [영문 스타일 프롬프트]를 입력하거나 [자동 정보 가져오기]를 실행해 주세요.")
            return

        self.status_label.config(text="🌐 영문 프롬프트를 한글로 자동 번역하는 중입니다...")
        self.root.update_idletasks()

        def worker():
            ko_text = translate_en_to_ko_helper(en_text)
            def update_ui():
                self.suno_prompt_ko_text.delete("1.0", tk.END)
                self.suno_prompt_ko_text.insert("1.0", ko_text)
                self.status_label.config(text="✅ 영문 프롬프트의 한글 번역이 완료되었습니다!")
            self.root.after(0, update_ui)

        threading.Thread(target=worker, daemon=True).start()

    def add_new_suno(self):
        title = self.suno_title_entry.get().strip()
        if not title:
            messagebox.showwarning("입력 필요", "곡 제목을 입력해 주세요.")
            return

        url = self.suno_url_entry.get().strip()
        prompt_en = self.suno_prompt_en_text.get("1.0", tk.END).strip()
        prompt_ko = self.suno_prompt_ko_text.get("1.0", tk.END).strip()
        lyrics = self.suno_lyrics_text.get("1.0", tk.END).strip()
        cat = self.suno_cat_combo.get().strip() or "기타 장르"
        badge = self.suno_badge_combo.get().strip() or "🔥 Suno 명곡"
        desc = self.suno_desc_entry.get().strip()
        mp3_input = self.suno_mp3_entry.get().strip()

        final_audio_url = ""
        if mp3_input:
            if os.path.isfile(mp3_input):
                dest_name = f"suno_{int(time.time())}.mp3"
                dest_path = DOWNLOADS_PUBLIC_DIR / dest_name
                shutil.copy2(mp3_input, dest_path)
                final_audio_url = f"/downloads/{dest_name}"
            else:
                final_audio_url = mp3_input

        clip_id = ""
        m = re.search(r"song/([a-f0-9-]{36})", url)
        if m:
            clip_id = m.group(1)

        new_item = {
            "id": f"suno-{int(time.time())}",
            "title": title,
            "category": cat,
            "badge": badge,
            "badgeColor": "#f43f5e",
            "sunoUrl": url,
            "clipId": clip_id,
            "imageUrl": f"https://cdn2.suno.ai/image_large_{clip_id}.jpeg" if clip_id else "",
            "audioUrl": final_audio_url or (f"https://d2lwuy8qc234o3.cloudfront.net/1/clip/{clip_id}.m4a" if clip_id else ""),
            "stylePromptEn": prompt_en,
            "stylePromptKo": prompt_ko,
            "desc": desc,
            "lyrics": lyrics,
        }

        self.suno_prompts.insert(0, new_item)
        save_json(SUNO_PROMPTS_JSON, self.suno_prompts)
        self.refresh_suno_list()
        self.clear_suno_inputs()
        self.status_label.config(text=f"✅ '{title}' Suno 프롬프트가 추가되었습니다! 오른쪽 배포 버튼을 눌러 서버에 반영하세요.")
        messagebox.showinfo("추가 완료", f"'{title}' 프롬프트가 추가되었습니다!")

    def save_suno_edit(self):
        if self.current_suno_edit_index is None:
            return
        idx = self.current_suno_edit_index
        item = self.suno_prompts[idx]

        title = self.suno_title_entry.get().strip()
        if not title:
            messagebox.showwarning("입력 필요", "곡 제목을 입력해 주세요.")
            return

        url = self.suno_url_entry.get().strip()
        prompt_en = self.suno_prompt_en_text.get("1.0", tk.END).strip()
        prompt_ko = self.suno_prompt_ko_text.get("1.0", tk.END).strip()
        lyrics = self.suno_lyrics_text.get("1.0", tk.END).strip()
        cat = self.suno_cat_combo.get().strip() or "기타 장르"
        badge = self.suno_badge_combo.get().strip() or "🔥 Suno 명곡"
        desc = self.suno_desc_entry.get().strip()
        mp3_input = self.suno_mp3_entry.get().strip()

        if mp3_input:
            if os.path.isfile(mp3_input):
                dest_name = f"suno_{int(time.time())}.mp3"
                dest_path = DOWNLOADS_PUBLIC_DIR / dest_name
                shutil.copy2(mp3_input, dest_path)
                item["audioUrl"] = f"/downloads/{dest_name}"
            else:
                item["audioUrl"] = mp3_input

        clip_id = item.get("clipId", "")
        if url:
            m = re.search(r"song/([a-f0-9-]{36})", url)
            if m:
                clip_id = m.group(1)

        item["title"] = title
        item["sunoUrl"] = url
        item["category"] = cat
        item["badge"] = badge
        item["stylePromptEn"] = prompt_en
        item["stylePromptKo"] = prompt_ko
        item["lyrics"] = lyrics
        item["desc"] = desc
        if clip_id:
            item["clipId"] = clip_id
            item["imageUrl"] = f"https://cdn2.suno.ai/image_large_{clip_id}.jpeg"
            item["audioUrl"] = f"https://d2lwuy8qc234o3.cloudfront.net/1/clip/{clip_id}.m4a"

        self.suno_prompts[idx] = item
        save_json(SUNO_PROMPTS_JSON, self.suno_prompts)
        self.refresh_suno_list()
        self.status_label.config(text=f"💾 '{title}' 프롬프트 수정사항이 저장되었습니다.")
        messagebox.showinfo("저장 완료", f"'{title}' 프롬프트 수정사항이 안전하게 저장되었습니다!")

    def move_suno_up(self):
        sel = self.suno_listbox.curselection()
        if not sel or sel[0] == 0:
            return
        i = sel[0]
        self.suno_prompts[i - 1], self.suno_prompts[i] = self.suno_prompts[i], self.suno_prompts[i - 1]
        save_json(SUNO_PROMPTS_JSON, self.suno_prompts)
        self.refresh_suno_list()
        self.suno_listbox.selection_set(i - 1)

    def move_suno_down(self):
        sel = self.suno_listbox.curselection()
        if not sel or sel[0] >= len(self.suno_prompts) - 1:
            return
        i = sel[0]
        self.suno_prompts[i + 1], self.suno_prompts[i] = self.suno_prompts[i], self.suno_prompts[i + 1]
        save_json(SUNO_PROMPTS_JSON, self.suno_prompts)
        self.refresh_suno_list()
        self.suno_listbox.selection_set(i + 1)

    def delete_selected_suno(self):
        sel = self.suno_listbox.curselection()
        if not sel:
            return
        i = sel[0]
        title = self.suno_prompts[i].get("title", "")
        if messagebox.askyesno("삭제 확인", f"정말로 '{title}' Suno 프롬프트를 삭제하시겠습니까?"):
            removed = self.suno_prompts.pop(i)
            save_json(SUNO_PROMPTS_JSON, self.suno_prompts)
            self.refresh_suno_list()
            self.clear_suno_inputs()
            self.status_label.config(text=f"🗑️ '{removed.get('title')}' 프롬프트를 삭제했습니다.")

    def deploy_to_server(self):
        self.deploy_btn.config(state="disabled", text="⏳ 서버에 업로드 중입니다... 잠시만 기다려주세요")
        self.status_label.config(text="🚀 GitHub & Vercel 서버에 변경 사항을 자동 배포하는 중입니다...")

        def worker():
            try:
                subprocess.run(["git", "add", "."], cwd=str(BASE_DIR), check=False)
                subprocess.run(
                    ["git", "commit", "-m", f"Auto update via Homepage Manager ({time.strftime('%Y-%m-%d %H:%M:%S')})"],
                    cwd=str(BASE_DIR),
                    check=False,
                )
                res = subprocess.run(
                    ["git", "push", "origin", "main"],
                    cwd=str(BASE_DIR),
                    capture_output=True,
                    text=True,
                    encoding="utf-8",
                    errors="ignore",
                )
                self.root.after(0, lambda: self._on_deploy_done(res.returncode == 0, res.stderr or res.stdout))
            except Exception as e:
                self.root.after(0, lambda: self._on_deploy_done(False, str(e)))

        threading.Thread(target=worker, daemon=True).start()

    def _on_deploy_done(self, ok: bool, log_msg: str):
        self.deploy_btn.config(state="normal", text="🚀 홈페이지 서버에 즉시 반영하기 (자동 배포)")
        if ok:
            self.status_label.config(text="🎉 서버 배포 완료! 실시간 엔진으로 즉시 반영되었습니다!")
            if messagebox.askyesno(
                "배포 완료 🎉",
                "홈페이지 서버 업로드가 완료되었습니다!\n실시간 동기화로 브라우저 새로고침(F5) 시 즉시 반영됩니다.\n\n지금 바로 홈페이지를 열어볼까요?",
            ):
                webbrowser.open(SITE_URL)
        else:
            self.status_label.config(text="⚠️ 업로드 결과를 확인해 주세요.")
            messagebox.showinfo("배포 안내", f"서버 동기화 결과:\n{log_msg[:300]}")

if __name__ == "__main__":
    root = tk.Tk()
    app = HomepageManagerApp(root)
    root.mainloop()
