require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { OpenAI } = require("openai");

const BOT_TOKEN = process.env.BOT_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GENERAL_CHANNEL_ID = process.env.GENERAL_CHANNEL_ID;
const MAYBE_ISSUE_CHANNEL_ID = process.env.MAYBE_ISSUE_CHANNEL_ID;

const CONFIDENCE_THRESHOLD = 50;
const WORD_COUNT_THRESHOLD = 100; // Triggers after 100 words
const FETCH_LIMIT = 100;
const RATE_LIMIT_DELAY = 1000;
const DISCORD_MAX_MESSAGE_LENGTH = 2000;
const SUMMARY_MAX_LENGTH = 1500;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

let allMessagesBuffer = []; // Stores all messages from the entire history
let totalMessagesFetched = 0;

// **Fetch all messages first, THEN process them**
async function fetchAllMessages() {
  try {
    const channel = await client.channels.fetch(GENERAL_CHANNEL_ID);
    let lastMessageId = null;
    let reachedStart = false;
    let iterationCount = 0;

    console.log("📜 Fetching ALL messages from #general (starting from the earliest)...");

    while (!reachedStart) {
      console.log(`🔄 Fetching batch ${++iterationCount}...`);
      
      const options = { limit: FETCH_LIMIT };
      if (lastMessageId) {
        options.before = lastMessageId;
      }

      const messages = await channel.messages.fetch(options);
      
      if (messages.size === 0) {
        reachedStart = true; // No older messages left
        console.log("🏁 **Reached the very first message in #general!**");
        break;
      }

      const sortedMessages = Array.from(messages.values()).reverse(); // Oldest first

      for (const message of sortedMessages) {
        if (message.author.bot || !message.content.trim()) continue; // Ignore bot messages & empty ones
        allMessagesBuffer.push(message.content);
        totalMessagesFetched++;
      }

      lastMessageId = sortedMessages[sortedMessages.length - 1]?.id; // Move to OLDER messages
      console.log(`📩 Processed ${messages.size} messages, fetching more...`);

      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY)); // Avoid hitting rate limits
    }

    console.log(`🏁 **All messages collected! Total messages fetched: ${totalMessagesFetched}**`);
    console.log("✅ Now processing messages in order...");

    // **Now process the messages**
    await processAllMessages();

  } catch (error) {
    console.error("❌ Error fetching historical messages:", error);
  }
}

// **Process Messages in Order (Now That We Have Everything)**
async function processAllMessages() {
  let messageBuffer = [];
  let quotedMessages = [];
  let wordCount = 0;

  for (const message of allMessagesBuffer) {
    const words = message.split(/\s+/);
    messageBuffer.push(message);
    quotedMessages.push(`> ${message}`);
    wordCount += words.length;

    if (wordCount >= WORD_COUNT_THRESHOLD) {
      console.log(`✅ Collected ${wordCount} words, processing batch...`);
      await processConversation(messageBuffer, quotedMessages);
      messageBuffer = [];
      quotedMessages = [];
      wordCount = 0;
    }
  }

  // Final batch processing (if anything remains)
  if (messageBuffer.length > 0) {
    console.log(`✅ Final batch processing remaining messages...`);
    await processConversation(messageBuffer, quotedMessages);
  }

  console.log("✅ **All messages processed!**");
}

// **Process & Send Summarized Messages**
async function processConversation(messageBuffer, quotedMessages) {
  if (messageBuffer.length === 0) return;

  const conversationText = messageBuffer.join("\n");
  const quotedText = quotedMessages.join("\n");

  const summary = await analyzeConversation(conversationText, quotedText);

  if (summary) {
    const maybeIssueChannel = await client.channels.fetch(MAYBE_ISSUE_CHANNEL_ID);

    let trimmedSummary = summary.slice(0, SUMMARY_MAX_LENGTH); // Trim AI-generated summary to 1500 chars max

    // Ensure message stays within Discord's 2000-character limit
    if (trimmedSummary.length > DISCORD_MAX_MESSAGE_LENGTH) {
      trimmedSummary = trimmedSummary.slice(0, DISCORD_MAX_MESSAGE_LENGTH - 10) + `...`;
    }

    await maybeIssueChannel.send(`📝 **Discussion Summary**\n${trimmedSummary}`);
  }
}

// **AI Analysis of the Conversation**
async function analyzeConversation(conversationText, quotedText) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `You are an AI that organizes and prioritizes discussions related to software development.

          **Your goal:** Identify only discussions that are clearly **actionable** in a GitHub issue format.

          - **DO categorize topics if they relate to:** 
            - Code changes, features, bugs, technical improvements.
            - Specific **problems** needing resolution.
            - Well-defined **design considerations**.
            - Concrete **tradeoffs** between different approaches.
            - **Risks or concerns** that may impact the project.

          - **DO NOT categorize topics if they are:** 
            - Vague, general thoughts (e.g., "It'd be nice if...")
            - Just team coordination, process discussions, or opinions.
            - Not related to software development (e.g., project culture, personal ideas).

          **For each topic you find, follow this format:**

          🏷 **[Category]**: [Title] (**Confidence: XX%**)
          [Concise summary of the issue or idea]
          _User said:_  
          > [Exact quote from the conversation]

          **Categories you may use:**
          - **Feature**: A well-defined functionality to implement.
          - **Epic**: A large feature requiring multiple development steps.
          - **Tradeoff**: A decision with clear pros and cons.
          - **Concern**: A project risk or potential blocker.
          - **Issue**: A specific, actionable bug or technical problem.
          - **Design Consideration**: A UX or architectural decision.

          **If nothing is actionable, return:** 'No actionable GitHub issues detected.'`,
        },
        {
          role: "user",
          content: `Here is a brainstorming session:\n\n${conversationText}\n\nHere are the user messages:\n\n${quotedText}\n\nCategorize and summarize each topic with a probability score and include exact quotes from the discussion.`,
        },
      ],
      temperature: 0.5,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("❌ Error analyzing conversation:", error);
    return null;
  }
}

// **Run on Startup**
client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  fetchAllMessages();
});

client.login(BOT_TOKEN);
