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

    - number of views
    - number of replies
    - number of reposts
    - number of likes
    - number of bookmarks

    For example:
    Holger Zschaepitz @Schuldensuehner Just to put things into perspective: 
    The S&P 500 may have hit a new ATH today, but if you put the index in relation 
    to the Fed's balance sheet, it is trading at the same level as in 2008, 
    so equities have traded sideways since 2008, basically counteracting 
    balance sheet expansion 3:48 PM · Apr 5, 2021 175 1K 3K 257 Read 175 replies
    Would yield:
    {
        views: null,
        replies: 175,
        reposts: 1000
        likes: 3000,
        bookmarks: 257,
        
    }
    Views are optional, so if they are not present, set them to null
    
    "Crypto Verse @CryptoVerse_Co BNB Market Cap Surges to $101 Billion in Q4 2024, 
    Marking 114% YoY Growth In Q4 2024, @BNBCHAIN demonstrated remarkable growth, 
    achieving a market capitalization of over $101 billion—an impressive 114% year-over-year increase 
    and a 22% rise compared to the previous quarter, according to @MessariCrypto 's latest report. 
    This surge underscores BNB's significant market presence and the ongoing strength of the cryptocurrency industry, 
    even amid shifting global financial landscapes. The rise aligns with broader crypto market trends following 
    Donald Trump's reelection, which spurred increased market activity and investor confidence. 
    @Binance CEO @_RichardTeng emphasized BNB's strategic role within the Binance ecosystem, 
    attributing its sustained growth to continued utility expansion and strong community support. 
    As the crypto market evolves, BNB remains a pivotal asset, reflecting investor confidence and solidifying its position as a leading cryptocurrency. 
    For more insights and detailed analysis, visit http://messari.io/report/state-of-bnb-q4-2024… BNB Chain and 3 others 1:36 PM · 
    Feb 17, 2025 · 44.9K Views 20 102 336 Read 20 replies"
    Would yield:
    {
        views: 44900,
        replies: 20,
        reposts: 102,
        likes: 336,
        bookmarks: null
    }
    bookmarks are optional, so if they are not present, set them to null
    `;
    const res = await generateObject({model: gemini, prompt, schema: EngagementMetricsSchema})
    return res.object;
}