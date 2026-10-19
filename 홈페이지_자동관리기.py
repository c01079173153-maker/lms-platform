# -*- coding: utf-8 -*-
"""
👑 조선힙합소리꾼 × AI 무료 나눔 홈페이지 자동 관리기 (GUI v2)
- 탭 1: 🎵 홈페이지 명곡 선곡표 & '홈페이지 열면 바로 나오는 첫 시작 음악' 직접 지정!
- 탭 2: 📺 조선힙합소리꾼 유튜브 쇼케이스 곡 추가·순서변경·삭제
- 탭 3: 🛠️ 무료 프로그램(.zip, .exe, .pdf, .html 등) 및 자료실 항목 추가·삭제
- 우측 하단: [🚀 홈페이지 서버에 즉시 반영하기] 버튼 클릭 한 번으로 GitHub -> Vercel 자동 배포!
"""
import json
import os
import re
import shutil
import subprocess
import threading
import time
import urllib.request
import webbrowser
from pathlib import Path
import tkinter as tk
from tkinter import ttk, filedialog, messagebox

BASE_DIR = Path(r"D:\lms_platform")
BGM_JSON = BASE_DIR / "src" / "data" / "bgm.json"
SONGS_JSON = BASE_DIR / "src" / "data" / "songs.json"
PROGRAMS_JSON = BASE_DIR / "src" / "data" / "programs.json"
SORIKKUN_PUBLIC_DIR = BASE_DIR / "public" / "sorikkun"
DOWNLOADS_PUBLIC_DIR = BASE_DIR / "public" / "downloads"
SITE_URL = "https://lms-platform-ten-coral.vercel.app/"

SORIKKUN_PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
DOWNLOADS_PUBLIC_DIR.mkdir(parents=True, exist_ok=True)


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
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path: Path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


