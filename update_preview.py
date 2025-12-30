import re

file_path = r'c:\Users\Work\hatch\components\LivePreview.tsx'
temp_file_path = r'c:\Users\Work\hatch\temp_runner_html.txt'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

with open(temp_file_path, 'r', encoding='utf-8') as f:
    new_code = f.read()

# Regex to find the useMemo block
# Starts with const srcDoc = useMemo(() => {
# Ends with }, [code, pages, currentPageId])
pattern = r'const srcDoc = useMemo\(\(\) => \{.*?\n\s*return html\s*\}, \[code, pages, currentPageId\]\)'

match = re.search(pattern, content, re.DOTALL)

if match:
    print("Found the block!")
    new_content = content[:match.start()] + new_code + content[match.end():]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully replaced the block.")
else:
    print("Could not find the block.")
    # Print a snippet of where we expect it to be
    start_idx = content.find('const srcDoc = useMemo')
    if start_idx != -1:
        print(f"Found start at {start_idx}")
        print(content[start_idx:start_idx+100])
        # Check the end
        end_idx = content.find('}, [code, pages, currentPageId])', start_idx)
        if end_idx != -1:
            print(f"Found end at {end_idx}")
            print(content[end_idx-50:end_idx+50])
        else:
            print("Could not find end marker.")
    else:
        print("Could not find start marker.")
