import React, {useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Platform, Animated, View, TouchableOpacity, StyleSheet} from 'react-native';
import Svg, {Path, Defs, LinearGradient as SvgGradient, Stop, Rect} from 'react-native-svg';
import {BlurView} from '@react-native-community/blur';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import MatchScreen from '../screens/MatchScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  MainTabs: undefined;
  Chat: {conversation: any};
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function TabIcon({label, focused}: {label: string; focused: boolean}) {
  const scale = useRef(new Animated.Value(focused ? 1 : 0.88)).current;
  const opacity = useRef(new Animated.Value(focused ? 1 : 0.5)).current;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (focused) {
      Animated.spring(scale, {
        toValue: 1.15,
        useNativeDriver: true,
        friction: 6,
        tension: 500,
      }).start();
      Animated.timing(opacity, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(scale, {
        toValue: 0.88,
        useNativeDriver: true,
        friction: 6,
        tension: 500,
      }).start();
      Animated.timing(opacity, {
        toValue: 0.5,
        duration: 80,
        useNativeDriver: true,
      }).start();
    }
  }, [focused]);

  const sw = focused ? 2.2 : 1.8;
  const sz = 24;

  let icon = null;

  if (label === 'Home') {
    icon = (
      <Svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
        <Path d="M10 16H14" stroke="#fff" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M2 8L11.7317 3.13416C11.9006 3.04971 12.0994 3.0497 12.2683 3.13416L22 8" stroke="#fff" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M20 11V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V11" stroke="#fff" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  } else if (label === 'Match') {
    icon = (
      <Svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
        <Path d="M7 12L17 12" stroke="#fff" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M7 8L13 8" stroke="#fff" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M3 20.2895V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V15C21 16.1046 20.1046 17 19 17H7.96125C7.35368 17 6.77906 17.2762 6.39951 17.7506L4.06852 20.6643C3.71421 21.1072 3 20.8567 3 20.2895Z" stroke="#fff" strokeWidth={sw} />
      </Svg>
    );
  } else if (label === 'Messages') {
    icon = (
      <Svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
        <Path
          d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
          stroke="#fff"
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  } else if (label === 'Profile') {
    icon = (
      <Svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
        <Path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="#fff" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M4.271 18.3457C4.271 18.3457 6.50002 15.5 12 15.5C17.5 15.5 19.7291 18.3457 19.7291 18.3457" stroke="#fff" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" stroke="#fff" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }

  return (
    <Animated.View style={{transform: [{scale}], opacity}}>
      {icon}
    </Animated.View>
  );
}

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 80 : 60;
const BOTTOM_INSET = Platform.OS === 'ios' ? 28 : 8;

function GlassTabBar({state, descriptors, navigation}: any) {
  return (
    <View style={glassStyles.wrapper}>
      {/* Blur backdrop */}
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="dark"
        blurAmount={40}
        reducedTransparencyFallbackColor="rgba(20,20,40,0.85)"
      />
      {/* Tinted overlay */}
      <View style={glassStyles.tint} />
      {/* Top specular highlight */}
      <Svg style={glassStyles.highlight} viewBox="0 0 400 1" preserveAspectRatio="none">
        <Defs>
          <SvgGradient id="glassEdge" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#fff" stopOpacity="0" />
            <Stop offset="0.3" stopColor="#fff" stopOpacity="0.1" />
            <Stop offset="0.5" stopColor="#fff" stopOpacity="0.15" />
            <Stop offset="0.7" stopColor="#fff" stopOpacity="0.1" />
            <Stop offset="1" stopColor="#fff" stopOpacity="0" />
          </SvgGradient>
        </Defs>
        <Rect x="0" y="0" width="400" height="1" fill="url(#glassEdge)" />
      </Svg>
      {/* Tab buttons */}
      <View style={glassStyles.row}>
        {state.routes.map((route: any, index: number) => {
          const focused = state.index === index;
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? {selected: true} : {}}
              onPress={() => {
                const event = navigation.emit({type: 'tabPress', target: route.key, canPreventDefault: true});
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              style={glassStyles.tab}
              activeOpacity={0.7}>
              <TabIcon label={route.name} focused={focused} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const glassStyles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: TAB_BAR_HEIGHT,
    overflow: 'hidden',
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 20, 60, 0.2)',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 0.5,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingBottom: BOTTOM_INSET,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <GlassTabBar {...props} />}
      screenOptions={{
        headerStyle: {backgroundColor: '#0f0f1a'},
        headerTintColor: '#fff',
        headerTitleStyle: {fontWeight: 'bold'},
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Match"
        component={MatchScreen}
        options={{title: 'Find Duo'}}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: 'Profile'}}
      />
    </Tab.Navigator>
  );
}

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false, contentStyle: {backgroundColor: '#0a0a0a'}}}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
