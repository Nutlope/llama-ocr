<div align="center">
  <div>
    <h1 align="center">Llama OCR</h1>
  </div>
 	<p>An npm library to run OCR with vision models from Together AI.</p>

<a href="https://www.npmjs.com/package/llama-ocr"><img src="https://img.shields.io/npm/v/llama-ocr" alt="Current version"></a>

</div>

---

## Installation

`npm i llama-ocr`

## Usage

```js
import { ocr } from "llama-ocr";

const markdown = await ocr({
  filePath: "./trader-joes-receipt.jpg", // path to your image (soon PDF!)
  apiKey: process.env.TOGETHER_API_KEY, // Together AI API key
});
```

## Hosted Demo

We have a hosted demo at [LlamaOCR.com](https://llamaocr.com/) where you can try it out!

## How it works

This library uses vision models from [Together AI](https://togetherai.link/) to parse images and return markdown. The free model is Apriel-1.5-15b-Thinker, and paid models like Llama 4 Scout (default), Llama 4 Maverick, and NIM versions of Llama 3.2 Vision are available for faster performance and higher rate limits.

You can control this with the `model` option which is set to `meta-llama/Llama-4-Scout-17B-16E-Instruct` by default but can also accept `free` or other model IDs.

## Roadmap

- [x] Add support for local images OCR
- [x] Add support for remote images OCR
- [ ] Add support for single page PDFs
- [ ] Add support for multi-page PDFs OCR (take screenshots of PDF & feed to vision model)
- [ ] Add support for JSON output in addition to markdown

## Credit

This project was inspired by [Zerox](https://github.com/getomni-ai/zerox). Go check them out!
