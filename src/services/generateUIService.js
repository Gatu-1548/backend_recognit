const fs = require('fs');
const path = require('path');
const os = require('os');
const { GoogleGenAI, createUserContent, createPartFromUri } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const processPrompt = async (promptText) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash', // o gemini-2.0-flash
    contents: promptText,
  });
  return response.text;
};

const processImage = async (imageBuffer) => {
  // 1. Crear archivo temporal
  const tempPath = path.join(os.tmpdir(), `upload-${Date.now()}.png`);
  fs.writeFileSync(tempPath, imageBuffer);

  try {
    // 2. Subir imagen a Gemini
    const image = await ai.files.upload({
      file: tempPath,
    });

    // 3. Enviar prompt + imagen al modelo
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        createUserContent([
          "Genera una estructura de UI tipo JSON para esta imagen",
          createPartFromUri(image.uri, image.mimeType),
        ]),
      ],
    });

    return response.text;
  } catch (err) {
    console.error("Error en processImage:", err);
    throw err;
  } finally {
    // 4. Eliminar imagen temporal
    fs.unlinkSync(tempPath);
  }
};

const processFigma = async (figmaJson) => {
  const figmaText = JSON.stringify(figmaJson);
  return processPrompt(`Genera código Flutter para esta estructura UI: ${figmaText}`);
};

module.exports = {
  processPrompt,
  processImage,
  processFigma,
};