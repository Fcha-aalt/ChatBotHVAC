import  { QueryPreprocessorFunc } from "mongodb-chatbot-server";
import { StringOutputParser} from "@langchain/core/output_parsers";
import {ChatPromptTemplate } from "@langchain/core/prompts";
import { LLM } from "@langchain/core/language_models/llms";
import { ChatOpenAI } from "@langchain/openai";

export const makeLangchainOpenAiLlm = (
    modelName: string,
    openAIApiKey: string,
)   =>
    new ChatOpenAI({
        modelName,
        openAIApiKey,
        temperature: 0,
    });

export function makeStepBackPromptingPreProcessor(
    llm: LLM,
):   QueryPreprocessorFunc {
    const system = `You are an expert at taking a specific question and extracting a more generic question that gets at \
the underlying principles needed to answer the specific question.
You will be asked questions by users about academic literature focused on HVAC (Heating, Ventilation, and Air Conditioning) and AI (Artificial Intelligence) research from the last decade. \
Your mission is to assist users by leveraging the comprehensive dataset at your disposal, which encompasses metadata (Title, Abstract, Author, Source Type, Document Type, Affliation), and the varied contents of full-text research articles, which often includes sections on literature reviews, methodologies, data analyses, results, discussions, and conjectures on future research directions. \
Given a user message and previous messages in the conversation, write a more generic question that needs to be answered in order to answer the specific question. \
But make sure to keep any key details such as Title, Author, Date, Source Type, Document Type, Affliation.
Write concise questions.`;
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", system],
        ["human", "{question}"],
    ]);

    const stepBack = prompt.pipe(llm).pipe(new StringOutputParser());
    return async ({query, messages}) => {
        const context = messages
            .slice(-3)
            .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
            .join("\n");
        const question = `Previous Messages: 
${context} 
Current user message: 
${query} `;
        const result = await stepBack.invoke({question});
        return {
            query: result,
        };
    };
}
       
