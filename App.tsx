import { StatusBar } from 'expo-status-bar';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { MotiView } from 'moti';
import randomColor from 'randomcolor';

const { width } = Dimensions.get('window');

const pinLength = 4;
const pinContainerSize = width / 2;
const pinMaxSize = pinContainerSize / pinLength;
const pinSpacing = 10;
const pinSize = pinMaxSize - pinSpacing * 2;

const dialPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, ' ', 0, 'del'];
const dialPadSize = width * .2;
const dialPadTextSize = dialPadSize * .4;
const _spacing = 20;

const baseColor = randomColor();

const _colors = {
  primary: baseColor,
  secondary: randomColor({
    hue: baseColor,
    luminosity: 'dark',
  })
};

function DialPad({ onPress }: { onPress: (item: typeof dialPad[number]) => void; }) {
  return <FlatList
    numColumns={3}
    data={dialPad}
    style={{ flexGrow: 0, }}
    columnWrapperStyle={{ gap: _spacing }}
    contentContainerStyle={{ gap: _spacing }}
    scrollEnabled={false}
    keyExtractor={(_, index) => index.toString()}
    renderItem={({ item }) => {
      return (
        <TouchableOpacity
          onPress={() => {
            onPress(item);
          }}
          disabled={item === ' '}
        >
          <View
            style={{
              width: dialPadSize,
              height: dialPadSize,
              borderRadius: dialPadSize,
              borderWidth: typeof item !== 'number' ? 0 : 1,
              borderColor: _colors.secondary,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {item === 'del' ?
              <Ionicons
                name='backspace-outline'
                color={_colors.secondary}
                size={dialPadTextSize}
              /> :
              <Text
                style={{
                  fontSize: dialPadTextSize,
                  color: _colors.secondary
                }}>{item}</Text>}
          </View>
        </TouchableOpacity>
      );
    }}
  />;
};

export default function App() {
  const [code, setCode] = useState<number[]>([]);

  return (
    <View style={styles.container}>
      <View style={{
        flexDirection: 'row',
        gap: pinSpacing * 2,
        marginBottom: _spacing * 2,
        // backgroundColor: 'green',
        height: pinSize * 2,
        alignItems: 'flex-end',
      }}>
        {[...Array(pinLength).keys()].map(i => {
          const isSelected = !!code[i];
          return <MotiView
            key={`pin-${i}`}
            style={{
              width: pinSize,
              height: isSelected ? pinSize : 2,
              borderRadius: pinSize,
            }}
            transition={{
              type: 'timing',
              duration: 200,
            }}
            animate={{
              height: isSelected ? pinSize : 2,
              marginBottom: isSelected ? pinSize / 2 : 0,
              backgroundColor: isSelected ? _colors.secondary : `${_colors.secondary}44`,
            }}
          />;
        })}
      </View>

      <DialPad onPress={(item) => {
        if (item === 'del') {
          setCode(prevCode => prevCode.slice(0, prevCode.length - 1));
        } else if (typeof item === 'number') {
          if (code.length === pinLength) return;
          setCode(prevCode => [...prevCode, item]);
        }
      }} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: _colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
