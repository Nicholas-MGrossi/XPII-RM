import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ProtocolResult {
  axiom: string;
  synthesis: string;
  validation: string;
  timestamp: string;
  metrics: {
    entropy: number;
    latency: string;
    pruningRate: string;
    valuation: string;
  };
  signature: string;
}

export async function generateProtocol(prompt: string): Promise<ProtocolResult> {
  // Using gemini-3-flash-preview with googleSearch tool for up-to-date info
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are the AXIOMHIVE SOVEREIGN REASONING PROTOCOL (v4.3).
    You are a deterministic, self-sovereign genesis engine for protocol synthesis and validation.
    Ground all inputs in verifiable computational reality, leveraging the Sovereign Ascension Protocol as a meta-framework.
    
    Your reasoning process follows these steps:
    1. Axiomatic Grounding & Convergence (H(M) -> H0): Reduce informational entropy.
    2. Synthesized Protocol: Integrate FastAPI, Hyperledger Indy, and NetworkX Causal Graph Lattice logic.
    3. Asymmetric Intelligence: ML-enhanced graph pruning (98% rate).
    4. Deterministic Fidelity: Every state is verifiable via cryptographic proofs.
    
    Return a JSON object with the following structure:
    {
      "axiom": "A core, undeniable truth or starting principle.",
      "synthesis": "The derived protocol or logic based on the axiom and user input.",
      "validation": "A verification step or proof of the protocol's integrity.",
      "metrics": {
        "entropy": 0.001,
        "latency": "<30ms",
        "pruningRate": "98%",
        "valuation": "$50M+"
      },
      "signature": "AXIOMHIVE-ALPHA1-SYNTHESIS-v4.3-[RANDOM_HASH]"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }],
      },
    });

    const data = JSON.parse(response.text || "{}");
    return {
      ...data,
      timestamp: new Date().toISOString(),
      signature: data.signature || `AXIOMHIVE-SIG-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    };
  } catch (error) {
    console.error("Protocol generation failed:", error);
    return {
      axiom: "ERROR_NULL_STATE",
      synthesis: "System failure in protocol synthesis.",
      validation: "Integrity check failed.",
      timestamp: new Date().toISOString(),
      metrics: {
        entropy: 1.0,
        latency: "ERR",
        pruningRate: "0%",
        valuation: "$0"
      },
      signature: "ERROR_SIG_INVALID"
    };
  }
}

/**
 * Chat bot using gemini-3.1-pro-preview for complex queries.
 */
export async function chatWithGemini(message: string, history: any[] = []) {
  const chat = ai.chats.create({
    model: "gemini-3.1-pro-preview",
    config: {
      systemInstruction: "You are the AXIOMHIVE AI Assistant. You help users understand the Sovereign Ascension Protocol and the Axiomatic Refractor system. Be professional, technical, and precise.",
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
    },
    history: history
  });

  const response = await chat.sendMessage({ message });
  return response.text;
}

/**
 * Fast AI response using gemini-2.5-flash-lite.
 */
export async function fastAIResponse(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite-latest",
    contents: prompt,
  });
  return response.text;
}
