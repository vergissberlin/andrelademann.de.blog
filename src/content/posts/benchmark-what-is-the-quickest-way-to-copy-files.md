---
author: André Lademann
pubDatetime: 2022-05-02T22:02:36.000Z
title: "Benchmark - What is the quickest way to copy files?"
slug: benchmark-what-is-the-quickest-way-to-copy-files
featured: false
draft: false
tags:
  - benchmark
  - files
ogImage: "/images/posts/benchmark-what-is-the-quickest-way-to-copy-files/hero.jpg"
description: "Purpose In software development, there is sometimes a need to copy a large amount of file from one directory to another. For instance, when you have shared volumes in a Docker environment with different services, some services need to have access to ..."
canonicalURL: https://blog.andrelademann.de/benchmark-what-is-the-quickest-way-to-copy-files
---

## Purpose

In software development, there is sometimes a need to copy a large amount of file from one directory to another. For instance, when you have shared volumes in a [Docker](https://docker.com/) environment with different services, some services need to have access to the application source files, you put the source code in a volume which is shared between these services. On an initial boot up, or on an update of the app image, there is a need to update the files in the volume.

### Test arrangement

For our testing scenario, we try to use a common use case. It is an application image with 140195 files. I used an installed Magento 2 within its all its dependencies.

As a benchmark tool for the CLI, I used [hyperfine](https://github.com/sharkdp/hyperfine) on macOS.

### Test use cases

1.  On an initial boot up, the target directory is empty. We have to copy all files from one directory to another.
2.  The second use case to just update files where is a change.

## CP

[CP](http://manpages.ubuntu.com/manpages/cosmic/man1/cp.1.html) is a very basic functionality in Linux based shells. It’s made to copy files. It is possible to copy recursively. It keeps the directory structure. The target directory should be empty. Perfect! Let’s get do it!

parameter

description

\-R, -r, --recursive

copy directories recursively

\-u, --update

copy only when the SOURCE file is newer than the destination file or when the destination file is missing

\-p, --preserve\[=ATTR\_LIST\]

preserve the specified attributes (default: mode, ownership, timestamps), if possible additional attributes: context, links, xattr, all

### Test with `cp`

```
hyperfine \
    'cp -upr --sparse=never src tmp-cp' \
    'cp -upr --sparse=never src tmp-cp'

```

It copies file by file from source to target without checking if there are any changes in it.

```
hyperfine 'cp -upr --sparse=never src tmp-cp' 'cp -upr --sparse=never src tmp-cp'
Benchmark #1: cp -upr --sparse=never src tmp-cp
  Time (mean ± σ):     11.744 s ± 32.450 s    [User: 775.2 ms, System: 2396.0 ms]
  Range (min … max):    1.284 s … 104.094 s

Benchmark #2: cp -upr --sparse=never src tmp-cp
  Time (mean ± σ):      1.397 s ±  0.086 s    [User: 326.0 ms, System: 1033.2 ms]
  Range (min … max):    1.308 s …  1.511 s

```

## rsync

[Rsync](http://manpages.ubuntu.com/manpages/cosmic/man1/rsync.1.html) copies files either to or from a remote host, or locally on the current host as like CP. It tries to improve the speed by using an index file. Rsync finds files that need to be transferred using a "quick check" algorithm that looks for files that have changed in size or in last-modified time. Any changes in the other preserved attributes (as requested by options) are made on the destination file directly when the quick check indicates that the file’s data does not need to be updated.

So we assume that there is no improvement on the first copy, but on updating files.

parameter

description

\-u, --update

skip files that are newer on the receiver

\-p, --perms

preserve permissions

\--del, --delete

delete extraneous files from dest dirs

\--force

force deletion of dirs even if not empty

\--size-only

skip files that match in size

\-r, --recursive

recurse into directories

\-q, --quiet

suppress non-error messages

\-z, --compress

compress file data during the transfer

### Test with rsync

```
hyperfine \
    'rsync -a src tmp-rsync' \
    'rsync -a src tmp-rsync'

Benchmark #1: rsync -a src tmp-rsync
  Time (mean ± σ):      7.710 s ± 19.948 s    [User: 1.330 s, System: 2.346 s]
  Range (min … max):    1.254 s … 64.481 s

Benchmark #2: rsync -a src tmp-rsync
  Time (mean ± σ):      1.424 s ±  0.147 s    [User: 543.1 ms, System: 837.6 ms]
  Range (min … max):    1.281 s …  1.779 s

```

## Tar

[tar](http://manpages.ubuntu.com/manpages/cosmic/man1/tar.1.html) creates and manipulates streaming archive files.

Parameter

Description

\-f file

Read the archive from or write the archive to the specified file.

\-q (--fast-read)

Extract, or list only the first archive entry that matches each pattern or filename operand. Exit as soon as each specified pattern or filename has been matched. By default, the archive is always read to the very end, since there can be multiple entries with the same name and, by convention, later entries overwrite earlier entries. This option is provided as a performance optimization.

\-x

Extract to disk from the archive. If a file with the same name appears more than once in the archive, each copy will be extracted, with later copies overwriting (replacing) earlier copies.

\-C, --directory=DIR

Change to DIR before performing any operations. This option is order-sensitive, i.e. it affects all options that follow.

### Test with tar

```
hyperfine 'tar -qxf src.tar -C tmp-tar' 'tar -qxf src.tar -C tmp-tar'
Benchmark #1: tar -xf src.tar
  Time (mean ± σ):     53.214 s ±  4.403 s    [User: 3.303 s, System: 12.450 s]
  Range (min … max):   50.510 s … 65.249 s
Benchmark #1: tar -xf src.tar -C tmp-tar
  Time (mean ± σ):     54.455 s ±  0.434 s    [User: 3.551 s, System: 12.724 s]
  Range (min … max):   54.006 s … 55.305 s

```

---

## Consumption

![image.png](/images/posts/benchmark-what-is-the-quickest-way-to-copy-files/img-1.png)

These tests have shown that _CP_ is slightly faster than _RSYNC_ when updating. However, **CP takes significantly more time to initially copy the files**. TAR is faster on the first copy as CP, but it has no advantages over RSYNC.
