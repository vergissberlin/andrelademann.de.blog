---
author: André Lademann
pubDatetime: 2021-11-14T00:00:00.000Z
title: "child_process vs. worker_threads in JavaScript"
slug: child-process-vs-worker-threads-in-javascript
featured: false
draft: true
tags:
  - javascript
  - nodejs
  - performance
  - benchmarking
description: "A speed benchmark comparing Node.js child_process and worker_threads using the workerpool library and hyperfine."
---

There are many aspects to consider when comparing both types of workers, but in this article I focus on **speed**.

## Little background story

> An allusion to how much rubbish came out of the mouth of the man whose name no longer needs to be mentioned. 🐦

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1627672166816/p0Ina_5uX.png)

## Let's go!

### Dependencies

Create a new project and install [workerpool](https://www.npmjs.com/package/workerpool) — an awesome wrapper that lets you switch between worker types via a single config option: `workerType: 'auto' | 'web' | 'process' | 'thread'`

```bash
mkdir benchmark && cd benchmark
npm init -y
npm install workerpool
```

Create `worker.js` with a deliberately inefficient CPU task:

```javascript
const workerpool = require('workerpool');

// deliberately inefficient fibonacci implementation
function fibonacci(n) {
  if (n < 2) return n;
  return fibonacci(n - 2) + fibonacci(n - 1);
}
```

**Preparation done!** 🎉

### Worker threads

```javascript
// threads.js
const workerpool = require('workerpool');

workerpool.worker({
  fibonacci: fibonacci,
  workerType: 'thread'
});
```

### Child processes

```javascript
// child_processes.js
const workerpool = require('workerpool');

workerpool.worker({
  fibonacci: fibonacci,
  workerType: 'process'
});
```

## Benchmark

Testing on a MacBook Pro (16-inch, 2019), 2.6 GHz 6-Core Intel Core i7.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1627675198589/WDpXF00xH.png)

Using [hyperfine](https://github.com/sharkdp/hyperfine) to run each script 1,000 times:

```bash
hyperfine -r 1000 \
    -n "Child processes" "node child_processes.js" \
    -n "Worker threads"  "node threads.js"
```
