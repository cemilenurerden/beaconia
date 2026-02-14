import { View, Text, TouchableOpacity } from 'react-native';

interface Tab {
  key: string;
  label: string;
}

interface TabSwitcherProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export default function TabSwitcher({ tabs, activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: '#F3F4F6',
      borderRadius: 16,
      padding: 4,
    }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.7}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 12,
              alignItems: 'center',
              backgroundColor: isActive ? '#7C3AED' : 'transparent',
            }}
          >
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: isActive ? '#FFFFFF' : '#9CA3AF',
            }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
