# -*- coding: utf-8 -*-
import os

def write_directory_structure(output_file, root_dir, exclude_dirs, exclude_files):
    def get_indent(level):
        return "    " * level + "├── "

    with open(output_file, "w", encoding="utf-8") as f:
        f.write("# 파일 구조\n\n")
        tree = []
        
        for dirpath, dirnames, filenames in os.walk(root_dir):
            dirnames[:] = [d for d in dirnames if d not in exclude_dirs]
            filenames = [f for f in filenames if f not in exclude_files]
            
            indent_level = dirpath.replace(root_dir, "").count(os.sep)
            tree.append(get_indent(indent_level) + os.path.basename(dirpath))
            
            for filename in filenames:
                tree.append(get_indent(indent_level + 1) + filename)
        
        f.write("\n".join(tree) + "\n\n")
        f.write("# 파일 내용\n\n")
        
        for dirpath, dirnames, filenames in os.walk(root_dir):
            dirnames[:] = [d for d in dirnames if d not in exclude_dirs]
            filenames = [f for f in filenames if f not in exclude_files]
            
            if filenames:
                f.write(f"## {dirpath}\n\n")
                for filename in filenames:
                    file_path = os.path.join(dirpath, filename)
                    try:
                        with open(file_path, "r", encoding="utf-8", errors="ignore") as file:
                            content = file.read()
                        f.write(f"### {filename}\n\n")
                        f.write(content + "\n\n")
                    except Exception as e:
                        f.write(f"### {filename}\n\n(파일을 읽을 수 없음: {e})\n\n")

if __name__ == "__main__":
    root_directory = os.getcwd()
    output_filename = "output.txt"
    excluded_dirs = {"log", "node_modules", ".git"}
    excluded_files = {".DS_Store"}
    write_directory_structure(output_filename, root_directory, excluded_dirs, excluded_files)
    print(f"정리 완료! 결과는 {output_filename} 파일을 확인하세요.")