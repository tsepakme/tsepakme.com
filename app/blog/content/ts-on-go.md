---
title: "TypeScript on Go: A New Era for the Language"
description: "Microsoft has announced the migration of TypeScript to Go. Let's explore what this means for developers."
date: "2025-03-12"
tags: ["typescript", "go"]
published: true
---

On March 11, it was [announced](https://devblogs.microsoft.com/typescript/typescript-native-port/) that TS is being rewritten in Go. The plan is to have a fully functional version with support for all features by the end of 2025.

## Performance Improvements

The news can't be anything but good. I think anyone who has worked on a 400k+ line code base knows that type checking may not work as fast as we would like. 

And if it is, it is not that critical to the build process, because you usually use babel or esbuild, which ignore types. And type checking is done in parallel or as a separate task. For performance in the editor, even 1-2 seconds can be very important.  

Currently, benchmarks already show a 10x performance improvement. Of course, not all chips are supported yet, and in the future these numbers might change a bit. But the difference is definitely noticeable.

## Additional Resources

Here is a [link](https://www.youtube.com/watch?v=10qowKUW82U&ab_channel=MichiganTypeScript) where TS lead and architect Anders Hejlsberg talks about porting TS to Go

Source [Code](https://github.com/microsoft/typescript-go)