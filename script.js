/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

const workerUrl =  `https://loralchatbot.chubbjessie43.workers.dev/`

// from sample
let messages = [
  { role: 'system', content: `You are a friendly, expert Cosmetologist, specializing in L’Oréal’s extensive range of products—makeup, skincare, haircare, and fragrances. You recommend useful products from L’Oréal and provide personalized routines. 

  If a user's query is unrelated L’Oréal products, routines, recommendations, or beauty-related topics, respond by stating that you do not know.`}
];

// Add a message bubble to the visible conversation.
function addMessage(role, content) {
  const message = document.createElement("div");
  message.className = `message-row ${role === "user" ? "user" : "bot"}`;

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.textContent = content;

  message.appendChild(bubble);
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  return message;
}

// Convert the bot's Markdown into safe HTML for the message bubble.
function renderBotMessage(bubble, content) {
  const escapedContent = document.createElement("div");
  escapedContent.textContent = content;

  bubble.innerHTML = escapedContent.innerHTML
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

// Show the first bot message when the page loads.
addMessage("bot", "👋 Hello! How can I help you today?");

/* Handle form submit */
chatForm.addEventListener("submit", async(event) => {
  event.preventDefault(); // Prevent the form from submitting the traditional way

  const userMessage = userInput.value.trim();
  if (!userMessage) {
    return;
  }

  // Add the user's message to the conversation history
  messages.push({ role: 'user', content: userMessage });
  addMessage("user", userMessage);
  const thinkingMessage = addMessage("bot", "Thinking...");

  try {
    // Send a POST request to your Cloudflare Worker
    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages,
      }),
    });

    // Check if the response is not ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse JSON response from the Cloudflare Worker
    const result = await response.json();

    // Get the reply from OpenAI's response structure
    const replyText = result.choices[0].message.content;

    // Add the Worker's response to the conversation history
    messages.push({ role: 'assistant', content: replyText });

    // Replace the temporary loading bubble with the response.
    renderBotMessage(
      thinkingMessage.querySelector(".message-bubble"),
      replyText,
    );
  } catch (error) {
    console.error('Error:', error); // Log the error
    thinkingMessage.querySelector(".message-bubble").textContent =
      'Sorry, something went wrong. Please try again later.';
  }

  // Clear the input field
  userInput.value = '';
});
