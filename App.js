import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';

// Constants pour les différents modes
const EASY_MODE = {
  MAX_NUMBER: 50,
  MAX_TIME: 5,
  NUM_NUMBERS: 2
};

const HARD_MODE = {
  MAX_NUMBER: 100,
  MAX_TIME: 3,
  NUM_NUMBERS: 3
};

const rndNumber = (max) => {
  return Math.floor(Math.random() * max);
};

const formatTime = (time) => {
  if (time < 10) {
    return '00 : 0' + time;
  } else {
    return '00 : ' + time;
  }
};

export default function App() {
  // États pour le jeu
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [solution, setSolution] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [msg, setMsg] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [btnEnabled, setBtnEnabled] = useState(true);

  // Fonction pour générer de nouveaux nombres
  const generateNumbers = (mode) => {
    const newNumbers = [];
    for (let i = 0; i < mode.NUM_NUMBERS; i++) {
      newNumbers.push(rndNumber(mode.MAX_NUMBER));
    }
    setNumbers(newNumbers);
    return newNumbers;
  };

  // Fonction pour calculer la solution
  const calculateSolution = (nums) => {
    return nums.reduce((a, b) => a + b, 0);
  };

  // Démarrer une nouvelle partie
  const startNewGame = (mode) => {
    setGameMode(mode);
    setTimeLeft(mode.MAX_TIME);
    setBtnEnabled(true);
    setMsg('');
    setUserAnswer('');
    
    const newNumbers = generateNumbers(mode);
    setSolution(calculateSolution(newNumbers));
    setGameStarted(true);
  };

  // Timer
  useEffect(() => {
    let timer;
    if (gameStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(prev - 1, 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, timeLeft]);

  // Vérifier quand le timer atteint 0
  useEffect(() => {
    if (timeLeft === 0 && gameStarted) {
      setBtnEnabled(false);
      setMsg(`Temps écoulé, la bonne réponse était ${solution}`);
    }
  }, [timeLeft, solution]);

  // Gérer la soumission de la réponse
  const handleSubmit = () => {
    if (parseInt(userAnswer) === solution) {
      setMsg('Bonne réponse !');
    } else {
      setMsg(`Mauvaise réponse, la réponse était ${solution}`);
    }
    setBtnEnabled(false);
  };

  // Écran de sélection du mode
  if (!gameStarted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Choisissez votre mode de jeu</Text>
        <TouchableOpacity
          style={styles.modeButton}
          onPress={() => startNewGame(EASY_MODE)}>
          <Text style={styles.buttonText}>Mode Facile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modeButton}
          onPress={() => startNewGame(HARD_MODE)}>
          <Text style={styles.buttonText}>Mode Difficile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Écran de jeu
  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
      <Text style={styles.calculation}>
        {numbers.join(' + ')} = 
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez votre réponse"
        keyboardType="numeric"
        value={userAnswer}
        onChangeText={setUserAnswer}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Submit"
          onPress={handleSubmit}
          disabled={!btnEnabled}
        />
        <Button
          title="New Game"
          onPress={() => setGameStarted(false)}
        />
      </View>
      <Text style={styles.message}>{msg}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
  },
  timer: {
    fontSize: 28,
    marginBottom: 20,
  },
  calculation: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '80%',
    marginBottom: 20,
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 20,
  },
  modeButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
  message: {
    fontSize: 18,
    marginTop: 20,
  },
});