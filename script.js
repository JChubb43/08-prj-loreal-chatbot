/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

/* Handle form submit */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // When using Cloudflare, you'll need to POST a `messages` array in the body,
  // and handle the response using: data.choices[0].message.content

  // Show message
  chatWindow.innerHTML = "Connect to the OpenAI API for a response!";
});

async function fetchRequest() {
  // Send a POST request to the OpenAI API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST', // We are POST-ing data to the API
    headers: {
      'Content-Type': 'application/json', // Set the content type to JSON
      'Authorization': `Bearer ${apiKey}` // Include the API key for authorization
    },
    // Send model details and system message
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: `You are a shopping assistant for TechNest, a site that helps users find the best gadgets and smart home devices. You provide expert recommendations based on the user's needs, preferences, and budget, keeping responses clear, helpful, and friendly.` },
        { role: 'user', content: 'I am looking for a smart speaker that works well with both Apple and Android devices, has great sound quality, and can control smart home devices. My budget is around $200. What do you recommend?' }
      ]
    })
  });
  // Parse and store the response data
  const result = await response.json();
  // Log result to the console
  console.log(result.choices[0].message.content);
};