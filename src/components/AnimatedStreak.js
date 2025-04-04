import { useSpring, animated } from 'react-spring';

function AnimatedStreak({ streak }) {
  const props = useSpring({
    from: { number: 0 },
    to: { number: streak },
    config: { duration: 500 },
  });

  return (
    <animated.span>
      🔥 Streak: {props.number.to((n) => Math.floor(n))} day{streak === 1 ? '' : 's'}
    </animated.span>
  );
}

export default AnimatedStreak;