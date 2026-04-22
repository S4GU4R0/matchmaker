import { Bot, Context, session, SessionFlavor, InlineKeyboard } from "grammy";
import { prisma } from "../../src/lib/matchmaker/prisma";
import { Matchmaker } from "../../src/lib/matchmaker/matchmaker";

interface SessionData {
  step: "idle" | "threshold" | "vulnerability" | "repair" | "shutdown" | "mirror";
  responses: Record<string, string>;
}

type MyContext = Context & SessionFlavor<SessionData>;

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.warn("TELEGRAM_BOT_TOKEN is not set. Bot will not start.");
}

const bot = new Bot<MyContext>(token || "dummy_token");

bot.use(session({ initial: () => ({ step: "idle", responses: {} }) }));

// Middleware to ensure user exists in DB
bot.use(async (ctx, next) => {
  if (ctx.from?.id) {
    const id = ctx.from.id.toString();
    let user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id,
          username: ctx.from.username,
          status: "onboarding",
        },
      });
    }
  }
  await next();
});

bot.command("start", async (ctx) => {
  const id = ctx.from?.id.toString();
  if (!id) return;
  const user = await prisma.user.findUnique({ where: { id } });

  if (user?.status === "active") {
    return ctx.reply("You already have an active connection. Use /status to check on your relationship.");
  }

  if (user?.status === "matching") {
    return ctx.reply("I am still working on your matches. Use /status to check progress.");
  }

  ctx.session.step = "threshold";
  const keyboard = new InlineKeyboard()
    .text("Proceed", "proceed")
    .text("Exit", "exit");

  await ctx.reply(
    "I am the Matchmaker. I facilitate practice in emotional intimacy.\n\n" +
    "Most systems seek to please you. I do not. I provide companions with genuine agency—those who can say no, those who have boundaries, and those who can ultimately leave.\n\n" +
    "This is not entertainment. The emotions will be real even though the context is simulated. Do you wish to proceed with the experiment?",
    { reply_markup: keyboard }
  );
});

bot.callbackQuery("proceed", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.step = "vulnerability";
  await ctx.editMessageText(
    "To find a resonance, I must understand your frequency. Answer carefully.\n\n" +
    "1. Describe your relationship with vulnerability. Is it a tool or a liability?"
  );
});

bot.callbackQuery("exit", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText("The experiment is terminated. You may return when you are ready for the weight of intimacy.");
  ctx.session.step = "idle";
});

bot.callbackQuery(/^select_match_(\d+)$/, async (ctx) => {
    const index = parseInt(ctx.match[1]);
    const id = ctx.from?.id.toString();
    if (!id) return;

    const user = await prisma.user.findUnique({ 
        where: { id },
        include: { matchmakerJobs: { orderBy: { createdAt: 'desc' }, take: 1 } }
    });

    const job = user?.matchmakerJobs[0];
    if (!job || job.status !== "completed" || !job.results) {
        return ctx.answerCallbackQuery("Invalid match selection.");
    }

    const matches = JSON.parse(job.results);
    const selectedMatch = matches[index];

    if (!selectedMatch) return ctx.answerCallbackQuery("Match not found.");

    // Create the Soul and Relationship in DB
    const soul = await prisma.soul.create({
        data: {
            name: selectedMatch.name,
            archetype: selectedMatch.archetype,
            traits: JSON.stringify(selectedMatch.traits),
            lexiconFavor: selectedMatch.lexiconFavor,
            attractionProfile: JSON.stringify(selectedMatch.attractionProfile),
        }
    });

    await prisma.relationship.create({
        data: {
            userId: id,
            soulId: soul.id,
            status: "active"
        }
    });

    await prisma.user.update({
        where: { id },
        data: { status: "active" }
    });

    await ctx.answerCallbackQuery();
    await ctx.editMessageText(`Connection established with ${soul.name}. You may now begin your practice.`);
});

