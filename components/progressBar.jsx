import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

const CircularProgressBar = ({ 
  percentage = 0, 
  radius = 50, 
  strokeWidth = 10, 
  duration = 5000,
  color = "#00D7C3",
  delay = 0,
  max = 100,
  textColor = "white",
}) => {
  const halfCircle = radius + strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <StyledView className="justify-center items-center">
      <Svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
      >
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke="#003B45"
            strokeWidth={strokeWidth}
          />
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <StyledText 
        className={`absolute text-xl font-bold`}
        style={{ color: textColor }}
      >
        {percentage}%
      </StyledText>
    </StyledView>
  );
};

export default CircularProgressBar;