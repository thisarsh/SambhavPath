const searchButton = document.getElementById("search-button");
const careerInput = document.getElementById("career-input");
const roadmapOutput = document.getElementById("roadmap-output");

searchButton.addEventListener("click", async () => {
  const careerGoal = careerInput.value.trim();
  if (!careerGoal) {
    roadmapOutput.textContent = "Please enter a career goal.";
    return;
  }

  roadmapOutput.textContent = "Generating roadmap...";

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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",
        "HTTP-Referer": "https://sambhav3path.netlify.app"  // update if needed
      },
      body: JSON.stringify({
        model: "qwen/qwen2-72b-instruct",
        messages: [
          {
            role: "user",
            content: `Give me a detailed career roadmap to become a ${careerGoal}. List at least 20 steps with bullet points.`,
          },
        ],
        temperature: 0.7
      }),
    });

    const data = await response.json();

    if (response.ok && data.choices) {
      roadmapOutput.textContent = data.choices[0].message.content.trim();
    } else {
      console.error("API Error:", data);
      roadmapOutput.textContent = "Failed to fetch roadmap. Please try again.";
    }
  } catch (error) {
    console.error("Network Error:", error);
    roadmapOutput.textContent = "Failed to fetch roadmap. Please try again.";
  }
});
