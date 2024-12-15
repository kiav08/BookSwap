import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function NotificationsScreen() {
  const [priceChanges, setPriceChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newChanges, setNewChanges] = useState([]); 
  const [currentUser, setCurrentUser] = useState(null); // State for current user
  const auth = getAuth();
  
  /*/*==================  USE-EFFECT function ==================== */
  // Check auth state and fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      //if user is logged in set the current user and console log the user
      if (user){
        setCurrentUser(user);
        console.log('User is logged in:', user);
      }
      //if no user is logged in, console log the user
      if (user) {
        // Fetch user data if logged in
        fetchPriceChanges(user.uid);
      } else {
        // Set current user to null if no user is logged in
        console.log('No user is logged in', user);
        setCurrentUser(null);
      }
    });
    
    return () => unsubscribe(); // Unsubscribe on component unmount
  }, []);

  /*==================  FETCH-PRICE-CHANGES FUNCTION ==================== */
  // Function to fetch price changes
  const fetchPriceChanges = (uid) => {
    const db = getDatabase();
    
    const followedBooksRef = ref(db, `users/${uid}/followedBooks`);

    // Listen for changes to the followed books
    const unsubscribe = onValue(
      followedBooksRef,
      (snapshot) => {
        const data = snapshot.val();
        const changesArray = [];

        if (data) {
          Object.keys(data).forEach((bookId) => {
            const book = data[bookId];
            // Check if the book has a price
            if (book.price) {
              changesArray.push({
                bookTitle: book.title,
                newPrice: book.price,
                timestamp: Date.now(),
                id: bookId,
              });
            }
          });
          //if there are any changes, set the state
          setPriceChanges(changesArray);
          // Save as new changes
          setNewChanges(changesArray); 
        } else {
          setError('No followed books found');
        }
        setLoading(false);
      },
      (error) => {
        setError('Error fetching followed books');
        console.error(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  };

  /*==================  HANDLE-CHANGE-VISUAL-EFFECT FUNCTION ==================== */
  // Function to handle visual effect for new changes on the screen
  const handleChangeVisualEffect = (bookId) => {
    // Remove the change from the newChanges state after 3 seconds
    setTimeout(() => {
    // Filter out the change with the given ID
      setNewChanges((prevChanges) =>
    // Return all changes except the one with the given ID
        prevChanges.filter((change) => change.id !== bookId)
      );
    }, 3000);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

/*==================  RETURN-STATEMENT================== */
  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Følg med i prisændringerne på de bøger, du følger her.
        </Text>
      </View>

      <View style={styles.separator} />

      <ScrollView style={styles.scrollView}>
        {priceChanges.length === 0 ? (
          <Text style={styles.noChangesText}>Ingen prisændringer endnu.</Text>
        ) : (
          priceChanges.map((change, index) => (
            <View
              key={index}
              style={[styles.changeItem, newChanges.some((newChange) => newChange.id === change.id) ? styles.newChangeItem : {}]}
              onLayout={() => handleChangeVisualEffect(change.id)}
            >
              <Text style={styles.bookTitle}>Bogen: {change.bookTitle}</Text>
              <Text style={styles.priceChange}>Ny pris: {change.newPrice} DKK</Text>
              <Text style={styles.timestamp}>Dato: {new Date(change.timestamp).toLocaleString()}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

/* ========================= STYLES ========================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0E5',
  },
  banner: {
    margin: 20,
    marginTop: 50,
    backgroundColor: '#DB8D16',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  bannerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bannerTexti: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollView: {
    padding: 20,
  },
  changeItem: {
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  newChangeItem: {
    backgroundColor: '#fff',
    borderLeftWidth: 5,
    borderLeftColor: '#DB8D16',
  },
  bookTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  priceChange: {
    fontSize: 14,
    color: '#388E3C',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#757575',
  },
  noChangesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#757575',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#757575',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#d32f2f',
    marginTop: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "#000",
    marginVertical: 20,
    width: "100%",
    alignSelf: "center",
    marginBottom: 10,
  },
});