class HomepageManagerApp:
    def __init__(self, root: tk.Tk):
        self.root = root
        self.root.title("👑 조선힙합소리꾼 홈페이지 자동 관리기 (명곡 선곡표 · 유튜브 · 무료프로그램)")
        self.root.geometry("1120x840")
        self.root.configure(bg="#121216")

        self.bgm_data = load_json(BGM_JSON, {"defaultTrackId": "", "tracks": []})
        self.songs = load_json(SONGS_JSON, [])
        self.programs = load_json(PROGRAMS_JSON, [])

        self._build_ui()
        self.refresh_bgm_list()
        self.refresh_songs_list()
        self.refresh_programs_list()

    def _build_ui(self):
        # 상단 헤더
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

        # 노트북 탭 스타일
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
        self.tab_programs = tk.Frame(self.notebook, bg="#181820", padx=18, pady=14)

        self.notebook.add(self.tab_bgm, text=" 🎵 1. 홈페이지 명곡 선곡표 & 첫 시작 음악 지정 ")
        self.notebook.add(self.tab_songs, text=" 📺 2. 메인 화면 유튜브 영상 쇼케이스 관리 ")
        self.notebook.add(self.tab_programs, text=" 🛠️ 3. 무료 프로그램 / 전자책 / 자료실 관리 ")

        self._build_bgm_tab()
        self._build_songs_tab()
        self._build_programs_tab()

        # 하단 배포 버튼 영역
        footer = tk.Frame(self.root, bg="#1b1b22", pady=14, padx=20)
        footer.pack(fill="x", side="bottom")

        self.status_label = tk.Label(
            footer,
            text="💡 원하는 시작 음악을 지정하거나 곡/프로그램을 추가한 뒤 오른쪽 [🚀 홈페이지 서버에 즉시 반영하기]를 눌러주세요!",
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

    # =========================================================================
    # 탭 1: 🎵 홈페이지 명곡 선곡표 & 시작 음악 지정
    # =========================================================================
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

        # 대표 시작 음악 지정 빅 버튼
        tk.Button(
            left,
            text="👑 선택한 곡을 [홈페이지 열면 바로 나오는 첫 음악]으로 지정하기 (더블클릭 가능)",
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

        tk.Button(
            btn_row,
            text="🔼 선곡표 위로 이동",
            font=("맑은 고딕", 10, "bold"),
            bg="#2d2d3a",
            fg="white",
            padx=12,
            pady=6,
            relief="flat",
            command=self.move_bgm_up,
        ).pack(side="left", padx=4)

        tk.Button(
            btn_row,
            text="🔽 선곡표 아래로 이동",
            font=("맑은 고딕", 10, "bold"),
            bg="#2d2d3a",
            fg="white",
            padx=12,
            pady=6,
            relief="flat",
            command=self.move_bgm_down,
        ).pack(side="left", padx=4)

        tk.Button(
            btn_row,
            text="🗑️ 선곡표에서 삭제",
            font=("맑은 고딕", 10, "bold"),
            bg="#b91c1c",
            fg="white",
            padx=12,
            pady=6,
            relief="flat",
            command=self.delete_selected_bgm,
        ).pack(side="right", padx=4)

        # 오른쪽: 명곡 선곡표에 새 MP3 노래 추가하기
        right = tk.Frame(self.tab_bgm, bg="#22222c", padx=18, pady=16)
        right.pack(side="right", fill="both", expand=True)

        tk.Label(
            right,
            text="➕ 명곡 선곡표에 내 컴퓨터의 MP3 노래 추가하기",
            font=("맑은 고딕", 14, "bold"),
            fg="#fff1b8",
            bg="#22222c",
        ).pack(anchor="w", pady=(0, 14))

        tk.Label(
            right,
            text="① 추가할 MP3 음악 파일 선택 (D:\\음악 폴더 등):",
            font=("맑은 고딕", 11, "bold"),
            fg="white",
            bg="#22222c",
        ).pack(anchor="w")

        mp3_row = tk.Frame(right, bg="#22222c")
        mp3_row.pack(fill="x", pady=(6, 14))

        self.new_bgm_path_entry = tk.Entry(
            mp3_row, font=("맑은 고딕", 11), bg="#121216", fg="#a7f3d0", insertbackground="white"
        )
        self.new_bgm_path_entry.pack(side="left", fill="x", expand=True, ipady=5)

        tk.Button(
            mp3_row,
            text="📂 MP3 파일 선택",
            font=("맑은 고딕", 10, "bold"),
            bg="#10b981",
            fg="black",
            padx=12,
            pady=5,
            relief="flat",
            command=self.browse_new_bgm_mp3,
        ).pack(side="right", padx=(8, 0))

        tk.Label(
            right,
            text="② 선곡표에 표시될 노래 제목 (예: 인생 설명서 어디 있소 | 내 인생 반품이요!):",
            font=("맑은 고딕", 11, "bold"),
            fg="white",
            bg="#22222c",
        ).pack(anchor="w")

        self.new_bgm_title_entry = tk.Entry(
            right, font=("맑은 고딕", 11), bg="#121216", fg="white", insertbackground="white"
        )
        self.new_bgm_title_entry.pack(fill="x", pady=(6, 14), ipady=5)

        self.set_new_as_default_var = tk.BooleanVar(value=True)
        tk.Checkbutton(
            right,
            text="👑 이 노래를 추가함과 동시에 [홈페이지 열면 바로 나오는 첫 음악]으로 지정",
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

        tk.Label(
            right,
            text=(
                "\n📌 안내:\n"
                "• 왼쪽 목록에서 원하는 곡을 클릭하고 황금색 [👑 선택한 곡을 첫 음악으로 지정] 버튼을 누르면,\n"
                "  사람들이 홈페이지를 열었을 때 그 노래가 가장 먼저 자동으로 흘러나옵니다!\n"
                "• 지정 후 오른쪽 아래 빨간색 [🚀 홈페이지 서버에 즉시 반영하기] 버튼을 꼭 눌러주세요."
            ),
            font=("맑은 고딕", 10),
            fg="#a1a1aa",
            bg="#22222c",
            justify="left",
        ).pack(anchor="w", pady=(16, 0))

    # =========================================================================
    # 탭 2: 📺 유튜브 영상 쇼케이스 관리
    # =========================================================================
    def _build_songs_tab(self):
        left = tk.Frame(self.tab_songs, bg="#181820")
        left.pack(side="left", fill="both", expand=True, padx=(0, 12))

        tk.Label(
            left,
            text="📋 메인 화면 [조선힙합소리꾼 공식 채널관] 등록 곡 목록",
            font=("맑은 고딕", 13, "bold"),
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

        btn_row = tk.Frame(left, bg="#181820", pady=8)
        btn_row.pack(fill="x")

        tk.Button(
            btn_row,
            text="🔼 위로 이동",
            font=("맑은 고딕", 10, "bold"),
            bg="#2d2d3a",
            fg="white",
            padx=12,
            pady=6,
            relief="flat",
            command=self.move_song_up,
        ).pack(side="left", padx=4)

        tk.Button(
            btn_row,
            text="🔽 아래로 이동",
            font=("맑은 고딕", 10, "bold"),
            bg="#2d2d3a",
            fg="white",
            padx=12,
            pady=6,
            relief="flat",
            command=self.move_song_down,
        ).pack(side="left", padx=4)

        tk.Button(
            btn_row,
            text="🗑️ 선택 곡 삭제",
            font=("맑은 고딕", 10, "bold"),
            bg="#b91c1c",
            fg="white",
            padx=12,
            pady=6,
            relief="flat",
            command=self.delete_selected_song,
        ).pack(side="right", padx=4)

        right = tk.Frame(self.tab_songs, bg="#22222c", padx=18, pady=14)
        right.pack(side="right", fill="both", expand=True)

        tk.Label(
            right,
            text="➕ 신곡 / 유튜브 영상 새로 추가하기",
            font=("맑은 고딕", 14, "bold"),
            fg="#fff1b8",
            bg="#22222c",
        ).pack(anchor="w", pady=(0, 12))

        tk.Label(right, text="① 유튜브 영상 주소(URL) 붙여넣기:", font=("맑은 고딕", 11, "bold"), fg="white", bg="#22222c").pack(anchor="w")
        url_frame = tk.Frame(right, bg="#22222c")
        url_frame.pack(fill="x", pady=(4, 10))

        self.song_url_entry = tk.Entry(url_frame, font=("맑은 고딕", 11), bg="#121216", fg="white", insertbackground="white")
        self.song_url_entry.pack(side="left", fill="x", expand=True, ipady=5)

        tk.Button(
            url_frame,
            text="🔍 제목 자동 불러오기",
            font=("맑은 고딕", 10, "bold"),
            bg="#d4af37",
            fg="black",
            padx=10,
            pady=4,
            relief="flat",
            command=self.autofill_youtube_info,
        ).pack(side="right", padx=(8, 0))

        tk.Label(right, text="② 곡 제목 (예: 🎧 나도 사람이다!):", font=("맑은 고딕", 11, "bold"), fg="white", bg="#22222c").pack(anchor="w")
        self.song_title_entry = tk.Entry(right, font=("맑은 고딕", 11), bg="#121216", fg="white", insertbackground="white")
        self.song_title_entry.pack(fill="x", pady=(4, 10), ipady=5)

        tk.Label(right, text="③ 한 줄 소개 (부제):", font=("맑은 고딕", 11, "bold"), fg="white", bg="#22222c").pack(anchor="w")
        self.song_sub_entry = tk.Entry(right, font=("맑은 고딕", 11), bg="#121216", fg="white", insertbackground="white")
        self.song_sub_entry.pack(fill="x", pady=(4, 10), ipady=5)

        cat_frame = tk.Frame(right, bg="#22222c")
        cat_frame.pack(fill="x", pady=(0, 10))

        tk.Label(cat_frame, text="④ 분류:", font=("맑은 고딕", 11, "bold"), fg="white", bg="#22222c").pack(side="left")
        self.song_cat_var = tk.StringVar(value="comfort")
        cat_combo = ttk.Combobox(
            cat_frame,
            textvariable=self.song_cat_var,
            values=["comfort (😭 눈물·인생 위로곡)", "cider (🤬 속시원한 사이다곡)", "playlist (🎶 연속듣기 모음집)"],
            font=("맑은 고딕", 10),
            width=28,
            state="readonly",
        )
        cat_combo.current(0)
        cat_combo.pack(side="left", padx=8)

        tk.Label(cat_frame, text="배지 문구:", font=("맑은 고딕", 11, "bold"), fg="white", bg="#22222c").pack(side="left", padx=(8, 4))
        self.song_badge_entry = tk.Entry(cat_frame, font=("맑은 고딕", 10), bg="#121216", fg="white", insertbackground="white", width=16)
        self.song_badge_entry.insert(0, "🔥 최신 신곡")
        self.song_badge_entry.pack(side="left", ipady=3)

        tk.Label(right, text="⑤ 곡 상세 설명:", font=("맑은 고딕", 11, "bold"), fg="white", bg="#22222c").pack(anchor="w")
        self.song_desc_entry = tk.Entry(right, font=("맑은 고딕", 11), bg="#121216", fg="white", insertbackground="white")
        self.song_desc_entry.pack(fill="x", pady=(4, 10), ipady=5)

        tk.Label(
            right,
            text="⑥ 고음질 MP3 원곡 파일 첨부 (선택 - 첨부 시 명곡 선곡표에도 자동 등록):",
            font=("맑은 고딕", 10, "bold"),
            fg="#a7f3d0",
            bg="#22222c",
        ).pack(anchor="w")

        mp3_frame = tk.Frame(right, bg="#22222c")
        mp3_frame.pack(fill="x", pady=(4, 14))

        self.song_mp3_entry = tk.Entry(mp3_frame, font=("맑은 고딕", 10), bg="#121216", fg="#a7f3d0", insertbackground="white")
        self.song_mp3_entry.pack(side="left", fill="x", expand=True, ipady=4)

        tk.Button(
            mp3_frame,
            text="📂 MP3 찾아보기",
            font=("맑은 고딕", 10, "bold"),
            bg="#10b981",
            fg="black",
            padx=10,
            pady=4,
            relief="flat",
            command=self.browse_mp3,
        ).pack(side="right", padx=(8, 0))

        tk.Button(
            right,
            text="➕ 홈페이지 곡 목록에 추가하기",
            font=("맑은 고딕", 13, "bold"),
            bg="#d4af37",
            fg="black",
            pady=10,
            relief="flat",
            cursor="hand2",
            command=self.add_song,
        ).pack(fill="x", pady=(6, 0))

    # =========================================================================
    # 탭 3: 🛠️ 무료 프로그램 / 자료실 관리
    # =========================================================================
    def _build_programs_tab(self):
        left = tk.Frame(self.tab_programs, bg="#181820")
        left.pack(side="left", fill="both", expand=True, padx=(0, 12))

        tk.Label(
            left,
            text="📋 현재 등록된 무료 프로그램 & 자료실 목록",
            font=("맑은 고딕", 13, "bold"),
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

        btn_row = tk.Frame(left, bg="#181820", pady=8)
        btn_row.pack(fill="x")

        tk.Button(
            btn_row,
            text="🔼 위로 이동",
            font=("맑은 고딕", 10, "bold"),
            bg="#2d2d3a",
            fg="white",
            padx=12,
            pady=6,
            relief="flat",
            command=self.move_program_up,
        ).pack(side="left", padx=4)

        tk.Button(
            btn_row,
            text="🔽 아래로 이동",
            font=("맑은 고딕", 10, "bold"),
            bg="#2d2d3a",
            fg="white",
            padx=12,
            pady=6,
            relief="flat",
            command=self.move_program_down,
        ).pack(side="left", padx=4)

        tk.Button(
            btn_row,
            text="🗑️ 선택 항목 삭제",
            font=("맑은 고딕", 10, "bold"),
            bg="#b91c1c",
            fg="white",
            padx=12,
            pady=6,
            relief="flat",
            command=self.delete_selected_program,
        ).pack(side="right", padx=4)

        right = tk.Frame(self.tab_programs, bg="#22222c", padx=18, pady=14)
        right.pack(side="right", fill="both", expand=True)

        tk.Label(
            right,
            text="➕ 새 무료 프로그램 / 유용한 자료 추가하기",
            font=("맑은 고딕", 14, "bold"),
            fg="#a7f3d0",
            bg="#22222c",
        ).pack(anchor="w", pady=(0, 12))

        tk.Label(
            right,
            text="① 배포할 프로그램/자료 파일 선택 (.zip, .exe, .pdf, .html 등):",
            font=("맑은 고딕", 11, "bold"),
            fg="white",
            bg="#22222c",
        ).pack(anchor="w")

        file_frame = tk.Frame(right, bg="#22222c")
        file_frame.pack(fill="x", pady=(4, 12))

        self.prog_file_entry = tk.Entry(file_frame, font=("맑은 고딕", 11), bg="#121216", fg="#a7f3d0", insertbackground="white")
        self.prog_file_entry.pack(side="left", fill="x", expand=True, ipady=5)

        tk.Button(
            file_frame,
            text="📂 내 컴퓨터에서 파일 선택",
            font=("맑은 고딕", 10, "bold"),
            bg="#10b981",
            fg="black",
            padx=12,
            pady=5,
            relief="flat",
            command=self.browse_program_file,
        ).pack(side="right", padx=(8, 0))

        tk.Label(right, text="② 프로그램/자료 제목 (예: [무료 프로그램] 유튜브 자동 업로드기):", font=("맑은 고딕", 11, "bold"), fg="white", bg="#22222c").pack(anchor="w")
        self.prog_title_entry = tk.Entry(right, font=("맑은 고딕", 11), bg="#121216", fg="white", insertbackground="white")
        self.prog_title_entry.pack(fill="x", pady=(4, 12), ipady=5)

        tk.Label(right, text="③ 설명 문구:", font=("맑은 고딕", 11, "bold"), fg="white", bg="#22222c").pack(anchor="w")
        self.prog_desc_entry = tk.Entry(right, font=("맑은 고딕", 11), bg="#121216", fg="white", insertbackground="white")
        self.prog_desc_entry.pack(fill="x", pady=(4, 12), ipady=5)

        meta_frame = tk.Frame(right, bg="#22222c")
        meta_frame.pack(fill="x", pady=(0, 14))

        tk.Label(meta_frame, text="④ 배지 문구:", font=("맑은 고딕", 11, "bold"), fg="white", bg="#22222c").pack(side="left")
        self.prog_badge_entry = tk.Entry(meta_frame, font=("맑은 고딕", 11), bg="#121216", fg="white", width=18)
        self.prog_badge_entry.insert(0, "🎁 신규 무료 프로그램")
        self.prog_badge_entry.pack(side="left", padx=8, ipady=3)

        tk.Label(meta_frame, text="아이콘:", font=("맑은 고딕", 11, "bold"), fg="white", bg="#22222c").pack(side="left", padx=(8, 4))
        self.prog_icon_entry = tk.Entry(meta_frame, font=("맑은 고딕", 11), bg="#121216", fg="white", width=6)
        self.prog_icon_entry.insert(0, "🛠️")
        self.prog_icon_entry.pack(side="left", ipady=3)

        tk.Button(
            right,
            text="➕ 무료 프로그램/자료실에 추가하기",
            font=("맑은 고딕", 13, "bold"),
            bg="#10b981",
            fg="black",
            pady=10,
            relief="flat",
            cursor="hand2",
            command=self.add_program,
        ).pack(fill="x", pady=(10, 0))

    # =========================================================================
    # BGM 선곡표 관리 로직
    # =========================================================================
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
            messagebox.showwarning("곡 선택", "먼저 목록에서 [홈페이지 열면 바로 나올 노래]를 마우스로 클릭해 선택해 주세요!")
            return
        idx = sel[0]
        tracks = self.bgm_data.get("tracks", [])
        chosen = tracks[idx]
        self.bgm_data["defaultTrackId"] = chosen["id"]
        save_json(BGM_JSON, self.bgm_data)
        self.refresh_bgm_list()
        self.bgm_listbox.selection_set(idx)
        self.status_label.config(
            text=f"👑 '{chosen['title']}' 곡이 홈페이지 첫 시작 음악으로 지정되었습니다! [🚀 홈페이지 서버에 즉시 반영하기]를 눌러주세요."
        )
        messagebox.showinfo(
            "첫 시작 음악 지정 완료 👑",
            f"이제 홈페이지를 열면\n\n🎵 《{chosen['title']}》\n\n노래가 가장 먼저 자동으로 재생됩니다!\n\n오른쪽 아래 [🚀 홈페이지 서버에 즉시 반영하기] 버튼을 누르시면 실제 사이트에 적용됩니다.",
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
        messagebox.showinfo("선곡표 등록 완료", f"'{title}' 곡이 명곡 선곡표에 등록되었습니다!\n\n오른쪽 아래 [🚀 홈페이지 서버에 즉시 반영하기]를 눌러주세요.")

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

    # =========================================================================
    # 탭 2 & 탭 3 기존 로직
    # =========================================================================
    def refresh_songs_list(self):
        self.songs_listbox.delete(0, tk.END)
        for i, s in enumerate(self.songs, 1):
            mp3_tag = " [🎵MP3포함]" if s.get("mp3Src") else ""
            self.songs_listbox.insert(tk.END, f"{i}. {s['title']} ({s['videoId']}){mp3_tag}")

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
        badge = self.song_badge_entry.get().strip() or "🔥 최신 신곡"
        cat_raw = self.song_cat_var.get().split()[0]
        mp3_local = self.song_mp3_entry.get().strip()

        if not raw_url or not title:
            messagebox.showwarning("필수 입력", "① 유튜브 영상 주소와 ② 곡 제목은 꼭 입력해 주세요!")
            return

        vid = extract_youtube_id(raw_url)
        new_item = {
            "id": f"song-{int(time.time())}",
            "videoId": vid,
            "title": title if title.startswith("🎧") else f"🎧 {title}",
            "subtitle": subtitle,
            "category": cat_raw,
            "badge": badge,
            "badgeColor": "#ff3b30" if cat_raw == "cider" else "#f59e0b",
            "desc": desc,
            "youtubeUrl": f"https://youtu.be/{vid}",
        }

        if mp3_local and os.path.exists(mp3_local):
            safe_name = f"track_{vid}.mp3"
            dest = SORIKKUN_PUBLIC_DIR / safe_name
            shutil.copy2(mp3_local, dest)
            new_item["mp3Src"] = f"/sorikkun/{safe_name}"
            # 명곡 선곡표에도 함께 추가
            self.bgm_data.setdefault("tracks", []).append(
                {
                    "id": f"bgm-{vid}",
                    "title": title.replace("🎧", "").strip(),
                    "src": f"/sorikkun/{safe_name}",
                    "youtubeUrl": f"https://youtu.be/{vid}",
                }
            )
            save_json(BGM_JSON, self.bgm_data)
            self.refresh_bgm_list()

        self.songs.insert(0, new_item)
        save_json(SONGS_JSON, self.songs)
        self.refresh_songs_list()

        self.song_url_entry.delete(0, tk.END)
        self.song_title_entry.delete(0, tk.END)
        self.song_sub_entry.delete(0, tk.END)
        self.song_desc_entry.delete(0, tk.END)
        self.song_mp3_entry.delete(0, tk.END)

        self.status_label.config(text=f"✅ '{title}' 곡이 추가되었습니다! 우측 하단 [🚀 홈페이지 서버에 즉시 반영하기]를 눌러주세요.")
        messagebox.showinfo("추가 완료", f"'{title}' 곡이 추가되었습니다!")

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
        self.status_label.config(text=f"🗑️ '{removed['title']}' 항목을 삭제했습니다.")

    def refresh_programs_list(self):
        self.programs_listbox.delete(0, tk.END)
        for i, p in enumerate(self.programs, 1):
            self.programs_listbox.insert(tk.END, f"{i}. {p['icon']} [{p['badge']}] {p['title']}")

    def browse_program_file(self):
        path = filedialog.askopenfilename(
            title="무료 배포할 프로그램/자료 파일 선택",
            filetypes=[("All Files", "*.*")],
        )
        if path:
            self.prog_file_entry.delete(0, tk.END)
            self.prog_file_entry.insert(0, path)
            if not self.prog_title_entry.get().strip():
                stem = Path(path).stem
                self.prog_title_entry.insert(0, f"[무료 배포] {stem}")

    def add_program(self):
        file_or_url = self.prog_file_entry.get().strip()
        title = self.prog_title_entry.get().strip()
        desc = self.prog_desc_entry.get().strip() or "누구나 조건 없이 100% 무료로 다운로드하여 사용하실 수 있습니다."
        badge = self.prog_badge_entry.get().strip() or "🎁 무료 배포"
        icon = self.prog_icon_entry.get().strip() or "🛠️"

        if not file_or_url or not title:
            messagebox.showwarning("필수 입력", "① 배포할 파일(또는 주소)과 ② 제목을 입력해 주세요!")
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

        self.prog_file_entry.delete(0, tk.END)
        self.prog_title_entry.delete(0, tk.END)
        self.prog_desc_entry.delete(0, tk.END)

        self.status_label.config(text=f"✅ '{title}' 자료가 추가되었습니다!")
        messagebox.showinfo("추가 완료", f"'{title}' 항목이 무료 자료실 맨 앞에 추가되었습니다!")

    def move_program_up(self):
        sel = self.programs_listbox.curselection()
        if not sel or sel[0] == 0:
            return
        i = sel[0]
        self.programs[i - 1], self.programs[i] = self.programs[i], self.programs[i - 1]
        save_json(PROGRAMS_JSON, self.programs)
        self.refresh_programs_list()
        self.programs_listbox.selection_set(i - 1)

    def move_program_down(self):
        sel = self.programs_listbox.curselection()
        if not sel or sel[0] >= len(self.programs) - 1:
            return
        i = sel[0]
        self.programs[i + 1], self.programs[i] = self.programs[i], self.programs[i + 1]
        save_json(PROGRAMS_JSON, self.programs)
        self.refresh_programs_list()
        self.programs_listbox.selection_set(i + 1)

    def delete_selected_program(self):
        sel = self.programs_listbox.curselection()
        if not sel:
            return
        i = sel[0]
        removed = self.programs.pop(i)
        save_json(PROGRAMS_JSON, self.programs)
        self.refresh_programs_list()
        self.status_label.config(text=f"🗑️ '{removed['title']}' 항목을 삭제했습니다.")

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
            self.status_label.config(text="🎉 서버 배포 완료! 약 40초 뒤 홈페이지(F5 새로고침)에 반영됩니다!")
            if messagebox.askyesno(
                "배포 완료 🎉",
                "홈페이지 서버 업로드가 완료되었습니다!\n(약 30~50초 뒤 실제 사이트에 반영됩니다)\n\n지금 바로 홈페이지를 열어볼까요?",
            ):
                webbrowser.open(SITE_URL)
        else:
            self.status_label.config(text="⚠️ 변경 사항이 없거나 업로드 중 확인이 필요합니다.")
            messagebox.showinfo("배포 안내", f"서버 동기화 결과:\n{log_msg[:300]}")


if __name__ == "__main__":
    root = tk.Tk()
    app = HomepageManagerApp(root)
    root.mainloop()
