# Perf fixes: preconnect cleanup + llms.txt format
p = 'index.html'
s = open(p, encoding='utf-8').read()

old_block = '''    <!-- AD DELIVERY: preconnect so Monetag/Adsterra load faster (better viewability) -->
    <link rel="preconnect" href="https://quge5.com" crossorigin>
    <link rel="preconnect" href="https://nap5k.com" crossorigin>
    <link rel="preconnect" href="https://n6wxm.com" crossorigin>
    <link rel="preconnect" href="https://www.highperformanceformat.com" crossorigin>
    <link rel="preconnect" href="https://omg10.com" crossorigin>
    <link rel="dns-prefetch" href="https://6opo.com">
    <link rel="dns-prefetch" href="https://auqot.com">
    <link rel="dns-prefetch" href="https://ekhay.com">
    <link rel="dns-prefetch" href="https://b3mny.com">
    <link rel="dns-prefetch" href="https://094kk.com">
    <link rel="dns-prefetch" href="https://jmosl.com">'''
new_block = '''    <!-- AD DELIVERY: preconnect (sirf 4 sabse important — Lighthouse guideline) -->
    <link rel="preconnect" href="https://quge5.com" crossorigin>
    <link rel="preconnect" href="https://nap5k.com" crossorigin>
    <link rel="preconnect" href="https://n6wxm.com" crossorigin>
    <link rel="preconnect" href="https://www.highperformanceformat.com" crossorigin>
    <link rel="dns-prefetch" href="https://omg10.com">
    <link rel="dns-prefetch" href="https://6opo.com">
    <link rel="dns-prefetch" href="https://auqot.com">
    <link rel="dns-prefetch" href="https://ekhay.com">
    <link rel="dns-prefetch" href="https://b3mny.com">
    <link rel="dns-prefetch" href="https://094kk.com">
    <link rel="dns-prefetch" href="https://jmosl.com">'''
assert old_block in s, "preconnect block not found"
s = s.replace(old_block, new_block, 1)
open(p, 'w', encoding='utf-8').write(s)
print("Preconnect: 8 -> 4 OK")

# llms.txt: H1 + markdown links
p = 'public/llms.txt'
s = open(p, encoding='utf-8').read()
if not s.startswith('# '):
    s = '# AI World Hub\n\n' + s
if '[' not in s:
    import re
    s = re.sub(r'URL: (https://[^\s]+)', r'[\1](\1)', s)
open(p, 'w', encoding='utf-8').write(s)
print("llms.txt: H1 + markdown links OK")
