import {createGoogleGenerativeAI} from "@ai-sdk/google";

export const GEMINI_POWER = (apiKey:string) => 
    createGoogleGenerativeAI({apiKey})("gemini-2.0-flash-001");