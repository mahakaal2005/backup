const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

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

PLATFORM ALGORITHM UNDERSTANDING:
- LinkedIn: Rewards longer engagement time (1300-2000 chars optimal), comments, and shares
- YouTube Community: Rewards quick reactions, likes, and immediate engagement`;

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
"I want to share something really important with you today that I've been thinking about for a while and I think it could really help you in your journey to becoming better at what you do..."
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
// TONE-SPECIFIC TEMPLATES (Fallback Mock Data)
// ============================================================================
const toneTemplates = {
    Professional: {
        linkedin: [
            (v) => `I'm pleased to announce a new educational resource: "${v.title}"

Key Insights:
${v.description?.slice(0, 100) || 'Discover valuable insights in this video'}...

This video offers valuable perspectives for professionals seeking to expand their knowledge.

👉 Watch here: ${v.url || '[Link in comments]'}

#${v.tags?.[0] || 'Education'} #ProfessionalDevelopment`,
            (v) => `Industry Insight: Understanding ${v.tags?.[0] || 'this topic'} is crucial in today's landscape.

I've prepared a comprehensive analysis in my latest video: "${v.title}"

🎬 ${v.url || 'Link in comments'}

I welcome your professional perspectives in the comments.`,
            (v) => `New Video Release | ${v.title}

Topics covered: ${v.tags?.slice(0, 3).join(', ') || 'Multiple topics'}

📺 Full analysis: ${v.url || 'Link in comments'}`
        ],
        youtube: [
            (v) => `New Educational Content Published

"${v.title}"

A comprehensive examination for professionals in the field.`,
            (v) => `Professional Development Resource: "${v.title}"

Now available for viewing.`,
            (v) => `I've released an in-depth analysis on ${v.tags?.[0] || 'this topic'}. Your feedback is appreciated.`
        ]
    },
    Casual: {
        linkedin: [
            (v) => `yo! 🎉 just dropped a new vid!

${v.title}

Basically we're talking about:
${v.description?.slice(0, 80) || 'Some cool stuff'}...

Come hang out and watch! 👇
${v.url || 'Link in comments'}

#${v.tags?.[0] || 'Content'} #LetsGo`,
            (v) => `ever wondered about ${v.tags?.[0] || 'this'}? 🤷

got you covered fam! new video just went live: "${v.title}"

${v.url || 'Link in comments'}

check it out when you get a chance! 😊`,
            (v) => `hey friends! 👋 new content alert!

${v.title}

${v.url || 'Link in comments'}

if you're into ${v.tags?.join(', ') || 'this kind of content'} you're gonna love this one lol`
        ],
        youtube: [
            (v) => `IT'S HERE!! 🔥🔥

${v.title}

go watch go watch go watch! 😄`,
            (v) => `new vid dropped! "${v.title}"

let me know what you think in the comments! 💬`,
            (v) => `finally finished the ${v.tags?.[0] || ''} video! hope you like it! 🙌`
        ]
    },
    Engaging: {
        linkedin: [
            (v) => `Just dropped: ${v.title}

Here's what you'll discover:
${v.description?.slice(0, 100) || 'Game-changing insights'}...

This could change how you think about ${v.tags?.[0] || 'everything'}.

Watch now: ${v.url || 'Link in comments'}

Drop a comment if you're excited.

#${v.tags?.[0] || 'MustWatch'}`,
            (v) => `Are you still struggling with ${v.tags?.[0] || 'this'}?

My latest video breaks it all down.

"${v.title}" is live now.

${v.url || 'Link in comments'}

Comment "READY" if you're watching today.`,
            (v) => `This is the video you've been waiting for.

${v.title}

Perfect for anyone interested in: ${v.tags?.join(', ') || 'growth'}

${v.url || 'Link in comments'}

What topic should I cover next? Let me know.`
        ],
        youtube: [
            (v) => `Just posted: ${v.title}

Don't miss out - this one's worth watching.

Let me know what you think!`,
            (v) => `Have you seen this yet?

"${v.title}"

Best video I've made in a while - you'll love it.`,
            (v) => `New video alert!

Deep diving into ${v.tags?.[0] || 'something awesome'} today.

Who's watching? Drop a comment below.`
        ]
    },
    Technical: {
        linkedin: [
            (v) => `Technical Deep Dive: ${v.title}

In this video, I examine:
${v.description?.slice(0, 100) || 'Key technical concepts'}...

Key concepts covered:
• Architecture patterns
• Implementation details
• Best practices

🔗 Full technical breakdown: ${v.url || 'Link in comments'}

#${v.tags?.[0] || 'Tech'} #TechDeepDive`,
            (v) => `For those working with ${v.tags?.[0] || 'this technology'}:

I've published a detailed technical walkthrough: "${v.title}"

📺 ${v.url || 'Link in comments'}

The video covers implementation specifics and common edge cases to consider.`,
            (v) => `New Technical Content: ${v.title}

Topics analyzed: ${v.tags?.slice(0, 3).join(', ') || 'Multiple topics'}

${v.url || 'Link in comments'}

Including code examples and architectural considerations.`
        ],
        youtube: [
            (v) => `Technical Tutorial Published

${v.title}

Detailed code walkthrough included.`,
            (v) => `${v.tags?.[0] || 'Tech'} Guide

"${v.title}"

Timestamps in the description for easy navigation.`,
            (v) => `In-depth technical analysis: ${v.tags?.[0] || 'this topic'}

Full documentation and resources linked below.`
        ]
    }
};

