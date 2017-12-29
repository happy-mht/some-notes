https://git-scm.com/book/zh/v1/Git-%E5%88%86%E6%94%AF-%E5%88%86%E6%94%AF%E7%9A%84%E7%AE%A1%E7%90%86 官方文档
http://www.ruanyifeng.com/blog/2014/06/git_remote.html

git remote add origin https://git.leqee.com/OMS_V2/oms-web.git
克隆版本库的时候，所使用的远程主机自动被Git命名为origin
git remote add <主机名> <网址>添加远程主机
$ git checkout -b newBrach origin/master
上面命令表示，在origin/master的基础上，创建一个新分支。
git常用命令
http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html

git diff 比较不同
git checkout -b q2_pre origin/q2_pre 切分支
git status 列出所有的changes
git add src/  # 添加指定目录到暂存区，包括子目录

提交暂存区到仓库区 $ git commit -m [message]
git commit -m 'gift' 后面的'git'是备注

取回远程仓库的变化，并与本地分支合并 $ git pull [remote] [branch] # 上传本地指定分支到远程仓库 $ git push [remote] [branch]

git pull命令的作用是，取回远程主机某个分支的更新，再与本地的指定分支合并。
git pull <远程主机名> <远程分支名>:<本地分支名>

git pull origin q2_pre
取回远程origin/q2_pre 分支，与本地当前分支合并
相当于
git fetch origin
git merge origin/q2_pre
git push命令用于将本地分支的更新，推送到远程主机
git push <远程主机名> <本地分支名>:<远程分支名>
git push origin q2_pre
注意，分支推送顺序的写法是<来源地>:<目的地>

git使用详解
https://www.cnblogs.com/joshua317/articles/4606328.html

可以使用git difftool命令来比较文件差异
$ git commit --amend 可以修改提交的备注信息
$ git checkout -- mytext.txt 可以撤销之前所做的修改（注意--前后都有空格，或者不加也行）
这个会撤销add之前的更改。add之后的修改可以用git checkout head -- fileName来撤销

$ git status -s/short 显示简要信息
`$ git stash--> $ git stash list -->$ git stash pop`以暂存本地的修改不提交，然后恢复修改提交

https://blog.zengrong.net/post/1746.html 
//push 新分支命令
git push -u 远端仓库名称 远端仓库分支名称
git push -u origin mht

删除远程分支
git push [远程名] [本地分支]:[远程分支] 语法，如果省略 [本地分支]，那就等于是在说“在这里提取空白然后把它变成[远程分支]”。

rm file-->git checkout file可以恢复删除的文件。
git branch mht origin/origin
git branch mht origin 报错：
warning: refname 'origin' is ambiguous. fatal: Ambiguous object name: 'origin'.

对分支的理解 https://segmentfault.com/q/1010000002491888
1.创建了分支之后，再 git add . 就添加了，然后git commit -m ""就提交到了当前的分支？

创建新分支不代表切换到分支， git branch new_branch只是从当前分支的当前状态创建一个新的分支，但是此时直接修改并commit 还是在当前分支上的， 只有git checkout new_branch 才会切换到新建的分支

git checkout -b new_branch 等效于上面两条命令之和

2.如果运行了 git checkout new，那么是不是会从远程下载new分支到本地，直接自动合并？

只有push/pull/fetch是跟远端交互的，commit/checkout之类的都是纯本地操作
checkout只是从当前使用的分支切换到本地另外一个分支，换句话说就是把当前工作空间的所有文件内容变为另一个分支的状态

"从远程下载new分支到本地，直接自动合并" 是在new分支上git pull 的效果

