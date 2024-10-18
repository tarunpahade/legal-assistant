/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";

export async function POST(request: NextRequest) {
  try {
    const { query, namespace } = await request.json();
    console.log("query", query);

    const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
      model: "text-embedding-3-small",
    });

    // Vectorize the query
    const queryEmbedding = await embeddings.embedQuery(query);

    // Initialize Pinecone client
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    // Connect to the Pinecone index
    console.log(process.env.PINECONE_API_KEY, process.env.PINECONE_INDEX);
    const index = pc.Index(process.env.PINECONE_INDEX!);

    // Query Pinecone using the vectorized query
    const airesponse = await index.namespace(namespace).query({
      topK: 2,
      vector: queryEmbedding,
      includeValues: true,
      includeMetadata: true,
    });

    const firstMatchMetadata = airesponse.matches[0].metadata!;

    const pageNumber = firstMatchMetadata["loc.pageNumber"];
    const linesFrom = firstMatchMetadata["loc.lines.from"];
    const linesTo = firstMatchMetadata["loc.lines.to"];

    // Extract relevant text from the matches
    const relevantText = airesponse.matches
      .map((match: any) => match.metadata.text)
      .join("\n\n");

    // Use ChatOpenAI to generate a response based on the retrieved documents
    const chatModel = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.7,
    });

    const response = await chatModel.call([
      {
        role: "system",
        content: "You are a helpful AI assistant knowledge about Indian law.",
      },
      {
        role: "user",
        content: `Based on the following context, answer this question: ${query}\n\nContext: ${relevantText}`,
      },
    ]);

    return NextResponse.json({
      answer: response.content,
      relevantText,
      sources: { pageNumber, linesFrom, linesTo },
    });
  } catch (error) {
    console.error("Error processing chat query:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
