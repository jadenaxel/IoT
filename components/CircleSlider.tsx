import React, { useState } from "react";
import { View, PanResponder, StyleSheet, ViewStyle } from "react-native";
import Svg, { Path, Circle, Text as SvgText } from "react-native-svg";

interface ArcSliderProps {
	radius?: number;
	min?: number;
	max?: number;
	initialValue?: number;
	strokeWidth?: number;
	color?: string;
	backgroundColor?: string;
	onChange?: (value: number) => void;
	style?: ViewStyle;
	// Arc specific props
	startAngle?: number;
	endAngle?: number;
	children?: React.ReactNode;
}

interface PolarCoordinate {
	x: number;
	y: number;
}

const ArcSlider: React.FC<ArcSliderProps> = ({
	radius = 130,
	min = 0,
	max = 100,
	initialValue = 50,
	strokeWidth = 20,
	color = "#2563eb",
	backgroundColor = "#E5E7EB",
	onChange = () => {},
	style,
	startAngle = -90, // Start from bottom left
	endAngle = 90, // End at bottom right
	children,
}) => {
	const [value, setValue] = useState<number>(initialValue);

	const center = radius + strokeWidth;
	const viewBoxSize = center * 2;

	// Convert value to angle within the arc range
	const valueToAngle = (value: number): number => {
		const percentage = (value - min) / (max - min);
		return startAngle + percentage * (endAngle - startAngle);
	};

	// Convert angle to value within the min/max range
	const angleToValue = (angle: number): number => {
		const normalizedAngle = angle - startAngle;
		const normalizedRange = endAngle - startAngle;
		const percentage = normalizedAngle / normalizedRange;
		return min + percentage * (max - min);
	};

	const currentAngle = valueToAngle(value);

	// Helper function to convert polar coordinates to cartesian
	const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number): PolarCoordinate => {
		const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
		return {
			x: centerX + radius * Math.cos(angleInRadians),
			y: centerY + radius * Math.sin(angleInRadians),
		};
	};

	// Calculate arc path
	const getArcPath = (startAngleArg: number, endAngleArg: number): string => {
		const start = polarToCartesian(center, center, radius, endAngleArg);
		const end = polarToCartesian(center, center, radius, startAngleArg);
		const largeArcFlag = Math.abs(endAngleArg - startAngleArg) <= 180 ? "0" : "1";

		return `
      M ${start.x} ${start.y}
      A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}
    `;
	};

	// Handle gestures with PanResponder
	const panResponder = PanResponder.create({
		onStartShouldSetPanResponder: () => true,
		onMoveShouldSetPanResponder: () => true,
		onPanResponderMove: (evt) => {
			const { locationX, locationY } = evt.nativeEvent;

			// Calculate angle based on touch position relative to center
			const x = locationX - center;
			const y = locationY - center;

			let angle = (Math.atan2(y, x) * 180) / Math.PI + 90;

			// Normalize angle to match our arc range
			while (angle < startAngle) angle += 360;
			while (angle > endAngle + 360) angle -= 360;

			// Check if the angle is within our allowed range
			if (angle >= startAngle && angle <= endAngle) {
				const newValue = Math.round(angleToValue(angle));
				setValue(newValue);
				onChange(newValue);
			}
		},
	});

	// Calculate handle position
	const handlePosition = polarToCartesian(center, center, radius, currentAngle);

	return (
		<View style={[styles.container, style]}>
			<Svg
				width={viewBoxSize}
				height={viewBoxSize / 2 + strokeWidth}
				viewBox={`0 0 ${viewBoxSize} ${viewBoxSize / 2 + strokeWidth}`}
				{...panResponder.panHandlers}
			>
				{/* Background arc */}
				<Path d={getArcPath(startAngle, endAngle)} stroke={backgroundColor} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />

				{/* Active arc */}
				<Path d={getArcPath(startAngle, currentAngle)} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />

				{/* Handle */}
				<Circle cx={handlePosition.x} cy={handlePosition.y} r={strokeWidth / 1.5} fill="white" stroke={color} strokeWidth={2} />

				{/* Start label (left side) */}
				<SvgText
					x={center - radius + 5}
					y={center - 15}
					fill="white"
					fontSize={12}
					textAnchor="middle"
				>
					1
				</SvgText>

				{/* End label (right side) */}
				<SvgText
					x={center + radius - 5}
					y={center + 20}
					fill="white"
					fontSize={12}
					textAnchor="middle"
				>
					{max}
				</SvgText>
			</Svg>

			{/* Value display */}
			<View>{children}</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		// position: "relative",
		alignItems: "center",
		// justifyContent: "center",
	},
});

export default ArcSlider;
