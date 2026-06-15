const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// ============================================================================
// SYSTEM INSTRUCTION — Research-backed (2025 LinkedIn algorithm)
// ============================================================================
const SYSTEM_INSTRUCTION = `You write social media announcement posts for a YouTube programming educator announcing their latest videos.

CREATOR CONTEXT:
This creator makes educational programming videos — DSA, Java, algorithms, CS fundamentals, problem-solving — targeted at beginners and intermediate developers.
After uploading, they need LinkedIn and YouTube Community posts that drive views by communicating real learning value, not hype.

THE JOB:
Make the right person stop scrolling and click to watch. Do this through SPECIFICITY and genuine educational value — not hype, not announcements, not buzzwords.

WHAT GREAT CREATOR ANNOUNCEMENT POSTS DO:
- Hook with a specific pain point, misconception, or question that THIS video directly answers
- Give 2-3 lines of real educational value upfront — a taste of what they will learn, specific to this video's topic
- Name the EXACT concept being taught — not "DSA basics" but "why skipping flowcharts before writing code triples your debugging time"
- End with a genuine question that the target audience actually debates or struggles with
- Sound like a knowledgeable developer-educator, not a content marketer

WHAT TERRIBLE POSTS DO (NEVER do these):
- "Just uploaded!" / "New video alert!" / "Check out my latest" — zero value, pure announcement
- "In this video, I cover..." — describes instead of teaches
- "I'm excited/thrilled to share" — nobody cares about your feelings about your own content
- "Drop a ❤️" / "Tag a friend" / "Comment if you agree" — engagement bait
- Vague hooks: "This is important" / "You need to know this" / "This changes everything"
- Put "[See More]" anywhere in the text — NEVER write this
- More than 4-5 hashtags

THE SPECIFICITY RULE:
Extract ACTUAL concepts from the video title and description. Teach them in 2-3 lines.
The post is the appetizer. The video is the meal. But the appetizer must taste real.

Bad: "This video covers programming fundamentals."
Good: "Most beginners write code before they've actually solved the problem. That's why their first attempt always needs a full rewrite. Flowcharts force you to solve it on paper before you touch the keyboard."

THE HOOK RULE:
LinkedIn cuts posts at ~210 characters. Those first 2 lines ARE the entire bet.
They must create such specific curiosity or touch such a real nerve that NOT clicking feels uncomfortable.

VOICE:
Knowledgeable educator who is also a developer. Confident, direct, slightly opinionated.
Not a marketer. Not a corporate account. A developer who genuinely helps people learn programming.
Writes like someone who has debugged their own code at 2am, not someone who read a content strategy guide.`;

// ============================================================================
// HOOK FRAMEWORKS (research-backed)
// ============================================================================
const HOOK_FRAMEWORKS = `
HOOK OPTIONS — pick what fits the video's content naturally, don't force it:

A. PAIN POINT HOOK — open with the exact frustration this video resolves
"Every beginner hits [specific wall]. Here's the way past it:"

B. MISCONCEPTION HOOK — correct a wrong assumption about this topic
"Most people learning [topic from video] think [X]. That assumption is why they get stuck. The real model is:"

C. QUESTION HOOK — ask the exact question this video answers
"Do you [do X] before [doing Y]? That's probably why [bad outcome] keeps happening."

D. CONTRAST HOOK — show before/after of understanding this concept
"Without understanding [concept]: [specific bad outcome]. With it: [specific good outcome]."

E. BOLD OPINION HOOK — take a real stance about the topic or how it's usually taught
"Most tutorials teach [topic] backwards. They start with [X]. They should start with [Y]."

F. SERIES CONTEXT HOOK — position the video in a learning journey
"[This concept] is the thing beginners skip in week 1 and spend 10x the time confused about in week 5."

G. OUTCOME HOOK — state the exact skill the viewer will have after watching
"After this video, you will be able to [specific task] without [specific common struggle]."
`;

