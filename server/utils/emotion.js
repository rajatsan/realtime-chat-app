const WATSON_AUTH = process.env.WATSON_AUTH;
const r2 = require("r2");

module.exports = async function getEmotion(message) {
  const response = await r2(
    `https://gateway-lon.watsonplatform.net/tone-analyzer/api/v3/tone?version=2017-09-21&text=${encodeURIComponent(message)}`,
    {
      headers: {
        Authorization: 'Basic ' + WATSON_AUTH
      }
    }
  ).json;

  const tones = response.document_tone.tones;
  console.log('tones', tones);
  try {
    if (tones.length > 0) {
      tones.sort((p,q) => -1*(p.score - q.score)); // sort tones to get tone with highest score
      const emotion = tones[0].tone_name;

      if (['Anger', 'Fear', 'Sadness'].indexOf(emotion) > -1) return 'negative';

      else if (['Joy', 'Confident'].indexOf(emotion) > -1) return 'positive';

      else return 'neutral';
    }
  } catch (e) {
    return 'neutral';
  }
}