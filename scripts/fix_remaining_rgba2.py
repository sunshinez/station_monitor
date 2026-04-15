#!/usr/bin/env python3
"""补充修复遗漏的 rgba 颜色 - 第二批"""

import os

RGBA_MAP = {
    # 深色背景
    'rgba(11, 12, 16, 0.8)': 'rgba(247, 248, 251, 0.95)',
    'rgba(27, 27, 32, 0.8)': 'rgba(247, 248, 251, 0.95)',
    'rgba(27, 27, 32, 0.5)': 'rgba(247, 248, 251, 0.8)',
    'rgba(27, 27, 32, 0.3)': 'rgba(247, 248, 251, 0.6)',
    'rgba(14, 14, 19, 0.8)': 'rgba(247, 248, 251, 0.95)',
    'rgba(66, 71, 84, 0.3)': 'rgba(0, 0, 0, 0.08)',
    'rgba(100, 116, 139, 0.15)': 'rgba(156, 157, 166, 0.15)',
    'rgba(100, 116, 139, 0.2)': 'rgba(156, 157, 166, 0.2)',
    'rgba(100, 116, 139, 0.4)': 'rgba(156, 157, 166, 0.3)',
    
    # 蓝色
    'rgba(96, 165, 250, 0.05)': 'rgba(28, 106, 255, 0.05)',
    'rgba(96, 165, 250, 0.08)': 'rgba(28, 106, 255, 0.08)',
    'rgba(96, 165, 250, 0.12)': 'rgba(28, 106, 255, 0.12)',
    'rgba(96, 165, 250, 0.15)': 'rgba(28, 106, 255, 0.15)',
    'rgba(96, 165, 250, 0.7)': 'rgba(28, 106, 255, 0.7)',
    'rgba(96, 165, 250, 0.9)': 'rgba(28, 106, 255, 0.9)',
    'rgba(164, 201, 255, 0.05)': 'rgba(28, 106, 255, 0.05)',
    'rgba(164, 201, 255, 0.6)': 'rgba(28, 106, 255, 0.5)',
    'rgba(164, 201, 255, 0.8)': 'rgba(28, 106, 255, 0.7)',
    'rgba(173, 198, 255, 0.1)': 'rgba(28, 106, 255, 0.1)',
    'rgba(173, 198, 255, 0.2)': 'rgba(28, 106, 255, 0.2)',
    'rgba(59, 130, 246, 0.2)': 'rgba(28, 106, 250, 0.2)',
    'rgba(59, 130, 246, 0.4)': 'rgba(28, 106, 255, 0.3)',
    
    # 绿色
    'rgba(74, 225, 118, 0.05)': 'rgba(0, 167, 75, 0.05)',
    'rgba(74, 225, 118, 0.4)': 'rgba(0, 167, 75, 0.3)',
    
    # 红色/橙色/警告
    'rgba(255, 180, 171, 0.05)': 'rgba(237, 59, 59, 0.05)',
    'rgba(255, 180, 171, 0.8)': 'rgba(237, 59, 59, 0.5)',
    'rgba(245, 158, 11, 0.1)': 'rgba(237, 107, 1, 0.1)',
    'rgba(245, 158, 11, 0.15)': 'rgba(237, 107, 1, 0.15)',
    'rgba(245, 158, 11, 0.2)': 'rgba(237, 107, 1, 0.2)',
    'rgba(147, 0, 10, 0.6)': 'rgba(183, 0, 0, 0.6)',
    
    # 特殊白色
    'rgba(255,255,255,0.02)': 'rgba(0,0,0,0.02)',
    
    # box-shadow
    'box-shadow: 0 0 25px rgba(96, 165, 250, 0.3)': 'box-shadow: 0 0 25px rgba(28, 106, 255, 0.2)',
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
