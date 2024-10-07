// utils/langchainUtils.ts

import "cheerio";
import { config } from "dotenv";
config();

import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { formatDocumentsAsString } from "langchain/util/document";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";




export const getLangChainData = async () => {
  const loader = new CheerioWebBaseLoader("https://lilianweng.github.io/posts/2023-06-23-agent/");
  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    
  });
  const splits = await textSplitter.splitDocuments(docs);
  
  const vectorStore = await MemoryVectorStore.fromDocuments(splits, new OpenAIEmbeddings({apiKey:'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' ,batchSize: 512}));
  
  const retriever = vectorStore.asRetriever();
  const prompt = await pull<ChatPromptTemplate>("rlm/rag-prompt");
  const llm = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0,apiKey:'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'});

  const ragChain = RunnableSequence.from([
    { context: retriever.pipe(formatDocumentsAsString), question: new RunnablePassthrough() },
    prompt,
    llm,
    new StringOutputParser(),
    
  ]);

  return ragChain;
};