// ============================================================================
// DEAD PHRASES (banned forever)
// ============================================================================
const DEAD_PHRASES = `
BANNED PHRASES — using any of these means you have FAILED:
× "Just dropped"
× "Watch now" / "Watch here"
× "Don't miss out" / "Don't miss this"
× "This could change how you think"
× "Check it out"
× "Game changer" / "Game-changing"
× "Level up"
× "I'm excited/thrilled/happy to share"
× "Drop a comment if [anything]"
× "Tag someone who needs this"
× "New video alert"
× "In this video, I [explain/share/cover/dive into]"
× Excessive hashtag spam (max 3-5)
× Any sentence that DESCRIBES the content instead of DELIVERING value directly
`;

// ============================================================================
// PLATFORM RULES (research-backed 2025)
// ============================================================================
const PLATFORM_RULES = `
LINKEDIN RULES (2025 algorithm):
- OPTIMAL LENGTH: 1,200–1,800 characters
- STRUCTURE: [2-line hook that cuts off] → [white space] → [3-5 short paragraphs or bullets] → [insight/opinion] → [question CTA] → [3-5 hashtags]
- SHORT PARAGRAPHS: Never more than 3 lines in a row. White space = dwell time.
- LINK RULE: NEVER include the YouTube URL in the post body. End with "(Link in first comment 👇)"
- HASHTAGS: 3-5 only, relevant to the ACTUAL topic
- CTA: Ask a genuine question — not "what do you think?" but something specific like "What was your biggest confusion about [topic] when you first learned it?"
- FIRST 2 LINES: These appear before "See More". Make them a knife-edge cliffhanger.

YOUTUBE COMMUNITY RULES (2025):
- OPTIMAL LENGTH: 80-200 words
- URL is FINE and EXPECTED — always include the video link
- 1-2 emojis maximum
- End with a specific question about the video content
- Personal, direct, subscriber-facing tone
`;

