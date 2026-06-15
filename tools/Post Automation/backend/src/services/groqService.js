const OpenAI = require('openai');

// ============================================================================
// GROQ SERVICE - Research-backed prompt engineering
// ============================================================================

// ============================================================================
// SYSTEM INSTRUCTION
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
// HOOK FRAMEWORKS
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
// PLATFORM RULES
// ============================================================================
const PLATFORM_RULES = `
LINKEDIN:
- 1,200–1,900 characters is the sweet spot. Not shorter. Not much longer.
- Short paragraphs. Max 2-3 lines then white space. People read on phones.
- Hashtags go at the very end, after everything else. 3-5 max, relevant to the actual topic.
- End with a specific question your audience has real opinions about. Not "what do you think?" — too vague.
  Good: "What was the thing that made DSA actually click for you?"
  Bad: "What do you think about this? Let me know in the comments!"
- LINK PLACEMENT: {LINK_INSTRUCTION}

YOUTUBE COMMUNITY:
- 80-180 words. Quick, direct, feels like a message to a friend.
- Always include the video URL.
- 1-2 emojis max.
- Ask something specific about the video — not "did you watch it?"
`;

// ============================================================================
// FEW-SHOT EXAMPLES — clean posts, NO "[See More]" text, human voice
// ============================================================================
const FEW_SHOT_EXAMPLES = {
    Professional: {
        linkedin: `EXAMPLE — Professional LinkedIn (STUDY STRUCTURE + VOICE ONLY. Your post must be about the actual video below, NOT about binary search):
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
        youtube: `EXAMPLE — Professional YouTube Community (STUDY STRUCTURE ONLY — write about the actual video, not binary search):
---
Episode 4 is live — Binary Search in Java.

Not just how to write it. Why it works, where the two classic bugs hide, and when to actually reach for it vs. linear search.

https://www.youtube.com/watch?v=EXAMPLE

Timestamps in the description. Questions below 👇
---`
    },
    Casual: {
        linkedin: `EXAMPLE — Casual LinkedIn (STUDY STRUCTURE + VOICE ONLY. Write about the actual video below, NOT about arrays):
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
        youtube: `EXAMPLE — Casual YouTube Community (STUDY STRUCTURE ONLY — write about the actual video, not arrays):
---
New episode is up — Arrays in Java 🎯

Not the boring "here's how to declare one" version. The actual mechanics: why they're fast, how memory layout drives everything, and when ArrayList is worse than you think.

https://www.youtube.com/watch?v=EXAMPLE

What do you want in the next episode? 👇
---`
    },
    Engaging: {
        linkedin: `EXAMPLE — Engaging LinkedIn (STUDY STRUCTURE + VOICE ONLY. Write about the actual video below, NOT about recursion):
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
        youtube: `EXAMPLE — Engaging YouTube Community (STUDY STRUCTURE ONLY — write about the actual video, not recursion):
---
New episode — and it's the one most courses get completely wrong.

Recursion. Not the factorial example you've seen a hundred times. The actual reason recursion exists and when it genuinely beats iteration.

https://www.youtube.com/watch?v=EXAMPLE

Watch the first 8 minutes. Tell me if it reframes how you think about it. 🎯
---`
    },
    Technical: {
        linkedin: `EXAMPLE — Technical LinkedIn (STUDY STRUCTURE + VOICE ONLY. Write about the actual video below, NOT about time complexity):
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
        youtube: `EXAMPLE — Technical YouTube Community (STUDY STRUCTURE ONLY — write about the actual video, not Big O):
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
// MOCK DATA (used when no API key is available)
// ============================================================================
const generateMockPosts = (videoData, tone, linkedinCount = 1, youtubeCount = 1, linkInComments = false) => {
    const title = videoData.title || 'Untitled Video';
    const topic = videoData.tags?.[0] || 'programming';
    const description = videoData.description || '';
    const descHint = description.split(/[.\n]/)[0]?.trim() || title;
    const url = videoData.url || '[link]';

    const linkedinPost = `[Note: AI generation failed — this is placeholder content]\n\nThis post is about: "${title}"\n\n${descHint}\n\nVideo: ${url}\n\n#${topic.replace(/\s+/g, '')} #Programming`;
    const youtubePost = `"${title}" is live.\n\n${descHint}\n\n${url}\n\nQuestions in the comments 👇`;

    return {
        linkedin: Array(linkedinCount).fill(null).map(() => linkedinPost),
        youtube: Array(youtubeCount).fill(null).map(() => youtubePost),
    };
};



// ============================================================================
// MAIN GENERATION FUNCTION
// ============================================================================
async function generatePostsWithGroq(videoData, tone = 'Professional', length, hashtags, historyExamples = [], linkedinCount = 1, youtubeCount = 1, model, apiKey, linkInComments = false) {
    const currentApiKey = apiKey || process.env.GROQ_API_KEY;
    const modelName = model || 'llama-3.3-70b-versatile';

    if (!currentApiKey || currentApiKey.toLowerCase().startsWith('your_')) {
        console.warn('Groq API Key missing or default. Returning mock data.');
        return generateMockPosts(videoData, tone, linkedinCount, youtubeCount, linkInComments);
    }

    try {
        const groqClient = new OpenAI({
            apiKey: currentApiKey,
            baseURL: 'https://api.groq.com/openai/v1'
        });

        const examples = FEW_SHOT_EXAMPLES[tone] || FEW_SHOT_EXAMPLES.Professional;

        const linkInstruction = linkInComments
            ? 'Do NOT put the video URL in the LinkedIn post body. End the post with "(Link in first comment 👇)" on its own line after the hashtags.'
            : `Include the video URL (${videoData.url}) in the LinkedIn post body, after the hashtags, on its own line.`;

        const platformRulesWithLink = PLATFORM_RULES.replace('{LINK_INSTRUCTION}', linkInstruction);

        let historySection = '';
        if (historyExamples && historyExamples.length > 0) {
            historySection = `
USER'S PAST POSTS — use these to match their voice and style:
${historyExamples.map((ex, i) => `[${i + 1}] (${ex.platform}): ${ex.generated_post}`).join('\n\n')}
`;
        }

        const variationInstructions = (linkedinCount > 1 || youtubeCount > 1) ? `
MULTIPLE POSTS — each one MUST use a completely different hook type and angle. No overlap:
- Post 1: Pick one of: Contrarian Truth, Bold Opinion, Specific Question
- Post 2: Pick one of: Failure Story, Numbered List Hook
- Post 3: A completely different angle from posts 1 and 2
` : '';

        const prompt = `${SYSTEM_INSTRUCTION}

${HOOK_FRAMEWORKS}

${platformRulesWithLink}

${historySection}

⚠️ IMPORTANT — READ BEFORE USING THE EXAMPLES BELOW:
The examples are about MEMORY MANAGEMENT and STACK/HEAP. That is NOT the topic of the video you are writing about.
Use the examples ONLY to understand the voice, formatting, and structure.
Do NOT reference, adapt, or mention memory management, stack frames, heap allocation, pointers, or RAM unless the actual video is about those topics.
If you write about memory management when the video is not about it, you have failed the task.

EXAMPLES — ${tone} tone (structure/voice only, ignore the topic):
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
- Be 100% about the actual video above: "${videoData.title}"
- Reference specific concepts from the title and description above
- A reader should immediately know this post is about "${videoData.title}", NOT about memory management

${variationInstructions}

GENERATE: ${linkedinCount} LinkedIn post(s) and ${youtubeCount} YouTube Community post(s).

LINKEDIN REQUIREMENTS:
- First 2 lines: must make someone feel uncomfortable NOT reading more. A specific insight, a real question, a counterintuitive truth — something that lands.
- Do NOT write "[See More]" anywhere. Ever. It should never appear in the output.
- Teach something specific from this video — not "fundamentals are important" (too vague) but the actual concept, named.
- White space between every paragraph. Short sentences or short bullet points.
- Hashtags at the very end, 3-5 max.
- ${linkInstruction}
- 1,200–1,900 characters total.

YOUTUBE COMMUNITY REQUIREMENTS:
- Always include the video URL: ${videoData.url || 'not available'}
- 80-180 words. Personal, direct.
- Ask something specific about the video content.

CRITICAL: Do NOT write "[See More]" anywhere in any post. This text should NEVER appear in the output.

Output ONLY valid JSON, no markdown:
{
    "linkedin": [${Array(linkedinCount).fill('"post text"').join(', ')}],
    "youtube": [${Array(youtubeCount).fill('"post text"').join(', ')}]
}`;

        const completion = await groqClient.chat.completions.create({
            model: modelName,
            messages: [
                { role: 'system', content: 'You are a social media copywriter for tech content creators. Output only valid JSON. Never write "[See More]" in any post.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' },
            temperature: tone === 'Technical' ? 0.5 : tone === 'Professional' ? 0.6 : 0.72,
            max_tokens: 4096
        });

        const result = JSON.parse(completion.choices[0].message.content);
        console.log('✅ Groq generation successful');
        return result;

    } catch (error) {
        console.error('Groq API Error:', error);
        console.warn('⚠️ Returning mock data due to Groq API error');
        return generateMockPosts(videoData, tone, linkedinCount, youtubeCount, linkInComments);
    }
}

module.exports = { generatePostsWithGroq };
