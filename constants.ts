import { KnowledgeBase } from './types';

// This dataset can be replaced with any structured data for "Grounding" the chatbot.
// The chatbot will use this for specific queries but will handle general chat otherwise.
export const APP_DATASET: KnowledgeBase = {
  productName: "kiyotoX",
  version: "Mk. IV (Class: Explorer)",
  description: "Advanced deep-space exploration vessel equipped with the latest hyper-drive technology and AI companionship modules.",
  stats: [
    { name: 'Fuel Cells', value: 87, unit: '%', fullMark: 100 },
    { name: 'Shield Integrity', value: 100, unit: '%', fullMark: 100 },
    { name: 'Oxygen', value: 95, unit: '%', fullMark: 100 },
    { name: 'Warp Core', value: 42, unit: 'TB/s', fullMark: 100 },
    { name: 'Hull Health', value: 98, unit: '%', fullMark: 100 },
  ],
  features: {
    "Hyper-Drive": "Capable of jumping between star systems in microseconds using dimension folding.",
    "Nano-Repair": "Automated hull repair using nanobots deployed from the outer shell.",
    "StellarMap": "Real-time holographic mapping of the known universe with hazard detection.",
    "GalacticTranslator": "Universal translator for over 6 million forms of communication."
  },
  troubleshooting: [
    {
      problem: "Warp drive refuses to engage.",
      solution: "Ensure the navigation computer has a locked trajectory. If 'Nav-Lock' is red, recalibrate the star sensors."
    },
    {
      problem: "Artificial Gravity fluctuating.",
      solution: "Check the rotational stabilizers in Sector 4. Usually requires a manual reset of the gyros."
    },
    {
      problem: "Food synthesizer tastes bland.",
      solution: "Replace the flavor cartridge 'Pack C'. It likely ran out of salt reserves."
    }
  ],
  faq: [
    {
      question: "How fast is the ship?",
      answer: "The Orion Starliner travels at Factor 9.8 Warp, capable of crossing the quadrant in 2 weeks."
    },
    {
      question: "Can I pilot manually?",
      answer: "Manual piloting is available but not recommended during Warp. Switch to 'Manual Mode' on the console for sub-light travel."
    },
    {
      question: "What is the mission duration?",
      answer: "The Orion Starliner is designed for indefinite autonomous operation, but standard mission cycles are 5 years."
    }
  ]
};

export const INITIAL_MESSAGE = `Greetings! I am the AI interface for the ${APP_DATASET.productName}. 
I can provide status reports, troubleshoot ship systems, or just chat about the universe. 
How can I assist you today?`;
