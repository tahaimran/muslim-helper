import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet } from 'react-native';
import { Sun, Compass, Target, CircleUser, Heart } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';

export default function TabLayout() {
  const { colors, mode } = useTheme();

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.primaryGreen,
      tabBarInactiveTintColor: colors.mutedText,
      tabBarHideOnKeyboard: true,
      tabBarBackground: () => (
        <BlurView 
          intensity={Platform.OS === 'ios' ? 30 : 100} 
          tint={mode === 'dark' ? 'dark' : 'light'} 
          style={StyleSheet.absoluteFill} 
        />
      ),
      tabBarStyle: {
        position: 'absolute',
        backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)',
        borderTopWidth: 0,
        height: Platform.OS === 'ios' ? 88 : 72,
        paddingBottom: Platform.OS === 'ios' ? 28 : 12,
        paddingTop: 12,
        elevation: 0,
        shadowOpacity: 0,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '700',
        marginTop: 4,
      },
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, focused }) => <Sun size={24} color={color} strokeWidth={focused ? 2.5 : 2} />,
        }}
      />
      <Tabs.Screen
        name="worship"
        options={{
          title: 'Worship',
          tabBarIcon: ({ color, focused }) => <Heart size={24} color={color} strokeWidth={focused ? 2.5 : 2} />,
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: 'Journey',
          tabBarIcon: ({ color, focused }) => <Compass size={24} color={color} strokeWidth={focused ? 2.5 : 2} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Growth',
          tabBarIcon: ({ color, focused }) => <Target size={24} color={color} strokeWidth={focused ? 2.5 : 2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Presence',
          tabBarIcon: ({ color, focused }) => <CircleUser size={24} color={color} strokeWidth={focused ? 2.5 : 2} />,
        }}
      />
    </Tabs>
  );
}
