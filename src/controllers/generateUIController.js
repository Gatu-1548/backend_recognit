const generateUIService = require('../services/generateUIService');

const generateUI = async (req, res) => {
  try {
    const { mode } = req.body;

    if (mode === 'prompt') {
      const prompt = req.body.data;
      if (!prompt) return res.status(400).json({ error: 'No prompt provided' });
      const result = await generateUIService.processPrompt(prompt);
      return res.json({ code: result });

    } else if (mode === 'image') {
      if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
      const result = await generateUIService.processImage(req.file.buffer);
      return res.json({ code: result });

    } else if (mode === 'figma') {
      let figmaJson;
      try {
        figmaJson = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data;
      } catch (error) {
        return res.status(400).json({ error: 'Invalid JSON for figma data' });
      }
      const result = await generateUIService.processFigma(figmaJson);
      return res.json({ code: result });

    } else {
      return res.status(400).json({ error: 'Invalid mode' });
    }
  } catch (error) {
    console.error('generateUIController error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { generateUI };