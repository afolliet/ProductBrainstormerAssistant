export interface Persona {
  name: string;
  demographics: string;
  occupation: string;
  interests: string[];
  painPoints: string[];
  goals: string[];
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface VisualDescriptions {
  billboard: string;
  newspaper: string;
  socialMedia: string;
  websiteBanner: string;
  packaging: string;
}

export interface BrandPackage {
  positioningStatement: string;
  targetAudience: Persona;
  marketingStrategies: string[];
  influencerRecommendations: string[];
  contentIdeas: string[];
  swot: SWOT;
  visualDescriptions: VisualDescriptions;
}
