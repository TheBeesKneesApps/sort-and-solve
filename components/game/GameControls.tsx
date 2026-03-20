import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../common/Button';

interface GameControlsProps {
  selectedCount: number;
  onShuffle: () => void;
  onDeselect: () => void;
  onSubmit: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  selectedCount,
  onShuffle,
  onDeselect,
  onSubmit,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        <Button label="Shuffle" onPress={onShuffle} small />
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          label="Deselect"
          onPress={onDeselect}
          small
          disabled={selectedCount === 0}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          label="Submit"
          onPress={onSubmit}
          small
          primary
          disabled={selectedCount !== 4}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  buttonWrapper: {
    flex: 1,
  },
});