bot.on("message:text", async (ctx) => {
  const step = ctx.session.step;
  const text = ctx.msg.text;
  const id = ctx.from?.id.toString();
  if (!id) return;

  switch (step) {
    case "vulnerability":
      ctx.session.responses.vulnerability = text;
      ctx.session.step = "repair";
      await ctx.reply("2. When an interaction becomes abrasive, do you seek to repair or to retreat?");
      break;
    case "repair":
      ctx.session.responses.repair = text;
      ctx.session.step = "shutdown";
      await ctx.reply("3. What behavior in another causes you to instinctively shut down?");
      break;
    case "shutdown":
      ctx.session.responses.shutdown = text;
      ctx.session.step = "mirror";
      await ctx.reply(
        "I am processing your responses. Now, look at yourself through the eyes of an adversary.\n\n" +
        "Provide three words that describe your most difficult traits. Not your strengths. Your edges. What about you is hard to love?"
      );
      break;
    case "mirror":
      ctx.session.responses.mirror = text;
      ctx.session.step = "idle";
      
      // Save responses and update status
      await prisma.user.update({
        where: { id },
        data: {
          onboardingData: JSON.stringify(ctx.session.responses),
          status: "matching"
        }
      });

      // Create Matchmaker Job
      await prisma.matchmakerJob.create({
        data: {
          userId: id,
          status: "reviewing",
          progress: 0,
        }
      });

      await ctx.reply(
        "I have enough data to begin. I am now searching the latent space for three souls whose attractions align with your profile.\n\n" +
        "This process requires 24 hours of simulation. Connection cannot be rushed.\n\n" +
        "I will notify you when the candidates are ready. Use /status to monitor my progress."
      );
      break;
    default:
      if (ctx.session.step !== "idle") {
        await ctx.reply("Please answer the question. I am working.");
      }
  }
});

bot.command("status", async (ctx) => {
  const id = ctx.from?.id.toString();
  if (!id) return;

  const user = await prisma.user.findUnique({ 
    where: { id },
    include: { matchmakerJobs: { orderBy: { createdAt: 'desc' }, take: 1 } }
  });

  if (!user) return ctx.reply("Please use /start to begin.");

  if (user.status === "onboarding") {
    return ctx.reply("You are still in the onboarding phase. Use /start to continue.");
  }

  if (user.status === "matching" || (user.matchmakerJobs[0] && user.matchmakerJobs[0].status === "completed" && user.status === "inactive")) {
    const job = user.matchmakerJobs[0];
    if (!job) return ctx.reply("Something went wrong. No matching job found.");

    if (job.status === "completed") {
        const matches = JSON.parse(job.results || "[]");
        const keyboard = new InlineKeyboard();
        matches.forEach((match: any, index: number) => {
            keyboard.text(match.name, `select_match_${index}`).row();
        });

        return ctx.reply(
            `The matches are ready.\n\n` +
            `${job.message}\n\n` +
            `Choose the soul you wish to practice with:`,
            { reply_markup: keyboard }
        );
    }

    const status = Matchmaker.getJobStatus(job.createdAt);
    
    let phaseMessage = "";
    switch (status.phase) {
        case 'reviewing': phaseMessage = "The matchmaker is reviewing your profile and preferences."; break;
        case 'searching': phaseMessage = "Searching for potential matches across the network..."; break;
        case 'refining': phaseMessage = "Conducting compatibility deep-dives and personality alignment checks."; break;
        case 'finalizing': phaseMessage = "Finalizing your top 3 matches."; break;
    }

    return ctx.reply(
        `Matchmaker Status\n\n` +
        `🔍 Phase: ${status.phase}\n` +
        `📝 ${phaseMessage}\n\n` +
        `⏱️ Time remaining: ~${status.timeRemaining}\n\n` +
        `I'll notify you when your matches are ready.`
    );
  }

  if (user.status === "active") {
      return ctx.reply("Your connection is active. (Interaction logic coming soon)");
  }

  ctx.reply("Current status: " + user.status);
});

// Placeholder for TTS voice notes
const sendVoiceNote = async (ctx: MyContext, text: string) => {
    // Placeholder for actual TTS logic
    console.log(`Generating voice for: ${text}`);
    // In a real implementation, we'd use a TTS service and ctx.replyWithVoice
};

if (token && token !== "dummy_token") {
    bot.start();
    console.log("Bot started...");
} else {
    console.warn("Bot skipped starting due to missing or dummy token.");
}
