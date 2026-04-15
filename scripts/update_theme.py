#!/usr/bin/env python3
"""根据星网规范批量更新项目配色和字体"""

import os
import re

# 颜色映射：旧颜色 -> 新颜色
COLOR_MAP = {
    # 深色背景 → 浅色背景
    '#0B0B10': '#EDEFF3',
    '#0b0b10': '#EDEFF3',
    '#0b0c10': '#EDEFF3',
    '#131318': '#EDEFF3',
    '#131418': '#EDEFF3',
    '#020617': '#EDEFF3',
    '#1b1b20': '#F7F8FB',
    '#1b1c21': '#F7F8FB',
    '#1f1f24': '#F7F8FB',
    '#2a292f': '#F7F8FB',
    '#35343a': '#F7F8FB',
    '#0e0e13': '#F2F4F7',
    '#0f172a': '#F7F8FB',
    '#0F172A': '#F7F8FB',
    
    # 文字色
    '#e4e1e9': '#4B4C57',
    '#ffffff': '#4B4C57',
    '#FFFFFF': '#4B4C57',
    '#94a3b8': '#9C9DA6',
    '#94A3B8': '#9C9DA6',
    '#64748b': '#9C9DA6',
    '#c2c6d6': '#7F808F',
    '#8c909f': '#9C9DA6',
    '#cbd5e1': '#9C9DA6',
    
    # 主色/强调色
    '#60a5fa': '#1C6AFF',
    '#60A5FA': '#1C6AFF',
    '#a4c9ff': '#1C6AFF',
    '#adc6ff': '#1C6AFF',
    '#4c93e7': '#1C6AFF',
    '#3b82f6': '#1C6AFF',
    '#0566d9': '#1C6AFF',
    '#93c5fd': '#1C6AFF',
    '#a855f7': '#1C6AFF',
    '#a78bfa': '#1C6AFF',
    '#c084fc': '#1C6AFF',
    
    # 边框/分割线
    '#1e293b': '#DFE3EA',
    '#1E293B': '#DFE3EA',
    '#334155': '#DFE3EA',
    '#424754': '#DFE3EA',
    '#374151': '#DFE3EA',
    '#475569': '#DFE3EA',
    '#1f2937': '#DFE3EA',
    
    # 功能色调整
    '#ffb4ab': '#ED3B3B',
    '#ffdad6': '#FFF1F0',
    '#ff8a80': '#ED3B3B',
    '#690005': '#B70000',
    '#f59e0b': '#ED6B01',
    
    # 其他
    '#00315d': '#1C6AFF',
    '#001c39': '#1C6AFF',
    '#000000': '#4B4C57',
}

# RGBA 映射
RGBA_MAP = {
    'rgba(255, 255, 255, 0.05)': 'rgba(0, 0, 0, 0.05)',
    'rgba(255, 255, 255, 0.03)': 'rgba(0, 0, 0, 0.03)',
    'rgba(66, 71, 84, 0.1)': 'rgba(0, 0, 0, 0.06)',
    'rgba(66, 71, 84, 0.05)': 'rgba(0, 0, 0, 0.04)',
    'rgba(164, 201, 255, 0.3)': 'rgba(28, 106, 255, 0.3)',
    'rgba(164, 201, 255, 0.2)': 'rgba(28, 106, 255, 0.2)',
    'rgba(164, 201, 255, 0.4)': 'rgba(28, 106, 255, 0.4)',
    'rgba(164, 201, 255, 0.1)': 'rgba(28, 106, 255, 0.1)',
    'rgba(74, 225, 118, 0.3)': 'rgba(0, 167, 75, 0.3)',
    'rgba(74, 225, 118, 0.1)': 'rgba(0, 167, 75, 0.1)',
    'rgba(255, 180, 171, 0.3)': 'rgba(237, 59, 59, 0.2)',
    'rgba(255, 180, 171, 0.7)': 'rgba(237, 59, 59, 0.7)',
    'rgba(59, 130, 246, 0.1)': 'rgba(28, 106, 255, 0.1)',
    'rgba(59, 130, 246, 0.05)': 'rgba(28, 106, 255, 0.05)',
    'rgba(59, 130, 246, 0.3)': 'rgba(28, 106, 255, 0.3)',
    'rgba(16, 185, 129, 0.2)': 'rgba(0, 167, 75, 0.2)',
    'rgba(96, 165, 250, 0.1)': 'rgba(28, 106, 255, 0.1)',
    'rgba(96, 165, 250, 0.3)': 'rgba(28, 106, 255, 0.3)',
    'rgba(96, 165, 250, 0.2)': 'rgba(28, 106, 255, 0.2)',
    'rgba(96, 165, 250, 0.5)': 'rgba(28, 106, 255, 0.5)',
    'rgba(30, 41, 59, 0.2)': 'rgba(223, 227, 234, 0.6)',
    'rgba(30, 41, 59, 0.5)': 'rgba(223, 227, 234, 1)',
    'rgba(5, 102, 217, 0.2)': 'rgba(28, 106, 255, 0.1)',
    'rgba(30, 58, 138, 0.1)': 'rgba(28, 106, 255, 0.08)',
}

# 字体替换（按长度降序，避免部分替换）
FONT_REPLACEMENTS = [
    ("'Inter', -apple-system, BlinkMacSystemFont, sans-serif", "'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif"),
    ("'Inter', system-ui, -apple-system, sans-serif", "'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif"),
    ("'Space Grotesk', system-ui, -apple-system, sans-serif", "'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif"),
    ("'Fira Code', 'Courier New', monospace", "'Microsoft YaHei', 'SF Mono', 'Fira Code', 'Courier New', monospace"),
    ("font-family: 'Inter'", "font-family: 'Microsoft YaHei'"),
    ("font-family: 'Fira Code'", "font-family: 'Microsoft YaHei'"),
    ("font-family: 'Space Grotesk'", "font-family: 'Microsoft YaHei'"),
    ("font-family: 'Fira Code', monospace", "font-family: 'Microsoft YaHei', 'SF Mono', 'Fira Code', 'Courier New', monospace"),
]

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # 替换 RGBA（先替换长的）
    for old, new in sorted(RGBA_MAP.items(), key=lambda x: -len(x[0])):
        content = content.replace(old, new)
    
    # 替换颜色（先替换长的）
    for old, new in sorted(COLOR_MAP.items(), key=lambda x: -len(x[0])):
        content = content.replace(old, new)
    
    # 替换字体（按长度降序）
    for old, new in FONT_REPLACEMENTS:
        content = content.replace(old, new)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated: {filepath}')

def main():
    base_dir = os.path.join(os.path.dirname(__file__), '..', 'src')
    for root, dirs, files in os.walk(base_dir):
        for name in files:
            if name.endswith(('.vue', '.css', '.ts', '.js')):
                filepath = os.path.join(root, name)
                replace_in_file(filepath)

if __name__ == '__main__':
    main()
