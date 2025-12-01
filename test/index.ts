import { describe, it, expect } from 'vitest';
import { ocr } from '../src/index';

describe('Remote image URL', () => {
  it('should perform OCR on remote image', async () => {
    const markdown = await ocr({
      filePath: "https://i.ibb.co/6cjLQ6yp/Receipt-Swiss.jpg",
      apiKey: process.env.TOGETHER_API_KEY,
    });
    expect(markdown).toBeTruthy();
    expect(typeof markdown).toBe('string');
  });
});

describe('Local file path', () => {
  it('should perform OCR on local file', async () => {
    const markdown = await ocr({
      filePath: "./test/trader-joes-receipt.jpg",
      apiKey: process.env.TOGETHER_API_KEY,
    });
    expect(markdown).toBeTruthy();
    expect(typeof markdown).toBe('string');
  });
});