// Mock response generator - returns tone-specific content
const generateMockPosts = (videoData, tone) => {
    const templates = toneTemplates[tone] || toneTemplates.Professional;
    return {
        linkedin: templates.linkedin.map(fn => fn(videoData)),
        youtube: templates.youtube.map(fn => fn(videoData))
    };
};

// ============================================================================
// TEMPERATURE SETTINGS BY TONE
// ============================================================================
const TONE_TEMPERATURE = {
    Professional: 0.5,  // More consistent, predictable
    Casual: 0.85,       // Creative, varied
    Engaging: 0.9,      // Highly creative
    Technical: 0.4      // Precise, factual
};


// ============================================================================
// STYLE ANALYSIS SERVICE (STYLE UNBUNDLING)
// ============================================================================
async function analyzeStyleRules(historyExamples, apiKey, modelName = "gemini-2.5-flash") {
    if (!historyExamples || historyExamples.length === 0) return null;

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Use the same model as main generation to avoid rate limits
        const model = genAI.getGenerativeModel({ model: modelName });

        const prompt = `
        Analyze these ${historyExamples.length} social media posts and extract 8-10 specific style rules.
        
        POSTS:
        ${historyExamples.map((ex, i) => `${i + 1}. [${ex.platform}] ${ex.generated_post}`).join('\n\n')}
        
        Extract explicit rules covering:
        1. Sentence structure & length
        2. Hook patterns
        3. Emoji usage
        4. Formatting (bullets, breaks, arrows)
        5. Tone & vocabulary
        6. Call-to-action style
        7. Hashtag strategy
        8. Platform-specific patterns
        
        Output 8-10 numbered rules. Be specific and actionable. No intro/outro.
        `;

        const result = await model.generateContent(prompt);
        const styleRules = result.response.text();
        console.log("✨ EXTRACTED STYLE DNA:\n", styleRules);
        return styleRules;
    } catch (e) {
        console.error("Style analysis failed:", e);
        return null;
    }
}


