#!/usr/bin/env python3
import re
import os

files = [
    "/Users/hongyinzhang/project/station_monitor/src/views/TaskCentralDispatchView.vue",
    "/Users/hongyinzhang/project/station_monitor/src/views/TaskLocalDispatchView.vue",
    "/Users/hongyinzhang/project/station_monitor/src/views/TaskFaultDiagnosisView.vue",
    "/Users/hongyinzhang/project/station_monitor/src/views/LogRecordView.vue",
    "/Users/hongyinzhang/project/station_monitor/src/views/LogQueryView.vue",
    "/Users/hongyinzhang/project/station_monitor/src/views/FileTransferView.vue",
]

exact_replacements = {
    # Page backgrounds
    "#131318": "var(--gs-bg-default)",
    "#020617": "var(--gs-bg-default)",
    "#0B0B10": "var(--gs-bg-default)",
    "#111213": "var(--gs-bg-default)",
    "#12100f": "var(--gs-bg-default)",
    "#0a0d0a": "var(--gs-bg-default)",
    "#000000": "var(--gs-bg-default)",
    # Panel/card backgrounds
    "#0F172A": "var(--gs-bg-paper)",
    "#1b1b20": "var(--gs-bg-paper)",
    "#1f1f24": "var(--gs-bg-paper)",
    "#2a292f": "var(--gs-bg-paper)",
    "#23262a": "var(--gs-bg-paper)",
    "#181b1e": "var(--gs-bg-paper)",
    "#1a1c1e": "var(--gs-bg-paper)",
    "#171a1d": "var(--gs-bg-paper)",
    "#111411": "var(--gs-bg-paper)",
    "#141400": "var(--gs-bg-paper)",
    "#0a0a00": "var(--gs-bg-paper)",
    "#0e0e13": "var(--gs-bg-paper)",
    "#0f172a": "var(--gs-bg-paper)",
    # Primary text
    "#e4e1e9": "var(--gs-text-primary)",
    "#ffffff": "var(--gs-text-primary)",
    "#ffe8b8": "var(--gs-text-primary)",
    "#e8e8e8": "var(--gs-text-primary)",
    "#e7e0dc": "var(--gs-text-primary)",
    "#d8dcc8": "var(--gs-text-primary)",
    "#f0f0f0": "var(--gs-text-primary)",
    # Secondary text
    "#94a3b8": "var(--gs-text-secondary)",
    "#c2c6d6": "var(--gs-text-secondary)",
    "#cbd5e1": "var(--gs-text-secondary)",
    "#b8a060": "var(--gs-text-secondary)",
    "#8a9a7a": "var(--gs-text-secondary)",
    "#8b949e": "var(--gs-text-secondary)",
    "#a89b93": "var(--gs-text-secondary)",
    "#a4c9ff": "var(--gs-primary-main)",
    "#adc6ff": "var(--gs-primary-main)",
    # Muted text
    "#64748b": "var(--gs-text-disabled)",
    "#5a6470": "var(--gs-text-disabled)",
    "#786830": "var(--gs-text-disabled)",
    "#5a6a4a": "var(--gs-text-disabled)",
    "#5d646c": "var(--gs-text-disabled)",
    "#888888": "var(--gs-text-disabled)",
    "#6f655e": "var(--gs-text-disabled)",
    # Primary accent
    "#60a5fa": "var(--gs-primary-main)",
    "#93c5fd": "var(--gs-primary-main)",
    "#0566d9": "var(--gs-primary-main)",
    "#4f9dff": "var(--gs-primary-main)",
    "#1565c0": "var(--gs-primary-main)",
    "#7f77c3": "var(--gs-primary-main)",
    "#7fb800": "var(--gs-primary-main)",
    "#ffb000": "var(--gs-primary-main)",
    "#ff8f5a": "var(--gs-primary-main)",
    # Success
    "#4ae176": "var(--gs-success-main)",
    "#00a74b": "var(--gs-success-main)",
    "#59d98b": "var(--gs-success-main)",
    "#2e7d32": "var(--gs-success-main)",
    "#4ade80": "var(--gs-success-main)",
    "#00ff88": "var(--gs-success-main)",
    # Error
    "#ffb4ab": "var(--gs-error-main)",
    "#ff8a80": "var(--gs-error-main)",
    "#ff5d6c": "var(--gs-error-main)",
    "#ff4444": "var(--gs-error-main)",
    "#f87171": "var(--gs-error-main)",
    "#d32f2f": "var(--gs-error-main)",
    "#ff3333": "var(--gs-error-main)",
    # Warning
    "#f59e0b": "var(--gs-warning-main)",
    "#ffcc66": "var(--gs-warning-main)",
    "#e6a700": "var(--gs-warning-main)",
    "#ed6c02": "var(--gs-warning-main)",
    "#fbbf24": "var(--gs-warning-main)",
    "#ffcc00": "var(--gs-warning-main)",
    # Info
    "#8f969e": "var(--gs-info-main)",
    "#0288d1": "var(--gs-info-main)",
    # Borders/dividers
    "#1E293B": "var(--gs-border-main)",
    "#383c42": "var(--gs-border-main)",
    "#1e293b": "var(--gs-border-main)",
    # Overlays
    "rgba(255, 255, 255, 0.05)": "var(--gs-overlay-light)",
    "rgba(255, 255, 255, 0.1)": "var(--gs-overlay-medium)",
    "rgba(0, 0, 0, 0.6)": "var(--gs-overlay-dark)",
    # Primary tints
    "rgba(59, 130, 246, 0.1)": "var(--gs-overlay-light)",
    "rgba(96, 165, 250, 0.1)": "var(--gs-overlay-light)",
    "rgba(164, 201, 255, 0.1)": "var(--gs-overlay-light)",
    # Primary tints medium
    "rgba(59, 130, 246, 0.2)": "var(--gs-overlay-medium)",
    "rgba(96, 165, 250, 0.2)": "var(--gs-overlay-medium)",
    "rgba(164, 201, 255, 0.2)": "var(--gs-overlay-medium)",
    # Primary glows
    "rgba(96, 165, 250, 0.3)": "var(--gs-glow-primary)",
    "rgba(164, 201, 255, 0.3)": "var(--gs-glow-primary)",
    "rgba(96, 165, 250, 0.4)": "var(--gs-glow-primary)",
    "rgba(164, 201, 255, 0.4)": "var(--gs-glow-primary)",
    # Success glows
    "rgba(74, 225, 118, 0.3)": "var(--gs-glow-success)",
    "rgba(74, 225, 118, 0.5)": "var(--gs-glow-success)",
    "rgba(74, 225, 118, 0.4)": "var(--gs-glow-success)",
    # Error glows
    "rgba(255, 180, 171, 0.3)": "var(--gs-glow-error)",
    "rgba(255, 180, 171, 0.2)": "var(--gs-glow-error)",
    "rgba(255, 180, 171, 0.4)": "var(--gs-glow-error)",
    # Warning glows
    "rgba(245, 158, 11, 0.3)": "var(--gs-glow-warning)",
    # Specific border rgba patterns
    "rgba(66, 71, 84, 0.1)": "color-mix(in srgb, var(--gs-border-main), transparent 90%)",
    "rgba(66, 71, 84, 0.3)": "color-mix(in srgb, var(--gs-border-main), transparent 70%)",
    "rgba(30, 41, 59, 0.5)": "color-mix(in srgb, var(--gs-border-main), transparent 50%)",
    "rgba(30, 41, 59, 0.2)": "color-mix(in srgb, var(--gs-border-main), transparent 80%)",
    "rgba(255, 255, 255, 0.03)": "var(--gs-overlay-light)",
}

