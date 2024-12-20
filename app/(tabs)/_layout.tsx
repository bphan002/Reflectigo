import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function TabLayout() {
  return (
    <Tabs
      /* @tutinfo There are many <CODE>screenOptions</CODE> we can use to customize the tab bar. We're changing the active tab color here to custom value which we will also use later in our app. */
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            /* @tutinfo The <CODE>focused</CODE> param allows us to change a tab's icon and label behavior when it is active and inactive.*/
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="createnewtrip"
        options={{
          
          title: 'Create Trip',
          tabBarIcon: ({ color, focused }) => (
            /* @tutinfo */
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
          ),
        }}
      />
            <Tabs.Screen
        name="imagepicker"
        options={{
          title: 'imagepicker',
        }}
      />
       <Tabs.Screen
        name="profile"
        options={{
          title: 'profile',
        }}
      />
    </Tabs>
  );
}
