import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import Svg, {Path, G, ClipPath, Rect, Defs} from 'react-native-svg';

const CompetitiveIcon = () => (
  <Svg width={13} height={13} viewBox="0 0 15 15" fill="none">
    <Path
      d="M10 7.5H10.875C11.0821 7.5 11.25 7.66788 11.25 7.875V12.125C11.25 12.3321 11.0821 12.5 10.875 12.5H4.125C3.91789 12.5 3.75 12.3321 3.75 12.125V7.875C3.75 7.66788 3.91789 7.5 4.125 7.5H5M10 7.5V5C10 4.16667 9.5 2.5 7.5 2.5C5.5 2.5 5 4.16667 5 5V7.5M10 7.5H5"
      stroke="white"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const NightOwlIcon = () => (
  <Svg width={13} height={13} viewBox="0 0 13 13" fill="none">
    <Path
      d="M0.75 5.94848C0.75 9.15259 3.34743 11.75 6.55152 11.75C8.82944 11.75 10.8007 10.4372 11.75 8.52694C6.55152 8.52694 3.97307 5.94848 3.97307 0.75C2.06279 1.69932 0.75 3.67059 0.75 5.94848Z"
      stroke="white"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const TrashTalkerIcon = () => (
  <Svg width={13} height={13} viewBox="0 0 13 13" fill="none">
    <G clipPath="url(#clip0)">
      <Path
        d="M10.8333 4.875L9.75267 11.0209C9.66161 11.5389 9.21165 11.9167 8.68575 11.9167H4.31419C3.78826 11.9167 3.33831 11.5389 3.24723 11.0209L2.16663 4.875"
        stroke="white"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.375 3.24998H8.32813M8.32813 3.24998V2.16665C8.32813 1.56834 7.84312 1.08331 7.24479 1.08331H5.75521C5.1569 1.08331 4.67188 1.56834 4.67188 2.16665V3.24998M8.32813 3.24998H4.67188M1.625 3.24998H4.67188"
        stroke="white"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0">
        <Rect width={13} height={13} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

const CasualIcon = () => (
  <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
    <Path d="M17.5 17.5C20 21 23.9486 18.4151 23 15C21.5753 9.87113 20.8001 7.01556 20.3969 5.50793C20.1597 4.62136 19.3562 4 18.4384 4L5.56155 4C4.64382 4 3.844 4.62481 3.62085 5.515C2.7815 8.86349 2.0326 11.8016 1.14415 15C0.195501 18.4151 4.14415 21 6.64415 17.5" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M18 8.5L18.0111 8.51" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16.49 7L16.5011 7.01" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16.49 10L16.5011 10.01" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M15 8.5L15.0111 8.51" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7 7V10" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5.5 8.5H8.5" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M8 16C9.10457 16 10 15.1046 10 14C10 12.8954 9.10457 12 8 12C6.89543 12 6 12.8954 6 14C6 15.1046 6.89543 16 8 16Z" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 16C17.1046 16 18 15.1046 18 14C18 12.8954 17.1046 12 16 12C14.8954 12 14 12.8954 14 14C14 15.1046 14.8954 16 16 16Z" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TeamPlayerIcon = () => (
  <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
    <Path d="M1 20V19C1 15.134 4.13401 12 8 12C11.866 12 15 15.134 15 19V20" stroke="white" strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M13 14C13 11.2386 15.2386 9 18 9C20.7614 9 23 11.2386 23 14V14.5" stroke="white" strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M18 9C19.6569 9 21 7.65685 21 6C21 4.34315 19.6569 3 18 3C16.3431 3 15 4.34315 15 6C15 7.65685 16.3431 9 18 9Z" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EarlyBirdIcon = () => (
  <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
    <Path d="M3 15C5.48276 15 7.34483 12 7.34483 12C7.34483 12 9.2069 15 11.6897 15C14.1724 15 16.6552 12 16.6552 12C16.6552 12 19.1379 15 21 15" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3 20C5.48276 20 7.34483 17 7.34483 17C7.34483 17 9.2069 20 11.6897 20C14.1724 20 16.6552 17 16.6552 17C16.6552 17 19.1379 20 21 20" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SVG_ICONS: Record<string, React.FC> = {
  Competitive: CompetitiveIcon,
  'Night-Owl': NightOwlIcon,
  'Trash Talker': TrashTalkerIcon,
  Casual: CasualIcon,
  'Team Player': TeamPlayerIcon,
  'Early Bird': EarlyBirdIcon,
};

const BADGE_ICONS: Record<string, string> = {
  'Solo Grinder': '\uD83C\uDFAF',
  Streamer: '\uD83D\uDCFA',
};

interface PlayStyleBadgeProps {
  label: string;
}

const PlayStyleBadge: React.FC<PlayStyleBadgeProps> = ({label}) => {
  const SvgIcon = SVG_ICONS[label];
  const emoji = BADGE_ICONS[label];

  return (
    <View style={styles.shadow}>
      <View style={styles.badge}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={20}
          reducedTransparencyFallbackColor="rgba(255,255,255,0.1)"
        />
        {SvgIcon ? (
          <SvgIcon />
        ) : (
          <Text style={styles.icon}>{emoji || '\uD83C\uDFAE'}</Text>
        )}
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 50,
    elevation: 3,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
    overflow: 'hidden',
  },
  icon: {
    fontSize: 12,
  },
  label: {
    fontSize: 13,
    color: '#fff',
    fontFamily: 'ModernEra-Medium',
  },
});

export default PlayStyleBadge;