inferred_replacements = {
    "#35343a": "var(--gs-bg-paper)",
    "#00315d": "var(--gs-bg-default)",
    "#003915": "var(--gs-bg-default)",
    "#690005": "var(--gs-bg-default)",
    "#a78bfa": "var(--gs-primary-main)",
    "#c084fc": "var(--gs-primary-main)",
    "#ffdad6": "var(--gs-error-main)",
    "rgba(0, 0, 0, 0.15)": "color-mix(in srgb, var(--gs-overlay-dark), transparent 75%)",
    "rgba(0, 0, 0, 0.2)": "color-mix(in srgb, var(--gs-overlay-dark), transparent 67%)",
    "rgba(100, 116, 139, 0.15)": "color-mix(in srgb, var(--gs-text-disabled), transparent 85%)",
    "rgba(100, 116, 139, 0.2)": "color-mix(in srgb, var(--gs-text-disabled), transparent 80%)",
    "rgba(14, 14, 19, 0.2)": "color-mix(in srgb, var(--gs-bg-paper), transparent 80%)",
    "rgba(14, 14, 19, 0.3)": "color-mix(in srgb, var(--gs-bg-paper), transparent 70%)",
    "rgba(14, 14, 19, 0.5)": "color-mix(in srgb, var(--gs-bg-paper), transparent 50%)",
    "rgba(147, 0, 10, 0.6)": "color-mix(in srgb, var(--gs-error-main), transparent 40%)",
    "rgba(164, 201, 255, 0.1)": "var(--gs-overlay-light)",
    "rgba(168, 85, 247, 0.1)": "var(--gs-overlay-light)",
    "rgba(168, 85, 247, 0.2)": "var(--gs-overlay-medium)",
    "rgba(245, 158, 11, 0.1)": "var(--gs-overlay-light)",
    "rgba(245, 158, 11, 0.15)": "color-mix(in srgb, var(--gs-warning-main), transparent 85%)",
    "rgba(245, 158, 11, 0.2)": "var(--gs-overlay-medium)",
    "rgba(255, 180, 171, 0.05)": "var(--gs-overlay-light)",
    "rgba(255, 180, 171, 0.1)": "var(--gs-overlay-light)",
    "rgba(255, 180, 171, 0.5)": "var(--gs-glow-error)",
    "rgba(255, 180, 171, 0.6)": "color-mix(in srgb, var(--gs-glow-error), transparent 40%)",
    "rgba(255, 255, 255, 0.015)": "var(--gs-overlay-light)",
    "rgba(255, 255, 255, 0.02)": "var(--gs-overlay-light)",
    "rgba(255, 255, 255, 0.2)": "color-mix(in srgb, var(--gs-text-primary), transparent 80%)",
    "rgba(53, 52, 58, 0.5)": "color-mix(in srgb, var(--gs-bg-paper), transparent 50%)",
    "rgba(74, 225, 118, 0.1)": "var(--gs-overlay-light)",
    "rgba(74, 225, 118, 0.2)": "var(--gs-overlay-medium)",
    "rgba(96, 165, 250, 0.05)": "var(--gs-overlay-light)",
    "rgba(96, 165, 250, 0.08)": "var(--gs-overlay-light)",
    "rgba(96, 165, 250, 0.15)": "var(--gs-overlay-light)",
    "rgba(96, 165, 250, 0.5)": "var(--gs-glow-primary)",
    "rgba(96, 165, 250, 0.7)": "color-mix(in srgb, var(--gs-primary-main), transparent 30%)",
}

