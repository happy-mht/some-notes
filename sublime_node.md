### sublime 配置js开发环境
1. 安装node
2. 配置sublime text3 
    1. 选择Tools -> Bulid System -> New Build System ...
    2. 将文件名保存为node.Sublime-build
        内容修改为
        ```json
        {
            "cmd": ["node","$file"]
        }
        ```
    3. 选择Preferences -> Settings, 在Preferences.sublime-settings - User配置文件里，加入：
        ```
        "build_env":{
            "PATH" : "C:/Program Files/nodejs"
          }
        ```
        PATH的值是nodejs的安装路径。
    4. 保存
3. 测试
    新建一个文件，随便写一段JavaScript代码，按快捷键：`Ctrl +B`即可看到运行结果