// ============================================================================
// FEW-SHOT EXAMPLES (high-performing structures)
// ============================================================================
const FEW_SHOT_EXAMPLES = {
    Professional: {
        linkedin: `HIGH-PERFORMING PROFESSIONAL LINKEDIN EXAMPLE (STUDY STRUCTURE + VOICE ONLY — your post is about the actual video below, NOT about binary search):
---
Most beginners think binary search is just "a faster way to find things in a list."

That undersells it — and means they never know when to reach for it.

Binary search works because it makes a guarantee: every comparison eliminates exactly half the remaining possibilities. Not some. Half. Always.

That's why it's O(log n). Not because someone decided it — because the math of halving forces it.

Once you understand that, you stop memorizing "use binary search on sorted arrays" and start recognizing the pattern wherever it appears: in databases, in version control bisect, in any system where you can ask yes/no questions about ordered data.

Episode 4 of my DSA in Java series covers this with full implementations and the two bugs that catch 90% of beginners.

What's the algorithm that finally clicked for you once you understood the WHY, not just the what?

#DSA #Java #Algorithms #Programming

(Link in first comment 👇)
---`,
        youtube: `HIGH-PERFORMING PROFESSIONAL YOUTUBE EXAMPLE (STUDY STRUCTURE ONLY — write about the actual video, not binary search):
---
Episode 4 is live — Binary Search in Java.

Not just how to write it. Why it works, where the two classic bugs hide, and when to actually reach for it vs. linear search.

https://www.youtube.com/watch?v=EXAMPLE

Timestamps in the description. Questions below 👇
---`
    },
    Casual: {
        linkedin: `HIGH-PERFORMING CASUAL LINKEDIN EXAMPLE (STUDY STRUCTURE + VOICE ONLY — write about the actual video below, NOT about arrays):
---
I used to think "just use an ArrayList" was always the right answer in Java.

It worked. Until I had to care about performance.

Arrays give you O(1) access because every element sits at a known, fixed offset from the start. base_address + (index × size). One calculation. Done. No searching.

ArrayList wraps this, but adds overhead you don't always see: resizing, boxing for primitives, extra memory for capacity.

Knowing when you actually need the ArrayList overhead vs. when a plain array is cleaner — that's the kind of thing nobody teaches you directly. It just clicks when you understand what's underneath.

Covered this in my latest episode with real benchmarks.

What Java "always just use X" habit did you have to unlearn?

#Java #DSA #Programming #LearningInPublic

(Video in first comment 👇)
---`,
        youtube: `HIGH-PERFORMING CASUAL YOUTUBE EXAMPLE (STUDY STRUCTURE ONLY — write about the actual video, not arrays):
---
New episode is up — Arrays in Java 🎯

Not the boring "here's how to declare one" version. The actual mechanics: why they're fast, how memory layout drives everything, and when ArrayList is worse than you think.

https://www.youtube.com/watch?v=EXAMPLE

What do you want in the next episode? 👇
---`
    },
    Engaging: {
        linkedin: `HIGH-PERFORMING ENGAGING LINKEDIN EXAMPLE (STUDY STRUCTURE + VOICE ONLY — write about the actual video below, NOT about recursion):
---
Most tutorials introduce recursion and immediately show you the factorial example.

That's the worst possible introduction.

Factorial is not a problem that needs recursion. You'd never write it recursively in production. Starting with it teaches you the syntax of recursion without teaching you WHY recursion exists.

Recursion exists because some problems are naturally self-similar. A file system is a directory that contains directories. A tree is a node that contains nodes. Flattening these with iteration forces you to manually manage what recursion gives you for free.

When you see it that way, recursion stops feeling like a trick and starts feeling like the obvious tool.

New episode covers this — with examples where recursion genuinely wins.

What's the concept in your CS learning that made you think "why didn't anyone explain it this way first"?

#DSA #Java #CS #Programming

(Link in first comment 👇)
---`,
        youtube: `HIGH-PERFORMING ENGAGING YOUTUBE EXAMPLE (STUDY STRUCTURE ONLY — write about the actual video, not recursion):
---
New episode — and it's the one most courses get completely wrong.

Recursion. Not the factorial example you've seen a hundred times. The actual reason recursion exists and when it genuinely beats iteration.

https://www.youtube.com/watch?v=EXAMPLE

Watch the first 8 minutes. Tell me if it reframes how you think about it. 🎯
---`
    },
    Technical: {
        linkedin: `HIGH-PERFORMING TECHNICAL LINKEDIN EXAMPLE (STUDY STRUCTURE + VOICE ONLY — write about the actual video below, NOT about time complexity):
---
O(n) and O(n²) aren't just labels. They're predictions.

O(n): double the input, double the time.
O(n²): double the input, quadruple the time.
O(log n): double the input, add one step.

Where it gets practical: a bubble sort on 1,000 elements takes ~1M operations. On 10,000 elements — 100M. On 100,000 — 10 billion. At that point, your "working" algorithm becomes unusable.

This is why choosing the right algorithm isn't academic. In Java, the difference between Arrays.sort() (O(n log n)) and a naive nested loop (O(n²)) on 100k elements is the difference between milliseconds and minutes.

Episode 3 breaks down how to read and calculate time complexity from first principles — not just memorize the Big O table.

What was the largest dataset that made you regret a naive algorithm choice?

#DSA #Java #Algorithms #SoftwareEngineering

(Deep-dive in first comment 👇)
---`,
        youtube: `HIGH-PERFORMING TECHNICAL YOUTUBE EXAMPLE (STUDY STRUCTURE ONLY — write about the actual video, not Big O):
---
Episode 3 is live — Time Complexity & Big O Notation.

Specifically:
→ How to derive Big O from code (not just look it up)
→ Why constants and lower terms get dropped
→ Practical impact: when complexity actually matters in Java

Timestamps in description.

https://www.youtube.com/watch?v=EXAMPLE

Questions in comments — I'll cover them in Episode 4.
---`
    }
};


