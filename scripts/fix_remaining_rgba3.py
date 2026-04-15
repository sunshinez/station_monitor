#!/usr/bin/env python3
"""补充修复遗漏的 rgba 颜色 - 第三批（最终）"""

import os

RGBA_MAP = {
    # 深色背景
    'rgba(14, 14, 19, 0.4)': 'rgba(247, 248, 251, 0.8)',
    'rgba(42, 41, 47, 0.5)': 'rgba(247, 248, 251, 0.85)',
    'rgba(53, 52, 58, 0.4)': 'rgba(247, 248, 251, 0.7)',
    'rgba(53, 52, 58, 0.5)': 'rgba(247, 248, 251, 0.8)',
    'rgba(30, 41, 59, 0.9)': 'rgba(247, 248, 251, 0.95)',
    
    # 绿色
    'rgba(74, 225, 118, 0.2)': 'rgba(0, 167, 75, 0.2)',
    
    # 蓝色
    'rgba(173, 198, 255, 0.15)': 'rgba(28, 106, 255, 0.15)',
    'rgba(173, 198, 255, 0.3)': 'rgba(28, 106, 255, 0.3)',
    
    # 红色
    'rgba(255, 180, 171, 0.08)': 'rgba(237, 59, 59, 0.08)',
    
    # 橙色
    'rgba(245, 158, 11, 0.4)': 'rgba(237, 107, 1, 0.3)',
}

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    for old, new in sorted(RGBA_MAP.items(), key=lambda x: -len(x[0])):
        content = content.replace(old, new)
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated: {filepath}')

def main():
    base_dir = os.path.join(os.path.dirname(__file__), '..', 'src')
    for root, dirs, files in os.walk(base_dir):
        for name in files:
            if name.endswith(('.vue', '.css')):
                filepath = os.path.join(root, name)
                replace_in_file(filepath)

if __name__ == '__main__':
    main()
