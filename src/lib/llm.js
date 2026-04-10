import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";

/**
 * AI Service for processing property complaints
 * Uses LangChain with Google Gemini (if API key available) or a robust simulation
 */

export const analyzeComplaint = async (text, propertyName) => {
  // 1. Try to use real AI if API key is configured
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  
  if (apiKey) {
    try {
      const model = new ChatGoogleGenerativeAI({
        modelName: "gemini-pro",
        maxOutputTokens: 2048,
        apiKey: apiKey,
      });

      const prompt = `
        Analyze the following property complaint for "${propertyName}".
        Complaint: "${text}"

        Return a JSON object with the following fields:
        - category: (String) The genre/category of the issue (e.g., Plumbing, Electrical, Noise, Security).
        - summary: (String) A quick 1-sentence summary of the complaint.
        - solutions: (Array of Strings) List of 2-3 possible actions to tackle the problem.
        - contact: (String) Contact details for the relevant department or service (e.g., "Plumbing: +91-...", "Security: ...").
        - churnRisk: (Number) A score from 0.0 to 1.0 indicating risk of tenant leaving.
        - recommendation: (String) A final recommendation for the admin.

        Do NOT include a severity score.
        Ensure the output is valid JSON.
      `;

      const response = await model.invoke([new HumanMessage(prompt)]);
      
      // Parse the JSON from the text response
      // Handle potential markdown code blocks in response
      let cleanText = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanText);

    } catch (error) {
      console.warn("AI API Call failed, falling back to simulation:", error);
    }
  }

  // 2. Fallback Simulation (if no key or error)
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

  const lowerText = text.toLowerCase();
  let category = "General Maintenance";
  let churnRisk = 0.1;
  let summary = "Resident reported a general maintenance issue.";
  let solutions = ["Inspect the property", "Contact tenant for more details"];
  let contact = "Property Manager: +91-98765-43210";
  let recommendation = "Monitor the situation and follow up.";

  // Logic simulation
  if (lowerText.includes('water') || lowerText.includes('leak') || lowerText.includes('flood')) {
    category = "Plumbing";
    churnRisk = 0.75;
    summary = "Urgent water leakage or flooding reported.";
    solutions = ["Shut off main water valve", "Dispatch emergency plumber", "Assess water damage"];
    contact = "Emergency Plumbing: +91-98765-11111";
    recommendation = "IMMEDIATE ACTION REQUIRED: Dispatch plumber now.";
  } else if (lowerText.includes('electricity') || lowerText.includes('power') || lowerText.includes('outage')) {
    category = "Electrical";
    churnRisk = 0.85;
    summary = "Power outage or electrical failure.";
    solutions = ["Check circuit breakers", "Contact power utility", "Inspect wiring if localized"];
    contact = "Power Grid Support: +91-98765-22222";
    recommendation = "High priority: Ensure tenant safety and restore power.";
  } else if (lowerText.includes('noise') || lowerText.includes('neighbor') || lowerText.includes('party')) {
    category = "Disturbance";
    churnRisk = 0.4;
    summary = "Noise complaint regarding neighbors.";
    solutions = ["Send warning notice to offending unit", "Mediate between residents", "Check noise regulations"];
    contact = "Building Security: +91-98765-33333";
    recommendation = "Log incident and issue a formal warning if repeated.";
  } else if (lowerText.includes('internet') || lowerText.includes('wifi')) {
    category = "Connectivity";
    churnRisk = 0.5;
    summary = "Internet connectivity issues.";
    solutions = ["Restart building router", "Contact ISP", "Check signal strength"];
    contact = "ISP Support: +91-98765-44444";
    recommendation = "Tech support needed; verify if building-wide issue.";
  } else if (lowerText.includes('clean') || lowerText.includes('dirty') || lowerText.includes('pest') || lowerText.includes('trash')) {
    category = "Hygiene";
    churnRisk = 0.6;
    summary = "Cleanliness or pest issue reported.";
    solutions = ["Schedule deep cleaning", "Call pest control", "Inspect common areas"];
    contact = "Housekeeping: +91-98765-55555";
    recommendation = "Schedule cleaning service and apologize to tenant.";
  } else if (lowerText.includes('security') || lowerText.includes('theft') || lowerText.includes('lock')) {
    category = "Security";
    churnRisk = 0.9;
    summary = "Security concern or lock issue.";
    solutions = ["Dispatch security guard", "Repair/Change locks", "Review CCTV footage"];
    contact = "Head of Security: +91-98765-99999";
    recommendation = "Urgent: Ensure resident feels safe immediately.";
  }

  return {
    category,
    summary,
    solutions,
    contact,
    churnRisk: Math.min(1, Math.max(0, churnRisk + (Math.random() * 0.1 - 0.05))), // Add variance
    recommendation
  };
};
