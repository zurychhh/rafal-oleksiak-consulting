import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY } from '../../font-constants';

interface Citation {
  source: string;
  stat: string;
  year: string;
}

interface ResearchCitationProps {
  citations: Citation[];
}

const styles = StyleSheet.create({
  citationContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#F8F9FA',
    borderLeft: '3px solid #7B2CBF',
  },
  citationText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: '#495057',
    marginBottom: 4,
    lineHeight: 1.4,
  },
  citationSource: {
    fontWeight: 'bold',
    color: '#7B2CBF',
  },
});

export default function ResearchCitation({ citations }: ResearchCitationProps) {
  return (
    <View style={styles.citationContainer}>
      {citations.map((citation, index) => (
        <Text key={index} style={styles.citationText}>
          <Text style={styles.citationSource}>{citation.source}:</Text> {citation.stat}
        </Text>
      ))}
    </View>
  );
}
