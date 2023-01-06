//create a Discord Bot using OpenAi API that interacts on the Discord Server
require('dotenv').config();

//Prepare to connect to the Discord API
const { Client, GatewayIntentBits, RoleSelectMenuInteraction } = require('discord.js');
const client = new Client ({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]})

// //Prepare connection to OpenAI API

const { Configuration , OpenAIApi} = require('openai');
const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_KEY,
})

const openai = new OpenAIApi(configuration);

//Check for when a message on discord is sent
client.on('messageCreate', async function(message){
    try {
        //Don't response to yourself or other bots
        if(message.author.bot) return;
        const gptResponse = await openai.createCompletion({
            model: "davinci",
            prompt: `ChatGPT is a friendly chatbot.\n\ ChatGPT: Hello, how are you? \n\ ${message.author.username}: ${message.content}  \n\ ChatGPT:` ,
            temperature: 0.9,
            max_token: 100,
            stop: ["ChatGPT:", "Shujun:"],
        })
        message.reply( `${gptResponse.data.choices[0].text}`);
        return;
    } catch (error) {
        console.log(error)
    }
})

//Log the bot into Discord
client.login(process.env.DISCORD_TOKEN);
console.log("ChatGPT Bot is Online on Discord")