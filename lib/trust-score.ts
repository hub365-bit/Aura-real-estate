import { TrustScore, TrustLevel } from '@/types';

export function getTrustLevelColor(level: TrustLevel): string {
  switch (level) {
    case 'verified':
      return '#10B981';
    case 'building':
      return '#F59E0B';
    case 'restricted':
      return '#EF4444';
  }
}

export function getTrustLevelLabel(level: TrustLevel): string {
  switch (level) {
    case 'verified':
      return 'Verified';
    case 'building':
      return 'Building Reputation';
    case 'restricted':
      return 'Restricted';
  }
}

export function getTrustLevelIcon(level: TrustLevel): string {
  switch (level) {
    case 'verified':
      return '🟢';
    case 'building':
      return '🟡';
    case 'restricted':
      return '🔴';
  }
}

export function canBoostProperty(trustScore?: TrustScore): boolean {
  if (!trustScore) return false;
  return trustScore.level === 'verified' || trustScore.score >= 50;
}

export function canAccessPremiumFeatures(trustScore?: TrustScore): boolean {
  if (!trustScore) return false;
  return trustScore.level === 'verified';
}

export function getTrustScoreRecommendations(trustScore: TrustScore): string[] {
  const recommendations: string[] = [];
  
  if (!trustScore.verifiedId) {
    recommendations.push('Complete ID verification to boost your trust score');
  }
  
  if (!trustScore.verifiedBusiness && trustScore.verifiedId) {
    recommendations.push('Verify your business documents');
  }
  
  if (trustScore.completedBookings < 5) {
    recommendations.push('Complete more bookings to build reputation');
  }
  
  if (trustScore.avgResponseTime > 30) {
    recommendations.push('Improve response time to inquiries');
  }
  
  if (trustScore.cancellationRate > 0.15) {
    recommendations.push('Reduce cancellation rate');
  }
  
  if (trustScore.disputeCount > 0) {
    recommendations.push('Resolve outstanding disputes');
  }
  
  return recommendations;
}
