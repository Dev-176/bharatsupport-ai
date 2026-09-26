export type ChannelType = 'whatsapp' | 'webchat' | 'email';

export type ActionTakenType = 'AUTO_REPLY' | 'ASK_CLARIFICATION' | 'HUMAN_ESCALATION';

export type SentimentType = 'POSITIVE' | 'NEUTRAL' | 'FRUSTRATED' | 'URGENT';

export interface Citation {
  docTitle: string;
  matchedFact: string;
}

export interface EscalationDetails {
  requiresHuman: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reason: string;
  internalSummary: string;
  suggestedDraftForAgent: string;
}

export interface SalesOpportunity {
  isLead: boolean;
  interestArea: string;
  buyerIntentScore: number;
}

export interface AIResponseResult {
  detectedLanguage: string;
  detectedIntent: string;
  customerSentiment: SentimentType;
  confidenceScore: number;
  actionTaken: ActionTakenType;
  responseMessage: string;
  clarificationOptions: string[];
  citations: Citation[];
  escalationDetails: EscalationDetails;
  salesOpportunity: SalesOpportunity;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'agent';
  text: string;
  timestamp: string;
  channel: ChannelType;
  detectedLanguage?: string;
  detectedIntent?: string;
  confidenceScore?: number;
  actionTaken?: ActionTakenType;
  sentiment?: SentimentType;
  clarificationOptions?: string[];
  citations?: Citation[];
  agentName?: string;
}

export interface EscalationTicket {
  id: string;
  customerName: string;
  customerPhoneOrEmail: string;
  channel: ChannelType;
  detectedLanguage: string;
  intent: string;
  sentiment: SentimentType;
  confidenceScore: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  summary: string;
  suggestedDraft: string;
  createdAt: string;
  messages: ChatMessage[];
  assignedAgent?: string;
}

export type SalesPipelineStage = 'NEW' | 'QUALIFIED' | 'CONTACTED' | 'NEGOTIATION' | 'CONVERTED' | 'LOST';

export interface SalesLead {
  id: string;
  customerName: string;
  contact: string;
  channel: ChannelType;
  interestArea: string;
  buyerIntentScore: number;
  snippet: string;
  capturedAt: string;
  status: SalesPipelineStage;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: string;
  content: string;
  verified: boolean;
  lastUpdated: string;
}
