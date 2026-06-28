---
author: André Lademann
pubDatetime: 2021-11-18T12:56:56.000Z
title: "The reversed .gitignore"
slug: the-reversed-gitignore
featured: false
draft: false
tags:
  - git
  - version-control
  - versioning
ogImage: "/images/posts/the-reversed-gitignore/hero.jpeg"
description: "The .gitignore is there to prevent files from ending up in git's version management that have no business being there. You can find them in most repositories in the world. Creating these is a tedious and sometimes tricky task. For example, files that..."
canonicalURL: https://blog.andrelademann.de/the-reversed-gitignore
---

The `.gitignore` is there to prevent files from ending up in git's version management that have no business being there. You can find them in most repositories in the world. Creating these is a tedious and sometimes tricky task. For example, files that the operating system creates, files that our various IDEs create, plus language and project specific files and directories. Entries must be made for all of these variations **and so the list gets longer and longer.**

In addition, there may also be security-relevant files such as `.env`, which may contain passwords. Once such a file has been versioned, it could be somewhat difficult to get it out of the version history.

There are several generators on the web to create a `.gitignore` file. There are also prefabricated templates on [GitHub](https://github.com) that you can choose from when creating a repository. There are many files to think about.

**But that doesn't have to be the case!** Instead of excluding all files that you don't like, you can also explicitly specify in the `.gitignore` which files should end up in the version management.

### Pros and cons

✅ Protection against unintentional commit of files of OS, IDE or test files

✅ Improve security (exclude .env files automatically)

❌ On commit, take care that all your files are included

## How to do it the other way around

First we ignore all files

```gitignore
# Ignore all files
/*

```

to then exclude the files that we really want to have versioned. You can specify individual files, but also entire directories.

```gitignore
# Ignore all files
/*

# Except these files
!/app/
!/README.md

```

**Beware!** There is one special thing to note here. All files are really excluded. Including the `.gitignore` file itself. We must therefore also explicitly add it to the list of wanted files.

```gitignore
# Ignore all files
/*

# Except these files
!/app/
!/README.md
!/.gitignore

```

### Ignore files within a subdirectory

That use case is al little bit tricky. Imagine you have a file in the APP directory that you want to ignore, but not the other files it contains. Than you have to do that

```gitignore
# Ignore all files
/*

# Except these files
!/app/
!/README.md
!/.gitignore

# But ignore this file without the allowed path
/app/.env

```

## Conclusion

With the other way around in the `.gitignore` you have full control what's going into the repository. You do not check in files accidentally. **But** if you create files, you may have to think about it more than before if it is not within the ignore path! This change brings some advantages. At the beginning, however, it takes a little getting used to for many people to always remember to expand the file list when they add a new file or directory. This is a principle that can also be used for other software. As for example in the `.dockerignore`.

![Clean up](/images/posts/the-reversed-gitignore/img-1.gif)
