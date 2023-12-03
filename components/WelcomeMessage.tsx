import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Link } from 'expo-router';

import { primaryColor } from '../constants/Colors';
import { Text, View } from '../components/Themed';

const WelcomeMessage = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Welcome !</Text>
      <Text style={styles.bodyText}>
        🎉 We're thrilled to have you on board. It looks like you haven't added any stocks to your watchlist yet. Let's
        get started!
      </Text>

      <Text style={styles.bodyText}>
        Your watchlist is a powerful tool to keep an eye on the stocks that matter most to you. Follow these simple
        steps to add stocks:
      </Text>

      <Text style={styles.instructionText}>
        <Text style={styles.subtitle}>Explore Stocks:</Text> Browse or search for stocks using the search feature.
      </Text>
      <Text style={styles.instructionText}>
        <Text style={styles.subtitle}>Add to Watchlist:</Text> Found a stock you're interested in? Simply tap the ★ icon
        to keep an eye on it.
      </Text>
      <Text style={styles.instructionText}>
        <Text style={styles.subtitle}>Stay Informed:</Text> Once added, you can view real-time updates and insights for
        your chosen stocks right here in your watchlist.
      </Text>

      <Text style={styles.bodyText}>
        🚀 Ready to dive in? Start exploring and tailor your watchlist to suit your investment journey!
      </Text>

      <Link href="/about" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Learn More</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 16,
    textAlign: 'justify',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 10,
  },
  button: {
    backgroundColor: primaryColor,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  subtitle: {
    color: primaryColor,
    fontWeight: '600',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomeMessage;
