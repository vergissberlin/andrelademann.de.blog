## Language

All blog post content must be written in **British English** — spelling, vocabulary, and punctuation conventions (e.g. "colour", "organise", "whilst", "-ise" suffixes). Do not use American English variants.

## Image Prompts

When generating prompts for blog images:

- **Hero images must be photorealistic.** Use a photo-style prompt: real lighting, real materials, no illustration or render aesthetics. Specify camera framing (e.g. "wide angle", "close-up"), natural or studio lighting, and a concrete scene — never abstract or graphic-design compositions.
- Include technical details that anchor realism: lens type, depth of field, time of day, surface textures.
- Avoid: digital art, flat design, vector illustration, 3D render, cinematic concept art.

Example prompt structure:
```
Photorealistic <subject>, <framing>, <lighting>, <environment detail>, shot on <camera/lens>, high resolution
```

**When a post has no `heroImage` set:** generate a ready-to-use image prompt and include it in your response. Do not leave the post without a visual suggestion. Place the prompt in a fenced code block labelled `image-prompt` so it is easy to copy.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
