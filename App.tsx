import {Button, StyleSheet, Text, View} from 'react-native';
import {useCallback, useEffect, useRef, useState} from "react";

const convertTime = (secs: number) => {
  let hours = Math.floor(secs / (60 * 60));

  let divisor_for_minutes = secs % (60 * 60);
  let minutes = Math.floor(divisor_for_minutes / 60);

  let divisor_for_seconds = divisor_for_minutes % 60;
  let seconds = Math.ceil(divisor_for_seconds);

  return {
    'h': hours,
    'm': minutes,
    's': seconds
  }
}

const WORK_TIME = 10 // 1500
const REST_TIME = 5 // 300


export default function App() {
  const [counter, setCounter] = useState(0)
  const [time, setTime] = useState(convertTime(counter))
  const [isWorkTime, setIsWorkTime] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  const timer = useRef()

  const handlePauseInterval = () => {
    clearInterval(timer.current)
    setIsPaused(true)
  }

  const handleStopInterval = () => {
    setCounter(0)
    handlePauseInterval()
  }

  const handlePlayInterval = () => {
    if (!isPaused) return

    // @ts-ignore
    timer.current = setInterval(() => {
      setCounter((counter) => counter + 1)
    }, 1000)

    setIsPaused(false)
  }

  useEffect(() => {
    // @ts-ignore
    timer.current = setInterval(() => {
      setCounter((counter) => counter + 1)
    }, 1000)
  }, [])

  useEffect(() => {
    setCounter(0)

    let timer = isWorkTime ? WORK_TIME : REST_TIME

    if (counter > timer) {
      setCounter(0)
    }
  }, [isWorkTime])

  useEffect(() => {
    setTime(convertTime(counter))

    if (isWorkTime) {
      if (counter > WORK_TIME) {
        setIsWorkTime(false)
      }

      return
    }

    if (!isWorkTime) {
      if (counter > REST_TIME) {
        setIsWorkTime(true)
      }
    }

  }, [counter])

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Text>Counter</Text>
        <Text>{`${time.h}:${time.m}:${time.s}`}</Text>
        {
          isWorkTime
            ? <Text>Work time</Text>
            : <Text>Rest time</Text>
        }
        <View style={styles.buttons}>
          <Button title={'Pause'} onPress={handlePauseInterval} />
          <Button title={'Play'} onPress={handlePlayInterval} />
          <Button title={'Stop'} onPress={handleStopInterval} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    display: 'flex',
    justifyContent: 'center'
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '20%'
  }
});