unmapped_colors = set()


def process_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    style_match = re.search(r"(<style scoped>)(.*?)(</style>)", content, re.DOTALL)
    if not style_match:
        print(f"No <style scoped> found in {filepath}")
        return

    style_start = style_match.start(2)
    style_end = style_match.end(2)
    style_content = style_match.group(2)

    original_style = style_content

    all_replacements = {}
    all_replacements.update(exact_replacements)
    all_replacements.update(inferred_replacements)

    sorted_items = sorted(
        all_replacements.items(), key=lambda x: len(x[0]), reverse=True
    )

    for old, new in sorted_items:
        style_content = style_content.replace(old, new)

    # Find remaining colors
    color_pattern = r"(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))"
    remaining = re.findall(color_pattern, style_content)
    for c in remaining:
        if "var(" in c or c in ["transparent", "inherit", "currentColor"]:
            continue
        unmapped_colors.add(c)

    if style_content != original_style:
        content = content[:style_start] + style_content + content[style_end:]
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated: {os.path.basename(filepath)}")
    else:
        print(f"No changes: {os.path.basename(filepath)}")


for filepath in files:
    process_file(filepath)

if unmapped_colors:
    print("\nUnmapped colors found:")
    for c in sorted(unmapped_colors):
        print(f"  {c}")
else:
    print("\nAll colors mapped successfully.")
