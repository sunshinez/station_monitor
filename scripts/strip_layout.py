import re
from pathlib import Path

VIEWS_DIR = Path("src/views")

def extract_main_content(template_text: str, main_class: str = "main-content") -> str:
    """Extract the <main class="{main_class}"> block and return new template."""
    start_pattern = re.compile(rf'(<main\s+class="{re.escape(main_class)}">)')
    match = start_pattern.search(template_text)
    if not match:
        return None
    
    start_idx = match.start()
    inner_start = match.end()
    
    depth = 1
    pos = inner_start
    while depth > 0 and pos < len(template_text):
        next_open = template_text.find('<main', pos)
        next_close = template_text.find('</main>', pos)
        
        if next_close == -1:
            return None
        
        if next_open != -1 and next_open < next_close:
            depth += 1
            pos = next_open + 5
        else:
            depth -= 1
            if depth == 0:
                end_idx = next_close + len('</main>')
                break
            pos = next_close + 7
    else:
        return None
    
    main_block = template_text[start_idx:end_idx]
    return f'<template>\n  {main_block}\n</template>'

def process_file(filepath: Path):
    text = filepath.read_text(encoding='utf-8')
    
    if filepath.name == "LoginView.vue":
        print(f"SKIP: {filepath.name}")
        return
    
    if 'class="dashboard-content"' in text:
        main_class = "dashboard-content"
    elif 'class="main-content"' in text:
        main_class = "main-content"
    else:
        print(f"SKIP (no recognized main): {filepath.name}")
        return
    
    template_match = re.search(r'<template>.*?</template>', text, re.DOTALL)
    if not template_match:
        print(f"SKIP (no template): {filepath.name}")
        return
    
    old_template = template_match.group(0)
    new_template = extract_main_content(old_template, main_class)
    
    if not new_template:
        print(f"SKIP (could not extract main): {filepath.name}")
        return
    
    new_text = text[:template_match.start()] + new_template + text[template_match.end():]
    filepath.write_text(new_text, encoding='utf-8')
    print(f"OK: {filepath.name}")

def main():
    for filepath in sorted(VIEWS_DIR.glob("*.vue")):
        process_file(filepath)

if __name__ == "__main__":
    main()
