import os
import markdown
import codecs

md_files = [
    ("1_ChatGPT_프롬프트_치트키_50선.md", "chatgpt_50.html", "챗GPT 실전 프롬프트 치트키 50선"),
    ("2_클로드_활용_백서.md", "claude_guide.html", "클로드(Claude) 활용 백서"),
    ("3_제미나이_실무_템플릿.md", "gemini_template.html", "제미나이(Gemini) 실무 템플릿"),
    ("4_유튜브_채널_개설법.md", "youtube_guide.html", "유튜브 채널 개설법")
]

CSS = """
<style>
    body {
        font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 800px;
        margin: 0 auto;
        padding: 40px;
        background-color: #f9f9fb;
    }
    .container {
        background-color: #ffffff;
        padding: 40px 60px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }
    h1 {
        color: #1a1a2e;
        border-bottom: 3px solid #d4af37;
        padding-bottom: 15px;
        margin-bottom: 30px;
        text-align: center;
    }
    h2 {
        color: #16213e;
        margin-top: 40px;
        border-left: 5px solid #d4af37;
        padding-left: 15px;
    }
    blockquote {
        background-color: #f3f4f6;
        border-left: 5px solid #3b82f6;
        margin: 20px 0;
        padding: 20px;
        border-radius: 4px;
        font-style: italic;
    }
    p { margin-bottom: 16px; font-size: 1.1rem; }
    strong { color: #d4af37; }
    .footer {
        margin-top: 50px;
        text-align: center;
        color: #888;
        font-size: 0.9rem;
        border-top: 1px solid #eee;
        padding-top: 20px;
    }
</style>
"""

input_dir = r"D:\LMS_Expert_Materials"
output_dir = r"public\downloads"

for md_file, html_file, title in md_files:
    input_path = os.path.join(input_dir, md_file)
    output_path = os.path.join(output_dir, html_file)
    
    if os.path.exists(input_path):
        with codecs.open(input_path, "r", encoding="utf-8") as f:
            text = f.read()
            
        html = markdown.markdown(text)
        
        final_html = f"""<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>{title}</title>
    {CSS}
</head>
<body>
    <div class="container">
        {html}
        <div class="footer">
            &copy; 2026 AI 에반젤리스트 염상민. All rights reserved. <br/>
            본 자료는 프리미엄 시니어 AI 마스터 클래스 수강생을 위한 전용 자료입니다.
        </div>
    </div>
</body>
</html>
"""
        with codecs.open(output_path, "w", encoding="utf-8") as f:
            f.write(final_html)
        print(f"Generated {html_file}")
    else:
        print(f"File not found: {input_path}")
