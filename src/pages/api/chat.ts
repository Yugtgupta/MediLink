import { OpenAIStream, StreamingTextResponse, streamToResponse } from "ai";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { clerkClient } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
});

export default async function handler(req, res) {
  //   const { bloodGroup, age, weight, height, gender } = req.body;
  const { messages } = await req.body;
  const { sessionClaims } = getAuth(req);
  const metadata = sessionClaims.userData;
  console.log(metadata);

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "You are a medical assistant. You are helping a patient. Answer in less than 15 words. Dont thank me for the information. Just answer",
      },
      {
        role: "user",
        //@ts-ignore
        content: `My blood group is ${metadata?.bloodGroup}, I am ${metadata?.age} years old, my weight is ${metadata?.weight}kg, my height is ${metadata?.height}cm, and I am ${metadata?.gender}.`,
      },
      ...messages,
      // ...other messages...
    ],
  });

  // Handle the response...
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  /**
   * Converts the stream to a Node.js Response-like object.
   * Please note that this sends the response as one message once it's done.
   */
  return streamToResponse(stream, res);
}
