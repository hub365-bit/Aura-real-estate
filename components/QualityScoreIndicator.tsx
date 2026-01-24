import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { QualityScore } from '@/types';

interface QualityScoreIndicatorProps {
  qualityScore: QualityScore;
  compact?: boolean;
}

export function QualityScoreIndicator({ qualityScore, compact = false }: QualityScoreIndicatorProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };
  
  const color = getScoreColor(qualityScore.overall);
  
  if (compact) {
    return (
      <View style={[styles.compactContainer, { backgroundColor: color + '15' }]}>
        <Text style={[styles.compactScore, { color }]}>
          {Math.round(qualityScore.overall)}
        </Text>
        <Text style={[styles.compactLabel, { color }]}>Quality</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Listing Quality</Text>
        <Text style={[styles.overallScore, { color }]}>
          {Math.round(qualityScore.overall)}/100
        </Text>
      </View>
      
      <View style={styles.breakdown}>
        <ScoreBar label="Photos" score={qualityScore.photoQuality} />
        <ScoreBar label="Description" score={qualityScore.descriptionCompleteness} />
        <ScoreBar label="Response Speed" score={qualityScore.responseSpeed} />
        <ScoreBar label="Reviews" score={qualityScore.reviewScore} />
      </View>
      
      {qualityScore.suggestions.length > 0 && (
        <View style={styles.suggestions}>
          <Text style={styles.suggestionsTitle}>Recommendations:</Text>
          {qualityScore.suggestions.map((suggestion, index) => (
            <Text key={index} style={styles.suggestion}>
              • {suggestion}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444';
  
  return (
    <View style={styles.scoreBar}>
      <Text style={styles.scoreLabel}>{label}</Text>
      <View style={styles.barContainer}>
        <View style={[styles.barFill, { width: `${score}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.scoreValue}>{Math.round(score)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1F2937',
  },
  overallScore: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  breakdown: {
    gap: 12,
  },
  scoreBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreLabel: {
    fontSize: 13,
    color: '#6B7280',
    width: 100,
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreValue: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#1F2937',
    width: 30,
    textAlign: 'right',
  },
  suggestions: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1F2937',
    marginBottom: 8,
  },
  suggestion: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  compactScore: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  compactLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
});
