import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function NotificationsScreen() {
  const [priceChanges, setPriceChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);  // Local state to hold the user
  const [newChanges, setNewChanges] = useState([]);  // State to track new changes for visual effect
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);  // Set the current user when logged in
      } else {
        setError("User is not logged in");
        setCurrentUser(null);  // Reset user when not logged in
      }
      setLoading(false);  // Stop loading after auth check
    });

    return () => unsubscribe();  // Cleanup the listener when the component unmounts
  }, [auth]);

  useEffect(() => {
    if (!currentUser) return;  // Do nothing if there's no user

    const db = getDatabase();
    const followedBooksRef = ref(db, `users/${currentUser.uid}/followedBooks`);

    // Listen for changes in followed books
    onValue(followedBooksRef, (snapshot) => {
      const data = snapshot.val();
      const changesArray = [];

      if (data) {
        for (const bookId in data) {
          if (data.hasOwnProperty(bookId)) {
            const book = data[bookId];

            // Log changes (assuming price change is relevant)
            if (book.price) {
              changesArray.push({
                bookTitle: book.title,
                newPrice: book.price,
                timestamp: Date.now(),
                id: bookId,  // Add book ID to track individual changes
              });
            }
          }
        }
        setPriceChanges(changesArray);
        setNewChanges(changesArray);  // Set the changes as 'new'
      } else {
        setError("No data found");
      }
    });

    return () => {
      setPriceChanges([]); // Cleanup state on unmount
    };
  }, [currentUser]);  // Runs when currentUser changes

  // Handle visual change effect for new changes
  const handleChangeVisualEffect = (bookId) => {
    // Remove the change from newChanges after a brief time (to reset the visual effect)
    setTimeout(() => {
      setNewChanges((prevChanges) => prevChanges.filter((change) => change.id !== bookId));
    }, 3000);  // Keep the visual effect for 3 seconds
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {priceChanges.length === 0 ? (
        <Text>No price changes yet.</Text>
      ) : (
        priceChanges.map((change, index) => (
          <View
            key={index}
            style={[
              styles.changeItem,
              newChanges.some((newChange) => newChange.id === change.id)
                ? styles.newChangeItem // Apply a special style for new changes
                : {},
            ]}
            onLayout={() => handleChangeVisualEffect(change.id)} // Trigger visual effect when rendered
          >
            <Text style={styles.bookTitle}>Book: {change.bookTitle}</Text>
            <Text style={styles.priceChange}>New Price: {change.newPrice} DKK</Text>
            <Text style={styles.timestamp}>Date: {new Date(change.timestamp).toLocaleString()}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  changeItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingTop: 10,
  },
  newChangeItem: {
    backgroundColor: '#d3f8d3',  // Light green background for new changes
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',  // Green border to highlight the new change
  },
  bookTitle: {
    fontWeight: 'bold',
  },
  priceChange: {
    color: 'green',
  },
  timestamp: {
    color: 'gray',
  },
});
