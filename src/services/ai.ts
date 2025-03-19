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
    number of replies
    number of reposts
    number of likes
    number of bookmarks
    For example:
    Holger Zschaepitz @Schuldensuehner Just to put things into perspective: 
    The S&P 500 may have hit a new ATH today, but if you put the index in relation 
    to the Fed's balance sheet, it is trading at the same level as in 2008, 
    so equities have traded sideways since 2008, basically counteracting 
    balance sheet expansion 3:48 PM · Apr 5, 2021 175 1K 3K 257 Read 175 replies
    Would yield:
    {
        replies: 175,
        lieks: 3000,
        bookmarks: 257,
        reposts: 1000
    }
    bookmarks are optional, so if they are not present, set them to null`;
    const res = await generateObject({model: gemini, prompt, schema: EngagementMetricsSchema})
    return res.object;
}