// ============================================================================
// MAIN GENERATION FUNCTION
// ============================================================================
async function generatePosts(videoData, tone = 'Professional', length, hashtags, historyExamples, apiKey, model, linkedinCount = 1, youtubeCount = 1) {
    // Reconstruct options object for internal consistency, handling potential legacy calls
    const options = typeof model === 'object' && model !== null ? model : {
        tone,
        length,
        hashtags,
        historyExamples,
        model: model || 'gemini-2.5-flash', // Use provided model or default
        linkedinCount,
        youtubeCount
    };

    const currentApiKey = apiKey || process.env.GEMINI_API_KEY;

    // Use configured model or fallback
    const modelName = options.model || 'gemini-2.5-flash';

    console.log('=== GEMINI SERVICE DEBUG ===');
    console.log('DEBUG: Tone:', tone);
    console.log('DEBUG: Model from options:', options.model);
    console.log('DEBUG: Final Model (modelName):', modelName);
    console.log('DEBUG: Has API Key:', !!currentApiKey);
    if (currentApiKey) console.log('DEBUG: API Key starts with:', currentApiKey.substring(0, 8) + '...');
    if (historyExamples?.length > 0) console.log(`DEBUG: Including ${historyExamples.length} history examples for adaptation.`);
    console.log('===========================');

    // Fallback to mock data if no API key
    if (!currentApiKey || currentApiKey === 'YOUR_GEMINI_API_KEY_HERE') {
        console.warn('Gemini API Key missing or default. Returning mock data.');
        return generateMockPosts(videoData, tone);
    }

    try {
        const genAI = new GoogleGenerativeAI(currentApiKey);

        // Debug log to trace model version
        console.log(`🚀 INITIALIZING GEMINI MODEL: ${modelName}`);
        const model = genAI.getGenerativeModel({
            model: modelName
        });
        console.log(`✅ Model initialized successfully: ${modelName}`);

        // 1. Analyze Style if History Exists (Style Unbundling)
        let styleRules = "";
        let userHistorySection = "";

        // TEMPORARILY DISABLED to reduce API usage (quota limit)
        // TODO: Re-enable when quota is increased or add caching
        /*
        if (historyExamples && historyExamples.length > 0) {
            // Unbundle the style into explicit rules
            styleRules = await analyzeStyleRules(historyExamples, currentApiKey, modelName);

            // Still provide raw examples for reference
            userHistorySection = `
USER'S PREVIOUS SUCCESSFUL POSTS (Reference for style):
${historyExamples.map((ex, i) => `
Example ${i + 1} (${ex.platform}):
${ex.generated_post}
`).join('\n')}
`;
        }
        */

        // Provide raw examples directly without analysis (saves 1 API call)
        if (historyExamples && historyExamples.length > 0) {
            userHistorySection = `
USER'S PREVIOUS SUCCESSFUL POSTS (Learn from these examples):
${historyExamples.map((ex, i) => `
Example ${i + 1} (${ex.platform}):
${ex.generated_post}
`).join('\n')}
`;
        }


        // Get few-shot examples for this tone
        const examples = FEW_SHOT_EXAMPLES[tone] || FEW_SHOT_EXAMPLES.Professional;

        // Build the enhanced prompt
        const prompt = `
${SYSTEM_INSTRUCTION}

${styleRules ? `
IMPORTANT - USER STYLE "DNA" RULES:
The following rules describe the user's specific voice. YOU MUST FOLLOW THESE STRICTLY:
${styleRules}
` : ''}

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
2. Match the ${tone} tone and the USER STYLE RULES (if provided)
3. Reference the video content naturally
4. Include a clear call-to-action
5. Follow platform-specific best practices
6. Avoid all anti-patterns listed above
7. ALWAYS include the exact Video URL (${videoData.url || 'Link'}) in the post body

CRITICAL: LinkedIn posts should be longer (150-300 words) with 3-5 hashtags. YouTube posts should be shorter (50-150 words) with 1-2 emojis max. MUST include the Video URL.

Output your response as valid JSON in exactly this format:
{
    \\\"linkedin\\\": [${Array(linkedinCount).fill('"post"').join(', ')}],
    \\\"youtube\\\": [${Array(youtubeCount).fill('"post"').join(', ')}]
}
`;

        // Generate with tone-appropriate temperature
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: TONE_TEMPERATURE[tone] || 0.7,
                topP: 0.9,
                topK: 40,
                maxOutputTokens: 4096,
                responseMimeType: 'application/json'
            }
        });

        const response = await result.response;
        const text = response.text();

        // Clean up and parse JSON
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonStr);

        // Validate structure
        if (!parsed.linkedin || !parsed.youtube ||
            !Array.isArray(parsed.linkedin) || !Array.isArray(parsed.youtube)) {
            throw new Error('Invalid response structure');
        }

        return parsed;

    } catch (error) {
        console.error('Gemini API Error:', error);

        // Check if it's a quota error and try fallback model
        if (error.status === 429 && modelName === 'gemini-2.5-flash') {
            console.warn('⚠️  Quota exceeded for gemini-2.5-flash. Trying fallback model: gemini-2.5-pro...');
            try {
                // Retry with gemini-2.5-pro (different quota pool)
                return await generatePosts(videoData, tone, length, hashtags, historyExamples, currentApiKey, 'gemini-2.5-pro', linkedinCount, youtubeCount);
            } catch (fallbackError) {
                console.error('Fallback model also failed:', fallbackError);
            }
        }

        // Fallback to mock data on error
        console.warn('⚠️  Returning mock templates due to API error');
        return generateMockPosts(videoData, tone);
    }
}

module.exports = { generatePosts };
