import re
from pathlib import Path

VIEWS_DIR = Path("src/views")

# Files that have old margin-left/padding-top in .main-content
monitor_files = [
    "TopologyView.vue",
    "BasebandView.vue",
    "MatrixView.vue",
    "OtherDevicesView.vue",
]

def remove_margin_padding(text: str) -> str:
    # Remove margin-left / padding-top / min-height from .main-content block
    pattern = re.compile(
        r'(\.main-content\s*\{)\s*'
        r'margin-left:\s*256px;\s*'
        r'padding-top:\s*64px;\s*'
        r'([^}]*\})',
        re.DOTALL
    )
    
    def repl(m):
        block = m.group(2)
        # Remove the trailing } from group(2) and clean remaining props if needed
        # group(2) ends with } because of the pattern
        # We want to keep other declarations like background-image etc.
        inner = block.rstrip().rstrip('}').strip()
        # Remove min-height if present
        inner = re.sub(r'min-height:\s*100vh;\s*', '', inner)
        # Clean up extra whitespace
        inner = re.sub(r'\n\s*\n', '\n', inner)
        return f".main-content {{\n  {inner}\n}}"
    
    text = pattern.sub(repl, text)
    
    # Remove responsive rule for .main-content margin-left: 0 inside @media
    text = re.sub(
        r'\n\s*\.main-content\s*\{\s*margin-left:\s*0;\s*\}\s*\n',
        '\n',
        text
    )
    return text

def fix_dashboard(text: str) -> str:
    return re.sub(
        r'padding:\s*88px\s+2rem\s+2rem;',
        'padding: 24px 2rem 2rem;',
        text
    )

def main():
    for name in monitor_files:
        path = VIEWS_DIR / name
        text = path.read_text(encoding='utf-8')
        new_text = remove_margin_padding(text)
        if new_text != text:
            path.write_text(new_text, encoding='utf-8')
            print(f"FIXED: {name}")
        else:
            print(f"NO CHANGE: {name}")
    
    dash_path = VIEWS_DIR / "DashboardView.vue"
    text = dash_path.read_text(encoding='utf-8')
    new_text = fix_dashboard(text)
    if new_text != text:
        dash_path.write_text(new_text, encoding='utf-8')
        print("FIXED: DashboardView.vue")
    else:
        print("NO CHANGE: DashboardView.vue")

if __name__ == "__main__":
    main()
