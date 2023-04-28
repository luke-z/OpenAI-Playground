import { YoutubeTranscript } from "youtube-transcript";
import { Configuration, OpenAIApi } from "openai";

import * as dotenv from "dotenv";
dotenv.config();

const main = async () => {
  const transcript = await YoutubeTranscript.fetchTranscript("pwHrxxnJNpM");

  const transcriptText = transcript.map((t) => t.text).join(" ");

  const tokens = transcriptText.length / 4;
  console.log(`Token count: ${tokens}`);

  if (tokens > 4096) {
    console.log("Text too long for gpt");
    return;
  }
  if (tokens > 1024) {
    console.log("Text too expensive :D");
    return;
  }

  const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Summarize the following text: ${transcriptText}`,
      },
    ],
  });

  console.log(completion.data.choices[0].message.content);
};

main();
