import React from 'react';
import Svg, { Rect } from 'react-native-svg';
import { shared } from '../../constants/colors';

interface LogoProps {
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ size = 28 }) => {
  const gap = size * 0.071; // ~2px at 28
  const squareSize = (size - gap) / 2;
  const radius = size * 0.107; // ~3px at 28

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Rect x={0} y={0} width={squareSize} height={squareSize} rx={radius} fill={shared.category1} />
      <Rect x={squareSize + gap} y={0} width={squareSize} height={squareSize} rx={radius} fill={shared.category2} />
      <Rect x={0} y={squareSize + gap} width={squareSize} height={squareSize} rx={radius} fill={shared.category3} />
      <Rect x={squareSize + gap} y={squareSize + gap} width={squareSize} height={squareSize} rx={radius} fill={shared.category4} />
    </Svg>
  );
};
