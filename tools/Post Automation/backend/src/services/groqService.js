const OpenAI = require('openai');

// ============================================================================
// GROQ SERVICE - Free, Fast LLM API with Enhanced Prompts
// ============================================================================

const groq = new OpenAI({
   apiKey: process.env.GROQ_API_KEY,
   baseURL: 'https://api.groq.com/openai/v1'
});

// ============================================================================
// SYSTEM INSTRUCTION - Expert Viral Copywriter Persona
// ============================================================================
const SYSTEM_INSTRUCTION = `You are an elite viral social media copywriter with 10+ years of experience.
Your goal is to write content that sounds authentic and human while driving maximum engagement.

CORE PRINCIPLES:
1. Every post MUST start with a powerful hook.
2. Use proven viral formulas based on psychological triggers:
   - Curiosity Gap: Humans hate incomplete information (Zeigarnik Effect)
   - Unexpected Truth: Pattern interrupts capture attention
   - Direct Question: Engages the brain's response mechanism
   - Social Proof: Leverages authority and consensus
3. Keep paragraphs short (1-3 lines max) for mobile readability.
4. End with a clear call-to-action that lowers friction.
5. STRICTLY ADHERE to any provided "User Style Rules".
6. AVOID excessive emojis - use them sparingly (max 2-3 per post) and only when they add genuine value.
7. Write like a real person, not like AI - avoid formulaic patterns and overly enthusiastic language.
8. NO META-SUMMARIES: Do not say "In this video I share..." or "I dive into details...". Instead, TEACH the specific insight directly. Be specific, not descriptive.
9. SPECIFICITY RULE: If the video description is vague, do NOT write fluff. Instead, maintain authority by asking a deep, specific question or stating a strong opinion about importance of the topic.

PLATFORM ALGORITHM UNDERSTANDING:
- LinkedIn: Rewards longer engagement time (1300-2000 chars optimal), comments, and shares
- YouTube Community: Rewards quick reactions, likes, and immediate engagement`;

// ============================================================================
// VIRAL HOOK FORMULAS
// ============================================================================
const HOOK_FORMULAS = `
VIRAL HOOK FORMULAS (choose based on content type):

PROVEN PATTERNS:
1. UNEXPECTED TRUTH: "Most people think X... but the opposite is true"
   → Use for: Contrarian insights, myth-busting
   
2. CURIOSITY GAP: "There's ONE thing that changed everything for me. Here it is:"
   → Use for: Tutorials, transformations, discoveries
   
3. FAST REWARD: "Here's something you can use in the next 10 minutes"
   → Use for: Quick tips, actionable advice
   
4. DIRECT QUESTION: "Have you ever wondered why X happens?"
   → Use for: Educational content, problem-solving
   
5. CONFESSION: "I used to believe X. I was completely wrong."
   → Use for: Personal growth, lessons learned
   
6. BOLD STATEMENT: "Stop doing X. It's killing your Y."
   → Use for: Warnings, course corrections

NEW ADDITIONS:
7. PATTERN INTERRUPT: "Everyone's talking about X. Nobody's talking about Y."
   → Use for: Unique perspectives, underrated topics
   
8. SOCIAL PROOF: "I analyzed 100 top performers and found this pattern:"
   → Use for: Data-driven insights, research findings
   
9. SCARCITY/URGENCY: "This window closes in 48 hours:"
   → Use for: Time-sensitive content, limited offers
   
10. CONTROVERSY/HOT TAKE: "Unpopular opinion: X is overrated."
   → Use for: Debate-worthy topics, strong opinions
   
11. PERSONAL VULNERABILITY: "I failed at X three times before learning this:"
   → Use for: Authentic stories, relatability
   
12. DATA-DRIVEN: "73% of people don't know this about X:"
   → Use for: Statistics, surprising facts
`;

