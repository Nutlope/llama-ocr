const { ocr } = require('llama-ocr');

async function transcribeImage() {
    try {
        const markdown = await ocr({
            filePath: './image.png',
            apiKey: 'b203b3563b04134a38ed66ba56f3274b4f6b66610d88c64568fa3d051d4c25d6'
        });

        console.log('Transcription Result:');
        console.log(markdown);
    } catch (error) {
        console.error('Error during transcription:', error);
    }
}

transcribeImage();