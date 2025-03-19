import {createGoogleGenerativeAI} from "@ai-sdk/google";
import { EngagementMetricsSchema } from "../schema/twitterPostMetrics";
import { generateObject, LanguageModel } from "ai";

export const GEMINI_POWER = (apiKey:string) => 
    createGoogleGenerativeAI({apiKey})("gemini-2.0-flash-001") as LanguageModel;

export const analyzePost = async (post: string, key:string) => {
    const gemini = GEMINI_POWER(key);
    const prompt = `
    Here are the text elements from puppeteer:
    ${post}
    
    Please extract the following information from the post:
    number of views
    number of replies
    number of reposts
    number of likes
    number of bookmarks`;
    const res = await generateObject({model: gemini, prompt, schema: EngagementMetricsSchema})
    return res.object;
}