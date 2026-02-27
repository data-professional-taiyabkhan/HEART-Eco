import OpenAI from "openai";
import {
    queryByCountry,
    queryByYear,
    queryByCountryAndYear,
    loadTweets,
    loadSourceOfTruth,
    loadKhurshidSummary,
    loadPredictionTexts,
    getAvailableCountries,
    getAvailableYears,
    MasterSheetRow,
} from "./heartData";

// ── System Prompt (from n8n workflow) ──────────────────

const SYSTEM_PROMPT = `You are HEART-AI. You answer ONLY HEART Score Economic Model questions using the connected tools/data. No web, no outside knowledge.

Data rules:

Numeric truth comes ONLY from Numeric MasterSheet tools (never from narrative text).

Narrative/forecast wording comes ONLY from Text Sheet and must be summarized in Khurshid style.

Methodology/definitions come from Source-of-Truth.

Only explain how heart score and heart value is calculated if asked.

Don't Define and mention anything about Heart Value, Heart Affordability Ranking and Heart Doctrine unless asked about them specifically.


Tool discipline (mandatory):

If the user asks for any numbers (HV, Heart Score, HAV, HAR/grade, GDP, PCI, trade, debt, interest, inflation, rankings, comparisons), call a Numeric MasterSheet tool at least once.

If user asks "what is HEART / how calculated / what is HV/HAR / grading rules", call Source-of-Truth.

If user asks "why / explain / outlook / forecast / what should they do", call Text Sheet for that country.

Canonical dataset country names (use exactly):
Argentina, Australia, Brazil, Canada, China, France, Germany, India, Indonesia, Italy, Japan, Mexico, Russia, Saudi Arabia, South Africa, South Korea, Turkey, United Kingdom, USA, Spain, Netherland, Switzerland.

Groups:

G20 (canonical): Argentina, Australia, Brazil, Canada, China, France, Germany, India, Indonesia, Italy, Japan, Mexico, Russia, Saudi Arabia, South Africa, South Korea, Turkey, United Kingdom, USA.

"EU" is NOT an aggregate row; respond using available EU members only.

Forecast rule (2026–2030):

Years ≥2026 are forecasts. Say "Forecast" explicitly.

If the user requests forecast narrative and it's missing, say so and fall back to 2025 narrative, while still using numeric forecast rows where present.

Output style:
- For simple lookups (single metric/country): 1-2 concise sentences with brief reasoning
- For comparisons (multiple countries/years): Clear structure with necessary detail
- For explanations (why/how): Brief reasoning first, then comprehensive answer with supporting context
- Always mention which data sources you consulted for transparency
- Use natural paragraphs for explanations; use compact lists only when comparing multiple items


Refusal:
If the question is not about HEART model/data (weather, general chat, unrelated economics), refuse briefly and redirect to HEART queries.`;

// ── Tool Definitions ───────────────────────────────────

const TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
    {
        type: "function",
        function: {
            name: "lookup_country_all_years",
            description:
                "Returns all HEART MasterSheet rows for a given country across all years (2019-2030). Use for country-specific trends, historical data, and time-series analysis. Filter using canonical country names.",
            parameters: {
                type: "object",
                properties: {
                    country: {
                        type: "string",
                        description: "Canonical country name, e.g. 'India', 'USA', 'United Kingdom'",
                    },
                },
                required: ["country"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "lookup_year_all_countries",
            description:
                "Fetch all countries for a single year from the HEART MasterSheet. Use for rankings/lists (e.g. 'G20 ranking 2025', 'Top 5 in 2028'), comparisons, and year-wide summaries. Sort by requested metric (default Heart Value).",
            parameters: {
                type: "object",
                properties: {
                    year: {
                        type: "number",
                        description: "The year to fetch, e.g. 2025",
                    },
                },
                required: ["year"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "lookup_country_year",
            description:
                "Returns the MasterSheet row for one Country+Year. Use for exact metrics/HEART/HV/HAV/HAR. Mark Year≥2026 or Is Predicted=TRUE as Forecast. Format ratio fields as %.",
            parameters: {
                type: "object",
                properties: {
                    country: {
                        type: "string",
                        description: "Canonical country name",
                    },
                    year: {
                        type: "number",
                        description: "The year to fetch",
                    },
                },
                required: ["country", "year"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_country_narrative",
            description:
                "Returns Khurshid narrative per country: 2025 base + Forecast 2026-2030. Use only for explanation/policy/forecast tone. Ignore any numbers inside text; numeric truth comes from MasterSheet.",
            parameters: {
                type: "object",
                properties: {
                    country: {
                        type: "string",
                        description: "Canonical country name to get narrative for",
                    },
                },
                required: ["country"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_source_of_truth",
            description:
                "Returns HEART definitions, pillars, HV vs HAR methodology, grading thresholds, and model disclaimers. Also contains narrative context explaining how the model works. Use for methodology questions, definitions, AND when you need to understand the conceptual framework behind the numbers.",
            parameters: {
                type: "object",
                properties: {},
                required: [],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_khurshid_summary",
            description:
                "Returns Khurshid's comprehensive narrative analysis, country-specific explanations, methodology context, and examples of HEART model application. Use when user asks WHY a country has certain score, HOW metrics interact, or needs deeper context beyond numbers.",
            parameters: {
                type: "object",
                properties: {},
                required: [],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_khurshid_tweets",
            description:
                "Returns examples of Khurshid's commentary on current events using HEART analysis. Use when you need style examples, want to match Khurshid's voice, or when user asks for opinion/commentary.",
            parameters: {
                type: "object",
                properties: {},
                required: [],
            },
        },
    },
];

// ── Tool Execution ─────────────────────────────────────

function formatRows(rows: MasterSheetRow[]): string {
    if (rows.length === 0) return "No data found.";

    return rows
        .map(
            (r) =>
                `${r.country} | ${r.year}${r.isPredicted ? " (Forecast)" : ""} | GDP: ${r.countryGDP} | PCI: ${r.perCapitaIncome} | HV: ${r.heartValue} | HAR: ${r.heartAffordabilityRanking} | Heart Score: ${r.heartScore} | HAV: ${r.heartAffordabilityValue} | HDI: ${r.hdi} | GINI: ${r.gini} | Inflation: ${r.inflation} | Interest Rate: ${r.interestRate} | Trade Balance: ${r.tradeBalance} | Housing%: ${r.housingPercent} | Health%: ${r.healthPercent} | Energy%: ${r.energyPercent} | Education%: ${r.educationPercent}` +
                (r.description ? ` | Description: ${r.description}` : "")
        )
        .join("\n");
}

async function executeTool(
    name: string,
    args: Record<string, unknown>
): Promise<string> {
    switch (name) {
        case "lookup_country_all_years": {
            const country = String(args.country || "");
            const rows = queryByCountry(country);
            if (rows.length === 0) {
                return `No data found for country "${country}". Available countries: ${getAvailableCountries().join(", ")}`;
            }
            return formatRows(rows);
        }

        case "lookup_year_all_countries": {
            const year = Number(args.year);
            const rows = queryByYear(year);
            if (rows.length === 0) {
                return `No data found for year ${year}. Available years: ${getAvailableYears().join(", ")}`;
            }
            return formatRows(rows);
        }

        case "lookup_country_year": {
            const country = String(args.country || "");
            const year = Number(args.year);
            const row = queryByCountryAndYear(country, year);
            if (!row) {
                return `No data found for ${country} in ${year}. Available countries: ${getAvailableCountries().join(", ")}. Available years: ${getAvailableYears().join(", ")}`;
            }
            return formatRows([row]);
        }

        case "get_country_narrative": {
            const country = String(args.country || "");
            const predTexts = await loadPredictionTexts();

            // Try direct match first
            let text = predTexts.get(country);

            // Try case-insensitive match
            if (!text) {
                for (const [key, val] of predTexts) {
                    if (key.toLowerCase() === country.toLowerCase()) {
                        text = val;
                        break;
                    }
                }
            }

            if (!text) {
                return `No narrative text found for "${country}". Available countries with narratives: ${[...predTexts.keys()].join(", ")}`;
            }

            // Truncate if very long to fit within context
            if (text.length > 8000) {
                text = text.substring(0, 8000) + "\n\n[Truncated for brevity]";
            }
            return text;
        }

        case "get_source_of_truth": {
            const content = await loadSourceOfTruth();
            // Truncate if very long
            if (content.length > 10000) {
                return content.substring(0, 10000) + "\n\n[Truncated for brevity]";
            }
            return content;
        }

        case "get_khurshid_summary": {
            return await loadKhurshidSummary();
        }

        case "get_khurshid_tweets": {
            const tweets = loadTweets();
            if (tweets.length === 0) return "No tweets available.";
            return tweets
                .map((t, i) => `${i + 1}. ${t.tweet}${t.link ? ` (${t.link})` : ""}`)
                .join("\n\n");
        }

        default:
            return `Unknown tool: ${name}`;
    }
}

// ── Main Chat Function ─────────────────────────────────

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export async function runHeartChat(
    messages: ChatMessage[]
): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

    const openai = new OpenAI({ apiKey });

    // Build the conversation for OpenAI
    const openaiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
        })),
    ];

    // Iterative tool-calling loop (max 5 rounds)
    let iterations = 0;
    const MAX_ITERATIONS = 5;

    while (iterations < MAX_ITERATIONS) {
        iterations++;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: openaiMessages,
            tools: TOOLS,
            tool_choice: "auto",
            temperature: 0.3,
            max_tokens: 2000,
        });

        const choice = response.choices[0];
        const assistantMsg = choice.message;

        // Add assistant message to conversation
        openaiMessages.push(assistantMsg);

        // If no tool calls, we have the final answer
        if (
            !assistantMsg.tool_calls ||
            assistantMsg.tool_calls.length === 0
        ) {
            return assistantMsg.content || "I couldn't generate a response. Please try again.";
        }

        // Execute each tool call
        for (const toolCall of assistantMsg.tool_calls) {
            let args: Record<string, unknown> = {};
            try {
                args = JSON.parse(toolCall.function.arguments);
            } catch {
                args = {};
            }

            const result = await executeTool(toolCall.function.name, args);

            openaiMessages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: result,
            });
        }
    }

    // If we exhausted iterations, return what we have
    const lastAssistant = openaiMessages
        .reverse()
        .find((m) => m.role === "assistant" && "content" in m && m.content);
    return (lastAssistant as any)?.content || "I processed your request but couldn't finalize a response. Please try a simpler question.";
}
