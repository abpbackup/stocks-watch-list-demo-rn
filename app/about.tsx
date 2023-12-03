import { StyleSheet, Image, TouchableOpacity, SafeAreaView, Dimensions, Platform, StatusBar } from 'react-native';

import { Text, View } from '../components/Themed';
import Colors, { primaryColor } from '../constants/Colors';
import { Link } from 'expo-router';

const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

export default function ModalScreen() {
  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: statusBarHeight }]}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.detailsContainer}>
            <Text style={styles.name}>Andres Botero</Text>
            <Text style={styles.role}>Senior Software Engineer</Text>
            <Text>Full stack development</Text>
            <Text style={styles.stack}>Javascript | Typescript | React.js | Node.js | ReactNative | Next.js</Text>
          </View>
          <Image style={styles.image} source={require('../assets/images/profile-image.jpeg')} />
        </View>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

        <View style={styles.descriptionContainer}>
          <Text style={styles.text}>
            I'm a Senior Software Engineer with 20+ years in tech. Skilled in leading engineering teams, designing
            architecture and providing full-stack development of scalable cloud based solutions and mobile applications.
            I have significant experience using JavaScript, Typescript, React.js, Node.js, Next.js, React Native (iOS
            and Android), and Electron.js (Windows, MacOS, Linux).
          </Text>

          <Text style={styles.text}>
            I'm committed to building valuable, fast, and reliable software that meets top standards. I make sure the
            products we create are user-friendly, from start to finish, and truly connect with the people using them. I
            follow best coding practices to make software faster to build and easier to keep up.
          </Text>
        </View>

        <Link href="https://www.linkedin.com/in/andres-botero-patino/" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Visit my LinkedIn</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    maxWidth: '100%',
  },
  detailsContainer: {
    gap: 8,
    flexGrow: 1,
    flexShrink: 1,
  },
  image: {
    height: 120,
    width: 80,
    borderRadius: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: '500',
  },
  role: {
    fontStyle: 'italic',
    fontSize: 18,
  },
  stack: {
    fontSize: 12,
    flexWrap: 'wrap',
    color: Colors.light.tint,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
  button: {
    backgroundColor: primaryColor,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'justify',
  },
  descriptionContainer: {
    gap: 10,
    marginBottom: 10,
  },
});