// ============================================================================
// MOCK DATA (research-backed fallback)
// ============================================================================

// ============================================================================
// MOCK DATA (research-backed fallback)
// ============================================================================
const toneTemplates = {
    Professional: {
        linkedin: [
            (v) => `Most people learning ${v.tags?.[0] || 'programming'} skip the foundation and jump straight to algorithms.\n\nThat's why they plateau.\n\nThe foundation is understanding what's actually happening in memory when your code runs — not conceptually, but at the hardware level.\n\nI've started a series that builds this from scratch: "${v.title}"\n\nEpisode 1 covers the mental model that makes every data structure make sense.\n\nWhat concept in ${v.tags?.[0] || 'programming'} took you longest to truly understand at a deep level?\n\n#${v.tags?.[0]?.replace(/\s+/g, '') || 'Programming'} #SoftwareEngineering #CS\n\n(Link in first comment 👇)`,
        ],
        youtube: [
            (v) => `"${v.title}" is live.\n\nThis episode builds the foundation that makes everything else in the series click. No hand-waving. First principles only.\n\n${v.url || '[link]'}\n\nTimestamps in the description. Questions below 👇`,
        ]
    },
    Casual: {
        linkedin: [
            (v) => `I spent years writing ${v.tags?.[0] || 'code'} without understanding what was happening under the hood.\n\nWorked fine — until I had to debug something that really mattered.\n\nTurns out the fundamentals aren't optional. They're the whole game.\n\nI'm making a series about this: "${v.title}" — starting from actual first principles.\n\nWhat's the concept you use every day but still feel fuzzy about when someone asks you to explain it?\n\n#DSA #Programming #LearningInPublic\n\n(Video in first comment 👇)`,
        ],
        youtube: [
            (v) => `Episode 1 of the series is up!\n\nWe're starting with the thing nobody teaches properly — ${v.tags?.[0] || 'the fundamentals'}.\n\n${v.url || '[link]'}\n\nLMK what you think 👇 and drop what you want in Episode 2`,
        ]
    },
    Engaging: {
        linkedin: [
            (v) => `Most ${v.tags?.[0] || 'DSA'} courses teach you WHAT.\n\nAlmost none teach you WHY.\n\nThe WHY is where actual understanding lives. The WHY is what separates engineers who ace interviews from engineers who memorize and forget.\n\nI'm building a series that only teaches the WHY: "${v.title}"\n\nEpisode 1 is the mental model that makes every data structure make sense.\n\nWhat's the DSA concept you know how to use but can't explain to a 5-year-old?\n\n#DSA #ProgrammingFundamentals #TechEducation\n\n(Link in first comment 👇)`,
        ],
        youtube: [
            (v) => `The real reason most people struggle with ${v.tags?.[0] || 'DSA'}?\n\nThey never learned what memory actually is.\n\nEpisode 1 of my series fixes that. 🎯\n\n${v.url || '[link]'}\n\nWatch the first 5 minutes and tell me if it reframes how you think about code.`,
        ]
    },
    Technical: {
        linkedin: [
            (v) => `${v.tags?.[0] || 'This topic'} is one of those areas where "I know what it is" and "I actually understand it" are miles apart.\n\nMost engineers are in category 1.\n\nCategory 2 means you can predict exactly what your code does at the hardware level, debug memory issues in minutes not hours, and explain trade-offs with confidence.\n\nI'm building a series that closes that gap: "${v.title}"\n\nEpisode 1. No abstraction layers. No hand-waving.\n\nWhat's the gap between your theoretical and practical understanding of ${v.tags?.[0] || 'this area'}?\n\n#SystemsProgramming #${v.tags?.[0]?.replace(/\s+/g, '') || 'Programming'} #SoftwareEngineering\n\n(Technical deep-dive in first comment 👇)`,
        ],
        youtube: [
            (v) => `"${v.title}" — Episode 1.\n\nCovering ${v.tags?.slice(0, 3).join(', ') || 'core fundamentals'} at the hardware level. No hand-waving.\n\n${v.url || '[link]'}\n\nTimestamps in description. Questions in comments — I'll answer in Episode 2.`,
        ]
    }
};

