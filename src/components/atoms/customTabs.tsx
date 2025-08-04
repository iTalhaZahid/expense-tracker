import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Text } from '@react-navigation/elements';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';


export default function CustomTabs({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const tabbarIcons: any = {
    index: (isFocused: boolean) => {
      return <FontAwesome size={verticalScale(22)} name="home" color={isFocused ? '#7CFC00' : 'white'} />;
    },
    statistics: (isFocused: boolean) => {
      return <Ionicons name="stats-chart" size={verticalScale(22)} color={isFocused ? '#7CFC00' : 'white'} />;
    },
    wallet: (isFocused: boolean) => {
      return <Entypo name="wallet" size={verticalScale(22)} color={isFocused ? '#7CFC00' : 'white'} />;
    },
    profile: (isFocused: boolean) => {
      return <Ionicons name="person" size={verticalScale(22)} color={isFocused ? '#7CFC00' : 'white'} />;
    },
  };

  return (
    <View style={[
      styles.tabBar,
      {
        paddingBottom: insets.bottom,
        height: verticalScale(48) + insets.bottom, // dynamically increase height
      },
    ]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label: any = options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}
          >
            {tabbarIcons[route.name] && tabbarIcons[route.name](isFocused)}
            <Text style={{ color: isFocused ? '#7CFC00' : 'white', textTransform: 'capitalize', fontSize: moderateScale(10) }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'black',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});