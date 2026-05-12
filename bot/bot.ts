import { Bot } from "grammy";
import "dotenv/config";

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is not set in environment variables");
}

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

// Handle /start command
bot.command("start", (ctx) => {
  ctx.reply(
    "Welcome to Matchmaker. A safe environment for practicing vulnerability, boundary-setting, and relationship repair.\n\nType /profile to see your status, or /settings to adjust your profile."
  );
});

// Basic commands as defined in PLAN.md
bot.command("settings", (ctx) => {
  ctx.reply("Settings menu will be implemented here (Conversational flow / Inline buttons).");
});

bot.command("subscribe", (ctx) => {
  ctx.reply("Subscription status and Stripe payment links will be handled here.");
});

bot.command("profile", (ctx) => {
  ctx.reply("Your current 'Matchmaker' standing will be displayed here.");
});

// Handle other messages
bot.on("message", (ctx) => {
  ctx.reply("I received your message! The emotional engine and bidirectional matching logic are being integrated.");
});

// Start the bot
bot.start();

console.log("Bot is running...");
