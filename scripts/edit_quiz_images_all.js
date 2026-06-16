const ZAI = require('/home/z/my-project/node_modules/z-ai-web-dev-sdk').default;
const fs = require('fs');

const PUBLIC = '/home/z/my-project/public';

const TASKS = [
  {
    input: `${PUBLIC}/real-zoe-input.png`,
    output: `${PUBLIC}/real-zoe-clean.png`,
    prompt: 'Remove any visible text watermark, label or character name overlaid on this portrait (e.g. "ZOEY" or "Zoe" or "Zoey"). Keep the character, pose, lighting, hair, clothes and composition EXACTLY identical. Output a clean portrait with no watermark, no logo, no text whatsoever.'
  },
  {
    input: `${PUBLIC}/real-rumi-input.png`,
    output: `${PUBLIC}/real-rumi-clean.png`,
    prompt: 'Remove any visible text watermark, label or character name overlaid on this portrait (e.g. "RUMI" or "Rumi"). Keep the character, pose, lighting, hair, clothes and composition EXACTLY identical. Output a clean portrait with no watermark, no logo, no text whatsoever.'
  },
  {
    input: `${PUBLIC}/real-mirae-input.png`,
    output: `${PUBLIC}/real-mirae-clean.png`,
    prompt: 'Remove any visible text watermark, label or character name overlaid on this portrait (e.g. "MIRAE" or "Mira" or "Mirae"). Keep the character, pose, lighting, hair, clothes and composition EXACTLY identical. Output a clean portrait with no watermark, no logo, no text whatsoever.'
  }
];

(async () => {
  const zai = await ZAI.create();
  for (const t of TASKS) {
    try {
      console.log(`Processing ${t.input}...`);
      const buf = fs.readFileSync(t.input);
      const dataUrl = `data:image/png;base64,${buf.toString('base64')}`;
      const resp = await zai.images.generations.edit({
        prompt: t.prompt,
        images: [{ url: dataUrl }],
        size: '768x1344'
      });
      if (resp.data && resp.data[0] && resp.data[0].base64) {
        fs.writeFileSync(t.output, Buffer.from(resp.data[0].base64, 'base64'));
        console.log(`  OK -> ${t.output} (${fs.statSync(t.output).size} bytes)`);
      } else {
        console.log(`  FAIL: unexpected response for ${t.input}`);
      }
    } catch (e) {
      console.error(`  ERR on ${t.input}: ${e.message}`);
    }
  }
  console.log('All done.');
})();
