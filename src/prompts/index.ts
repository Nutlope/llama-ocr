export const MARKDOWN_PROMPT = `Convert the provided image into Markdown format. Ensure that all content from the page is included, such as headers, footers, subtexts, images (with alt text if possible), tables, and any other elements.

Requirements:
- Output Only Markdown: Return solely the Markdown content without any additional explanations or comments.
- No Delimiters: Do not use code fences or delimiters like \`\`\`markdown.
- Complete Content: Do not omit any part of the page, including headers, footers, and subtext.
`;

export const JSON_DEFAULT_PROMPT = `Convert the provided image into a structured JSON format. Include all content from the page such as headers, footers, subtexts, tables, and any other elements.

Requirements:
- Complete Content: Do not omit any part of the page, including headers, footers, and subtext.
- No Delimiters: Do not use code fences or delimiters like \`\`\` DO NOT INCLUDE ANY OTHER COMMENT OR EXPLANATIONS JUST OUTPUT THE JSON
- YOUR RESPONSE SHOULD ALWAYS START AND END WITH THE {} OF THE PARSED JSON . DONOT INCLUDE ANY COMMENTS OR EXPLANATIONS IN YOUR RESPONSE JUST THE JSON
- COMPULSORY REQUIREMENT: YOUR RESPONSE SHOULD ONLY BE THE JSON OBJECT REQUESTED. THE RESPONSE SHOULD BE DIRECTLY PARSEABLE INTO JSON USING JSON.PARSE()
`;

export const JSON_STRUCTURED_PROMPT = (structure: Record<string, any>) => `
Convert the provided image into JSON format matching exactly the following structure:

${JSON.stringify(structure, null, 2)}

Requirements:
- Must match the provided structure exactly
- All fields must be present
- No additional fields allowed
- No Delimiters: Do not use code fences or delimiters like \`\`\` . DO NOT INCLUDE ANY OTHER COMMENT OR EXPLANATIONS JUST OUTPUT THE JSON
- COMPULSORY REQUIREMENT: YOUR RESPONSE SHOULD ONLY BE THE JSON OBJECT REQUESTED. THE RESPONSE SHOULD BE DIRECTLY PARSEABLE INTO JSON USING JSON.PARSE()
`;