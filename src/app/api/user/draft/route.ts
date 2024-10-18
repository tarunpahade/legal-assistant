/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";

export async function POST(request: NextRequest) {
  try {
    const { prompt,template } = await request.json();
    console.log("query", prompt);



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
        content: `Based on the following context, Draft a : ${template}\n\nContext: ${prompt}`,
      },
    ]);
    console.log(response.content);
    

    return NextResponse.json({
      answer: response.content,
    });
  } catch (error) {
    console.error("Error processing chat query:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
