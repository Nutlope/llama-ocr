<div align="center">
  <div>
    <h1 align="center">Llama OCR</h1>
  </div>
	<p>An npm library to run OCR for free with Llama 3.2 Vision.</p>

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
## Docker Installation Usage and Test

### **Build the Docker Image**
1. **Run the Code below:**
   ```bash
   docker build -t llama-ocr .
   ```

### **Run the Application Container**
2. **Start the container with the API key passed as an environment variable:**
   ```bash
   docker run -e TOGETHER_API_KEY=your_actual_key llama-ocr
   ```
   Replace `your_actual_key` with your actual API key for Together AI.

3. **Test with a Mounted Volume (if needed):**
   If your application requires files (e.g., images) from your local system, you can mount a volume to provide access:
   ```bash
   docker run -e TOGETHER_API_KEY=your_actual_key -v $(pwd)/test:/usr/src/app/test llama-ocr
   ```
   This mounts the `test` directory in your project to the container's `/usr/src/app/test` directory.

---

### **Verify the Application**
The `ocr` function in your `src/index.ts` is the entry point. To verify it works, you need to invoke the `ocr` function. If the application doesn't expose a web server or a CLI by default, you can test it directly by running the `test/index.js` script.

#### **Run the Test Script**
1. Ensure the container runs the test script:
   ```bash
   docker run -e TOGETHER_API_KEY=your_actual_key llama-ocr npm run test
   ```

2. If the script is set up correctly, you should see the Markdown output for the test image:
   ```plaintext
   # Example Receipt
   - Item 1: $5.00
   - Item 2: $10.00
   Total: $15.00
   ```

---

### **Access the Container for Manual Testing**
If you need to debug or manually test the app inside the container:
1. Start an interactive shell in the container:
   ```bash
   docker run -it -e TOGETHER_API_KEY=your_actual_key llama-ocr bash
   ```

2. Inside the container, you can run the test script or invoke the `ocr` function:
   ```bash
   npm run test
   ```

---

### **Testing via Source Code**
If you want to test locally before deploying the Docker container:
1. Run the `ocr` function directly from `test/index.js`:
   ```bash
   node test/index.js
   ```

   Ensure your `.env` file is set up with the API key or export the variable:
   ```bash
   export TOGETHER_API_KEY=your_actual_key
   ```

2. Expected output: The Markdown representation of the test image or file.

---

### **Additional Notes**
- Ensure the `TOGETHER_API_KEY` is valid.
- Use a test image like `trader-joes-receipt.jpg` provided in the `test` directory or update the script to use a different image.
- If errors occur, inspect the logs or debug by interacting with the container (`docker exec -it <container_id> bash`).


## Hosted Demo

We have a hosted demo at [LlamaOCR.com](https://llamaocr.com/) where you can try it out!

## How it works

This library uses the free Llama 3.2 endpoint from [Together AI](https://togetherai.link/) to parse images and return markdown. Paid endpoints for Llama 3.2 11B and Llama 3.2 90B are also available for faster performance and higher rate limits.

You can control this with the `model` option which is set to `Llama-3.2-90B-Vision` by default but can also accept `free` or `Llama-3.2-11B-Vision`.

## Roadmap

- [x] Add support for local images OCR
- [x] Add support for remote images OCR
- [ ] Add support for single page PDFs
- [ ] Add support for multi-page PDFs OCR (take screenshots of PDF & feed to vision model)
- [ ] Add support for JSON output in addition to markdown

## Credit

This project was inspired by [Zerox](https://github.com/getomni-ai/zerox). Go check them out!