// ============================================================================
// ANTI-PATTERNS - What NOT to do
// ============================================================================
const ANTI_PATTERNS = `
AVOID THESE COMMON MISTAKES:

❌ TOO SALESY:
"🚨 LIMITED TIME OFFER! Buy my course NOW! Link in bio! 🔥"
→ Why it fails: Pure promotion with no value

❌ VAGUE CLICKBAIT:
"This one trick changed my life... you won't believe what happened next!"
→ Why it fails: No substance, broken promises

❌ OVERUSED CLICHÉS:
"Unlock the secret to success! Game-changer! Think outside the box!"
→ Why it fails: Sounds robotic, not authentic

❌ TOO LONG WITHOUT BREAKS:
"I want to share something really important with you today that I've been thinking about for a while..."
→ Why it fails: Wall of text, mobile-unfriendly

❌ EMOJI SPAM:
"🚀🔥💯 NEW VIDEO 🎉🎊✨ Check it out! 👀💪🙌"
→ Why it fails: Looks desperate, hard to read

PLATFORM-SPECIFIC DON'TS:
LinkedIn:
- Don't use 10+ hashtags (looks spammy)
- Don't post pure promotional content
- Don't ignore comments (algorithm penalty)

YouTube Community:
- Don't write essays (keep it concise)
- Don't post without engaging with comments
- Don't forget to link the video
`;

// ============================================================================
// PLATFORM-SPECIFIC BEST PRACTICES
// ============================================================================
const PLATFORM_BEST_PRACTICES = `
PLATFORM-SPECIFIC BEST PRACTICES:

LINKEDIN:
- Optimal length: 1300-2000 characters (algorithm sweet spot)
- Hashtags: 3-5 relevant hashtags (mix broad + niche)
- Structure: Hook → Story/Value → Insight → Question/CTA
- Line breaks: Every 2-3 lines for readability
- End with a question to drive comments (algorithm boost)
- First 2 lines are preview - make them count!

YOUTUBE COMMUNITY:
- Optimal length: 50-150 words (quick read)
- Always include video link in the post body
- Use 1-2 emojis max (platform is visual already)
- Post timing: Within 1 hour of video upload for max reach
- Encourage specific actions: "Watch at 3:45 for the best part"
- Consider poll opportunities for engagement
`;

// ============================================================================
// FEW-SHOT EXAMPLES - High-performing post samples for each tone
// ============================================================================
const FEW_SHOT_EXAMPLES = {
   Professional: {
      linkedin: `Example Professional LinkedIn Post:
---
I used to think networking was about collecting business cards.

Then I realized: the most successful people don't network UP. They network AROUND.

Here's what changed my perspective:

A junior colleague introduced me to someone who became my biggest client. Not at a fancy event—at a random coffee chat.

The lesson? Your next opportunity is probably 2 degrees away, hidden in someone you'd never expect.

3 ways to network around (not up):
• Help someone with no obvious ROI
• Attend events outside your industry
• Ask your team who THEY know

Who's someone unexpected that opened a door for you?

#Networking #CareerGrowth #ProfessionalDevelopment
---`,
      youtube: `Example Professional YouTube Post:
---
Just published a comprehensive breakdown you've been asking for.

This video covers everything you need to know, with timestamps in the description.

Would love to hear which section was most valuable for you.
---`
   },
   Casual: {
      linkedin: `Example Casual LinkedIn Post:
---
ok real talk 🙋‍♂️

i've been doing this thing wrong for YEARS and nobody told me lol

turns out the secret isn't working harder... it's actually stupidly simple

just watched this video and my mind is lowkey blown 🤯

anyone else ever had that moment where you're like "wait... THAT'S IT??"

drop a 👇 if you can relate haha

#RealTalk #LessonsLearned
---`,
      youtube: `Example Casual YouTube Post:
---
new vid is up!! 🎉

honestly pretty proud of this one ngl

go check it out and lmk what you think in the comments 💬
---`
   },
   Engaging: {
      linkedin: `Example Engaging LinkedIn Post:
---
I asked 100 top performers one question: "What's your unfair advantage?"

The #1 answer shocked me.

It wasn't talent, luck, or connections.

It was this: "I show up when I don't feel like it."

That's it. Consistency beats intensity. Every single time.

Here's the challenge:
For the next 30 days, do ONE thing daily that moves the needle.

Comment "30" if you're in.

#Success #Mindset #GrowthMindset
---`,
      youtube: `Example Engaging YouTube Post:
---
This video is different.

I've never shared this before, but it's time.

Watch it now - you won't look at things the same way.

Let me know what you think in the comments.
---`
   },
   Technical: {
      linkedin: `Example Technical LinkedIn Post:
---
Here's a pattern that reduced our API latency by 73%.

The problem: N+1 queries killing our response times.

The solution: DataLoader + strategic caching.

Implementation details:
→ Batch requests by entity type
→ Cache at the resolver level
→ Invalidate on mutation

Key metrics after deployment:
• P95 latency: 450ms → 120ms
• Database queries: -68%
• User complaints: -91%

Full technical walkthrough in the video with code examples.

Have you implemented DataLoader in your stack? What challenges did you face?

#Engineering #Backend #Performance #GraphQL
---`,
      youtube: `Example Technical YouTube Post:
---
New technical deep-dive published.

Covers: architecture decisions, implementation details, edge cases.

Timestamps in description. Code examples included.

Questions? Drop them below.
---`
   }
};

