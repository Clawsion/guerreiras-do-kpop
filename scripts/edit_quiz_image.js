const ZAI = require('/home/z/my-project/node_modules/z-ai-web-dev-sdk').default;
const fs = require('fs');

(async () => {
  try {
    const zai = await ZAI.create();
    const buf = fs.readFileSync('/home/z/my-project/public/real-zoe-input.png');
    const b64 = buf.toString('base64');
    const dataUrl = `data:image/png;base64,${b64}`;
    console.log('Image size:', buf.length, 'bytes');
    const resp = await zai.images.generations.edit({
      prompt: 'Remove the text watermark with the name ZOEY from this portrait. Keep everything else identical - same character, pose, lighting, colors.',
      images: [{ url: dataUrl }],
      size: '768x1344'
    });
    if (resp.data && resp.data[0] && resp.data[0].base64) {
      fs.writeFileSync('/home/z/my-project/public/real-zoe-clean.png', Buffer.from(resp.data[0].base64, 'base64'));
      console.log('SAVED: real-zoe-clean.png');
    } else {
      console.log('Unexpected response:', JSON.stringify(resp).substring(0, 800));
    }
  } catch (e) {
    console.error('ERR:', e.message);
  }
})();
