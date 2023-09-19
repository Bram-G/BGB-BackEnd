const router = require('express').Router();
const apiRoutes = require('./api');

require('dotenv').config();


const {OpenAI} = require("openai");


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,

});

router.post("/chat", async (req, res) => {
  // console.log(req.body.json);
  const {prompt, gameTitle, gamePublisher} = req.body.infoNugget;

  console.log(prompt);
  console.log(gameTitle);
  console.log(gamePublisher);
  
  const completion = await openai.chat.completions.create({
    model:"gpt-3.5-turbo",
    max_tokens:500,
    temperature:0,
    messages: [
      {"role": "system", "content": `You are a helpful assistant that answers questions about the rules of ${gameTitle} the board game, made by ${gamePublisher} in an easy to understand and fun way.`},
      {"role": "user", "content": prompt},
    ],

  });
console.log(completion);
  res.send(completion.choices[0].message.content);

})

router.use('/api', apiRoutes);

router.use((req, res) => {
  return res.send('Wrong route!');
});

module.exports = router;