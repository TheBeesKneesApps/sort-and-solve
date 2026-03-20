import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WordTile } from './WordTile';

interface WordGridProps {
  words: string[];
  selectedWords: string[];
  hintedWord: string | null;
  shakingWords: string[];
  onWordPress: (word: string) => void;
}

export const WordGrid: React.FC<WordGridProps> = ({
  words,
  selectedWords,
  hintedWord,
  shakingWords,
  onWordPress,
}) => {
  const rows: string[][] = [];
  for (let i = 0; i < words.length; i += 4) {
    rows.push(words.slice(i, i + 4));
  }

  return (
    <View style={styles.container}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((word) => (
            <View key={word} style={styles.tileWrapper}>
              <WordTile
                word={word}
                isSelected={selectedWords.includes(word)}
                isHinted={hintedWord === word}
                isShaking={shakingWords.includes(word)}
                onPress={onWordPress}
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  tileWrapper: {
    flex: 1,
  },
});
