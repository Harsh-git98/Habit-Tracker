import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { TabBarIcon } from '../../src/components/navigation/TabBarIcon';
import { appTheme } from '../../src/theme/appTheme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: appTheme.colors.surface,
        },
        headerTitleStyle: {
          color: appTheme.colors.textPrimary,
          fontWeight: '700',
        },
        headerTintColor: appTheme.colors.textPrimary,
        tabBarActiveTintColor: appTheme.colors.accent,
        tabBarInactiveTintColor: appTheme.colors.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 14,
          height: 72,
          borderRadius: appTheme.radius.xl,
          backgroundColor: 'rgba(16, 24, 41, 0.92)',
          borderTopColor: appTheme.colors.borderStrong,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: Platform.select({ ios: 12, android: 10, default: 10 }),
          paddingHorizontal: 8,
          ...appTheme.shadows.card,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home-outline" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="checkbox-marked-circle-outline" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          title: 'Diary',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="notebook-outline" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="cog-outline" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}