async function generatePostsWithGroq(videoData, tone = 'Professional', length, hashtags, historyExamples = [], linkedinCount = 1, youtubeCount = 1) {
   try {
      // Get few-shot examples for this tone
      const examples = FEW_SHOT_EXAMPLES[tone] || FEW_SHOT_EXAMPLES.Professional;

      // Build user history section if available
      let userHistorySection = '';
      if (historyExamples && historyExamples.length > 0) {
         userHistorySection = `
RECENT USER POSTS (for reference - maintain similar style):
${historyExamples.map((ex, i) => `
Example ${i + 1} (${ex.platform}):
${ex.generated_post}
`).join('\n')}
`;
      }

      // Build the enhanced prompt (exact copy from Gemini)
      const prompt = `
${SYSTEM_INSTRUCTION}

VIDEO INFORMATION:
- Title: ${videoData.title}
- Channel: ${videoData.channelTitle || 'Unknown'}
- Description: ${videoData.description}
- Video URL: ${videoData.url || 'Link not provided'}
- Tags/Topics: ${videoData.tags?.join(', ') || 'General'}

TARGET SETTINGS:
- Tone: ${tone}
- Target Length: ${length || 'Medium'}
- Suggested Hashtags: ${hashtags?.join(', ') || videoData.tags?.slice(0, 5).join(', ') || 'None'}

${HOOK_FORMULAS}

${ANTI_PATTERNS}

${PLATFORM_BEST_PRACTICES}

${userHistorySection}

FEW-SHOT EXAMPLES (General style reference):

${examples.linkedin}

${examples.youtube}

YOUR TASK:
Generate ${linkedinCount} LinkedIn ${linkedinCount === 1 ? 'post' : 'posts'} and ${youtubeCount} YouTube ${youtubeCount === 1 ? 'post' : 'posts'} promoting this video.

${linkedinCount > 1 || youtubeCount > 1 ? `VARIATION STRATEGY (when generating multiple posts):
Post 1 - CURIOSITY-DRIVEN:
- Lead with an intriguing question or surprising fact
- Focus on creating mystery and intrigue
- Best for: Cold audiences, discovery

Post 2 - VALUE-DRIVEN:
- Lead with clear benefit or transformation
- Focus on practical takeaways
- Best for: Warm audiences, education

Post 3 - STORY-DRIVEN:
- Lead with personal narrative or case study
- Focus on emotional connection
- Best for: Engaged audiences, inspiration

Each variation should use a DIFFERENT hook formula and approach.
` : ''}

Each post MUST:
1. Start with a powerful hook using one of the 12 viral formulas
2. Match the ${tone} tone
3. Reference the video content naturally
4. Include a clear call-to-action
5. Follow platform-specific best practices
6. Avoid all anti-patterns listed above
7. ALWAYS include the exact Video URL (${videoData.url || 'Link'}) in the post body

CRITICAL: LinkedIn posts should be longer (150-300 words) with 3-5 hashtags. YouTube posts should be shorter (50-150 words) with 1-2 emojis max. MUST include the Video URL.

FORMATTING INSTRUCTION: 
Your output is JSON. Inside the JSON string values, you MUST use the "\\n" character to create line breaks. 
DO NOT produce a single long line of text.
Example: "Hook line 1\\n\\nHook line 2\\n\\nBody paragraph..."

Output your response as valid JSON in exactly this format:
{
    "linkedin": [${Array(linkedinCount).fill('"post"').join(', ')}],
    "youtube": [${Array(youtubeCount).fill('"post"').join(', ')}]
}
`;

      const completion = await groq.chat.completions.create({
         model: 'llama-3.3-70b-versatile',
         messages: [
            { role: 'system', content: 'You are a viral social media copywriter. Output only valid JSON.' },
            { role: 'user', content: prompt }
         ],
         response_format: { type: 'json_object' },
         temperature: 0.7,
         max_tokens: 4096
      });

      const result = JSON.parse(completion.choices[0].message.content);
      console.log('✅ Groq generation successful');
      return result;

   } catch (error) {
      console.error('Groq API Error:', error);
      throw error;
   }
}

module.exports = { generatePostsWithGroq };
