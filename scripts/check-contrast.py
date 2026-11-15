#!/usr/bin/env python3
"""Vérifie les contrastes WCAG des jetons de couleur, thème par thème.

Usage : python3 scripts/check-contrast.py
Sortie : tableau lisible + code retour 1 si une paire échoue en AA.
"""
import re
import sys
from pathlib import Path

TOKENS = Path(__file__).resolve().parent.parent / "src/styles/tokens.css"


def parse_hex(value: str):
    value = value.strip().lstrip("#")
    if len(value) == 3:
        value = "".join(c * 2 for c in value)
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def parse_rgba(value: str):
    nums = [float(x) for x in re.findall(r"[\d.]+", value)]
    r, g, b = nums[0], nums[1], nums[2]
    a = nums[3] if len(nums) > 3 else 1.0
    return (r, g, b), a


def token_map(block: str):
    out = {}
    for key, val in re.findall(r"--([\w-]+):\s*([^;]+);", block):
        out[key] = val.strip()
    return out


def to_rgb(value: str):
    if value.startswith("#"):
        rgb = parse_hex(value)
        return rgb, 1.0
    if value.startswith("rgba") or value.startswith("rgb"):
        return parse_rgba(value)
    raise ValueError(f"couleur non gérée : {value}")


def over(fg, bg):
    """Compose une couleur semi-transparente sur un fond opaque."""
    (fr, fg_, fb), a = fg
    br, bg_, bb = bg
    return (
        fr * a + br * (1 - a),
        fg_ * a + bg_ * (1 - a),
        fb * a + bb * (1 - a),
    )


def luminance(rgb):
    def chan(c):
        c = c / 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

    r, g, b = (chan(x) for x in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def resolve_bg(value, toks, depth=0):
    """Un fond translucide se compose sur le fond de page, pas sur du blanc."""
    rgb, alpha = to_rgb(value)
    if alpha >= 1:
        return rgb
    base = to_rgb(toks.get("bg", "#ffffff"))[0]
    if depth > 2:
        return over((rgb, alpha), base)
    return over((rgb, alpha), base)


def ratio(fg, bg, toks=None):
    (a, alpha) = to_rgb(fg)
    bg_rgb = resolve_bg(bg, toks or {})
    if alpha < 1:
        a = over((a, alpha), bg_rgb)
    l1, l2 = luminance(a), luminance(bg_rgb)
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)


PAIRS = [
    ("ink", "bg", 4.5, "Texte principal"),
    ("ink-soft", "bg", 4.5, "Texte secondaire"),
    ("ink-mute", "bg", 4.5, "Métadonnées / labels"),
    ("accent", "bg", 4.5, "Liens et sur-titres"),
    ("accent-2", "bg", 4.5, "Accent secondaire (badge)"),
    ("ok", "bg", 4.5, "Statut disponible"),
    ("error", "bg", 4.5, "Message d'erreur"),
    ("ink", "bg-elev", 4.5, "Texte sur surface élevée"),
    ("ink-soft", "bg-soft", 4.5, "Texte secondaire sur surface douce"),
    ("btn-ink", "btn-to", 4.5, "Libellé du bouton principal"),
    ("skip-ink", "skip-bg", 4.5, "Lien d'évitement"),
    ("placeholder", "input-bg", 4.5, "Placeholder de formulaire"),
    ("ink-mute", "bg-elev", 4.5, "Labels sur carte"),
]


def main():
    css = TOKENS.read_text(encoding="utf-8")
    dark_block = re.search(r":root \{(.*?)\n\}", css, re.S).group(1)
    light_block = re.search(r":root\[data-theme='light'\] \{(.*?)\n\}", css, re.S).group(1)
    themes = {"sombre": token_map(dark_block), "clair": token_map(light_block)}

    failures = 0
    for theme, toks in themes.items():
        print(f"\n=== Thème {theme} ===")
        for fg_key, bg_key, minimum, label in PAIRS:
            try:
                r = ratio(toks[fg_key], toks[bg_key], toks)
            except KeyError as exc:
                print(f"  ✗ jeton manquant : {exc}")
                failures += 1
                continue
            verdict = "OK " if r >= minimum else "ÉCHEC"
            if r < minimum:
                failures += 1
            print(f"  {verdict} {r:5.2f}:1 (min {minimum})  {label}  [{fg_key} sur {bg_key}]")

    print()
    if failures:
        print(f"{failures} paire(s) sous le seuil AA.")
        return 1
    print("Toutes les paires respectent au moins WCAG AA (4.5:1).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
