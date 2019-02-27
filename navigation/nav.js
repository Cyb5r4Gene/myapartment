import GreenRedVersion from '../constants/Colors';
import Fonts from '../constants/Fonts';
import { createSwitchNavigator, createAppContainer, createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import SignInScreen from '../src/signInUp/signInScreen';
import SignUpScreen from '../src/signInUp/signUpScreen';
import HomeNotExistsScreen from '../src/home/homeNotExistsScreen';
import HomeExistsScreen from '../src/home/homeExistsScreen';
import CleaningScreen from '../src/cleaning/cleaningScreen';
import BudgetScreen from '../src/budget/budgetScreen';
import ProfileScreen from '../src/profile/profileScreen';
import ShoppingScreen from '../src/shopping/shoppingScreen';
import ProfileScreenEdit from '../src/profile/profileScreenEdit';
import AddHomeScreen from '../src/home/addHomeScreen';
import AddHomeScreenCode from '../src/home/addHomeScreenCode';
import InviteRoommateScreen from '../src/home/inviteRoommateScreen';
import ForgotPasswordScreen from '../src/signInUp/forgotPasswordScreen';
import SplashScreen from "../src/splash";

const Cleaning = createStackNavigator({ Cleaning: CleaningScreen });
const Budget = createStackNavigator({ Budget: BudgetScreen });
const Shopping = createStackNavigator({ Shopping: ShoppingScreen });
const Home = createStackNavigator({
  Home: HomeNotExistsScreen,
  AddHome: AddHomeScreen,
  AddHomeCode: AddHomeScreenCode,
});
const Profile = createStackNavigator({
  Profile: ProfileScreen,
  ProfileEdit: ProfileScreenEdit,
});
const SettingStack = createStackNavigator({
  Settings: HomeExistsScreen,
  InviteRoommate: InviteRoommateScreen,
})

const HomeExistsStack = createMaterialTopTabNavigator({
  Cleaning,
  Shopping,
  Budget,
  Settings: SettingStack,
}, {
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    tabBarOptions: {
      labelStyle: {
        fontSize: Fonts.size14,
        fontWeight: '500'
      },
      tabStyle: {
        margin: 0,
        paddingHorizontal: 0,
        paddingVertical: 10,
      },
      style: {
        backgroundColor: GreenRedVersion.white,
      },
      indicatorStyle: { backgroundColor: 'none' },
      activeTintColor: GreenRedVersion.mainRed09,
      inactiveTintColor: 'black'
    }
  });

const registerHomeStack = createSwitchNavigator({
  Home,
  TopTabNavigatorStack: HomeExistsStack
})

const BottomTabNavigatorStack = createMaterialTopTabNavigator({
  Home: registerHomeStack,
  Profile,
}, {
    swipeEnabled: false,
    tabBarOptions: {
      labelStyle: {
        fontSize: Fonts.size14,
        fontWeight: '500'
      },
      tabStyle: {
        margin: 0,
        paddingHorizontal: 0,
        paddingTop: 23,
      },
      style: {
        backgroundColor: GreenRedVersion.white,
      },
      indicatorStyle: { backgroundColor: 'none' },
      activeTintColor: GreenRedVersion.mainRed09,
      inactiveTintColor: 'black'
    }
  });

const SignStack = createStackNavigator({
  SignIn: { screen: SignInScreen },
  SignUp: { screen: SignUpScreen },
  ForgotPassword: { screen: ForgotPasswordScreen },
})

const SomeStack = createSwitchNavigator({
  SplashScreen,
  SignInOut: SignStack,
  BottomTabNavigator: BottomTabNavigatorStack,
})

const Nav = createAppContainer(SomeStack);

export default Nav;

