import os
import time
import subprocess
import requests

print("==================================================")
print("🚀 [안티그래비티] 콘텐츠 무한 증식 자동화 공장 가동 🚀")
print("==================================================")

# 1. 환경 설정 (API 키는 D:\ai_keys.txt 등에서 읽어오도록 확장 가능)
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
OUTPUT_DIR = os.path.join(os.getcwd(), "public", "downloads")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_text_content(topic):
    """
    LLM API(OpenAI 등)를 호출하여 텍스트 초안을 생성하는 함수.
    (현재는 토큰 낭비를 막기 위해 시뮬레이션용 더미 데이터 반환)
    """
    print(f"[*] AI 엔진 가동 중: '{topic}' 주제로 전문 자료 작성 중...")
    time.sleep(2) # API 호출 대기 시뮬레이션
    return f"# {topic} 완벽 마스터 가이드\n\n이 자료는 자동화 스크립트에 의해 AI가 100% 자동 생성한 고퀄리티 전문 자료입니다.\n\n## 1. 개요\n{topic}의 핵심에 대해 알아봅시다."

def convert_to_html(title, content):
    """
    마크다운 텍스트를 고급스러운 E-Book HTML로 변환하는 함수.
    """
    print(f"[*] HTML E-Book 디자인 렌더링 중...")
    css = """
    <style>
        body { font-family: 'Malgun Gothic', sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 40px; background-color: #f9f9fb; }
        .container { background-color: #ffffff; padding: 40px 60px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        h1 { color: #1a1a2e; border-bottom: 3px solid #d4af37; padding-bottom: 15px; }
        h2 { color: #16213e; border-left: 5px solid #d4af37; padding-left: 15px; }
    </style>
    """
    
    html_content = content.replace('\n', '<br/>').replace('# ', '<h1>').replace('## ', '<h2>')
    
    final_html = f"""<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"><title>{title}</title>{css}</head>
<body><div class="container">{html_content}</div></body>
</html>"""
    return final_html

def save_ebook(title, html_content):
    filename = f"{title.replace(' ', '_')}.html"
    filepath = os.path.join(OUTPUT_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"[+] 생성 완료: {filepath}")
    return filename

def generate_remotion_video(topic):
    """
    Remotion 파이프라인을 호출하여 모션 그래픽 영상을 렌더링하는 함수.
    (별도의 Remotion 프로젝트 폴더에서 npx remotion render 실행)
    """
    print(f"[*] 리모션(Remotion) 렌더링 엔진 가동 중: '{topic}' 영상 생성 중...")
    time.sleep(2) # 렌더링 시간 시뮬레이션
    print(f"[+] 영상 렌더링 완료 (가상): public/downloads/{topic}_promo.mp4")

# --- 메인 실행 흐름 ---
if __name__ == "__main__":
    # 1. 자동화할 새로운 콘텐츠 주제 목록
    topics = ["미드저니(Midjourney) 그림 AI 가이드", "엑셀 자동화 10분 마스터", "캡컷(CapCut) 영상 편집 꿀팁"]
    
    for topic in topics:
        print(f"\n>>> [작업 시작] 주제: {topic}")
        # Text 생성 -> HTML 변환 -> 저장
        text_content = generate_text_content(topic)
        html_ebook = convert_to_html(topic, text_content)
        saved_file = save_ebook(topic, html_ebook)
        
        # 영상 자동 렌더링
        generate_remotion_video(topic)
        
    print("\n==================================================")
    print("✅ [성공] 모든 자동화 콘텐츠 생성 및 렌더링이 완료되었습니다!")
    print("==================================================")
