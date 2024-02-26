import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { PitchDetector } from "pitchy";

const App = () => {
  const updatePitch = (analyserNode, detector, input, sampleRate) => {
    analyserNode.getFloatTimeDomainData(input);
    const [pitch, clarity] = detector.findPitch(input, sampleRate);

    let pitchString = `${Math.round(pitch * 10) / 10} Hz`;
    let clarityString = `${Math.round(clarity * 100)} %`;
    console.log(`Pitch: ${pitchString}, clarity: ${clarityString}`);
    window.setTimeout(
      () => updatePitch(analyserNode, detector, input, sampleRate),
      100,
    );
  };

  const detectPitch = () => {
    const audioContext = new window.AudioContext();
    const analyser = audioContext.createAnalyser();

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      audioContext.createMediaStreamSource(stream).connect(analyser);
      const detector = PitchDetector.forFloat32Array(analyser.fftSize);
      detector.minVolumeDecibels = -10;
      const input = new Float32Array(detector.inputLength);
      updatePitch(analyser, detector, input, audioContext.sampleRate);
    });
  };
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <button onClick={detectPitch}>CLICKY</button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