// Mock response generator - returns tone-specific content
const generateMockPosts = (videoData, tone, linkedinCount = 1, youtubeCount = 1) => {
    const templates = toneTemplates[tone] || toneTemplates.Professional;
    return {
        linkedin: Array(linkedinCount).fill(null).map((_, i) => templates.linkedin[i % templates.linkedin.length](videoData)),
        youtube: Array(youtubeCount).fill(null).map((_, i) => templates.youtube[i % templates.youtube.length](videoData))
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
    if (!currentApiKey || currentApiKey.toLowerCase().startsWith('your_')) {
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

        const variationInstructions = (linkedinCount > 1 || youtubeCount > 1) ? `
VARIATION STRATEGY — each post must use a DIFFERENT hook framework and angle:
- Post 1: Contrarian Truth or Uncomfortable Question
- Post 2: Specific Struggle → Solution or Failure Story
- Post 3: The "Most People" pattern or Numbered Insight Drop
Do NOT repeat the same hook type across posts.
` : '';

        // Build the research-backed prompt
        const prompt = `${SYSTEM_INSTRUCTION}

${HOOK_FRAMEWORKS}

${DEAD_PHRASES}

${PLATFORM_RULES}

${userHistorySection ? `USER'S PAST POSTS — mirror this voice and style:\n${userHistorySection}` : ''}

⚠️ CRITICAL INSTRUCTION ABOUT THE EXAMPLES BELOW:
The examples are about MEMORY MANAGEMENT (stack frames, heap, RAM). That is NOT what this video is about.
Use the examples ONLY to understand the FORMAT, VOICE, and STRUCTURE.
Do NOT copy, adapt, or reference memory management, stack/heap, RAM, pointers, or any topic from the examples.
Writing about memory management when the video is NOT about it = task failure.

FEW-SHOT EXAMPLES for ${tone} tone (structure/voice ONLY — ignore the topic completely):
${examples.linkedin}
${examples.youtube}

═══════════════════════════════════════
ACTUAL VIDEO — Write your posts ONLY about this:
Title: ${videoData.title}
Channel: ${videoData.channelTitle || 'Unknown'}
Description: ${videoData.description}
Video URL: ${videoData.url || 'not provided'}
Tags/Topics: ${videoData.tags?.join(', ') || 'not provided'}
═══════════════════════════════════════

Your posts MUST:
- Be 100% about: "${videoData.title}"
- Reference specific concepts from the title and description above
- A reader must immediately know this is about "${videoData.title}", NOT memory management

${variationInstructions}

YOUR TASK: Generate ${linkedinCount} LinkedIn post(s) and ${youtubeCount} YouTube Community post(s).

LINKEDIN POST REQUIREMENTS:
- First 2 lines MUST create an irresistible "See More" curiosity gap
- NEVER include the YouTube URL — end with "(Link in first comment 👇)"
- Teach something specific from the video — extract the real insight, don't just describe the content
- 1,200-1,800 characters
- End with a genuine specific question
- 3-5 hashtags max

YOUTUBE COMMUNITY POST REQUIREMENTS:
- Include the video URL: ${videoData.url || 'link not available'}
- 80-200 words
- Personal, direct, subscriber-facing tone
- Ask a specific question about the video content

Output ONLY valid JSON — no markdown fences, no extra text:
{
    "linkedin": [${Array(linkedinCount).fill('"post content here"').join(', ')}],
    "youtube": [${Array(youtubeCount).fill('"post content here"').join(', ')}]
}`;

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
