"""
Discord Bot for Gloria Victis Character Builder
Serves the builder link to users in Discord
"""

import discord
from discord.ext import commands
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Bot configuration
BOT_TOKEN = os.getenv('DISCORD_BOT_TOKEN')
BUILDER_URL = os.getenv('BUILDER_URL', 'https://your-render-app.onrender.com')

# Bot setup
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print(f'{bot.user} has logged in!')
    print(f'Builder URL: {BUILDER_URL}')
    await bot.change_presence(activity=discord.Game(name="Gloria Victis Character Builder"))

@bot.command(name='builder', aliases=['char', 'character', 'build'])
async def send_builder(ctx):
    """Send the character builder link"""
    embed = discord.Embed(
        title="⚔️ Gloria Victis Character Builder",
        description="Build and plan your character!",
        color=discord.Color.blue(),
        url=BUILDER_URL
    )
    embed.add_field(
        name="🔗 Link",
        value=f"[Open Character Builder]({BUILDER_URL})",
        inline=False
    )
    embed.add_field(
        name="📋 Features",
        value="• Plan your character build\n• Calculate skill points\n• Share builds with others",
        inline=False
    )
    embed.set_footer(text="Powered by Render | Gloria Victis Community")
    
    await ctx.send(embed=embed)

@bot.command(name='builderhelp', aliases=['helpbuilder'])
async def builder_help(ctx):
    """Show help for builder commands"""
    embed = discord.Embed(
        title="Character Builder Commands",
        description="Available commands for the builder:",
        color=discord.Color.green()
    )
    embed.add_field(
        name="!builder",
        value="Get the character builder link",
        inline=False
    )
    embed.add_field(
        name="!builderhelp",
        value="Show this help message",
        inline=False
    )
    await ctx.send(embed=embed)

@bot.event
async def on_message(message):
    # Ignore messages from the bot itself
    if message.author == bot.user:
        return
    
    # Check for mentions of "builder" or "character builder" (but not commands)
    if not message.content.startswith('!'):
        content_lower = message.content.lower()
        if any(word in content_lower for word in ['builder', 'character builder', 'char builder']):
            # Only respond occasionally to avoid spam (5% chance)
            import random
            if random.random() < 0.05:
                # Create a fake context for the command
                ctx = await bot.get_context(message)
                await send_builder(ctx)
    
    # Process commands
    await bot.process_commands(message)

if __name__ == '__main__':
    if not BOT_TOKEN:
        print("ERROR: DISCORD_BOT_TOKEN not found in environment variables!")
        print("Please create a .env file with: DISCORD_BOT_TOKEN=your_token_here")
    else:
        bot.run(BOT_TOKEN)

