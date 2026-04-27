import { Tabs } from 'expo-router';
import { Sun, Compass, Target, CircleUser, Heart } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.mediumGreen,
      tabBarInactiveTintColor: colors.mutedText,
      tabBarHideOnKeyboard: true,
      tabBarStyle: {
        backgroundColor: colors.cardBackground,
        borderTopColor: colors.border,
        borderTopWidth: 1,
        paddingBottom: 12,
        paddingTop: 10,
        height: 68,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 4,
      },
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, size }) => <Sun size={22} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="worship"
        options={{
          title: 'Worship',
          tabBarIcon: ({ color, size }) => <Heart size={22} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: 'Journey',
          tabBarIcon: ({ color, size }) => <Compass size={22} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size }) => <Target size={22} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <CircleUser size={22} color={color} strokeWidth={1.5} />,
        }}
      />
    </Tabs>
  );
}
