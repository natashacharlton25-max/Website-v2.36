# Scroll Scramble — Circular Variant Reference

Source: codepen.io/cbolson

Words arranged radially in a circle. On scroll, the whole circle rotates
while letter angles converge from scattered to inline. Uses GSAP ScrollTrigger
for the rotation + letter angle interpolation.

## Key concepts:
- Words positioned with `rotate(360deg / count * index)` around a circle
- Each letter has a scramble angle offset that reduces to 0 on scroll
- Circle rotates 360deg over the scroll distance
- `--rotate` property drives both circle rotation and letter unscramble

## TODO: Build as `mode="circular"` on ScrollScramble component
- Add circleSize prop (default: 30vw)
- Add letterAngleDelta prop (default: 48deg)
- GSAP tweens --rotate from 0 to 1, CSS calc() handles the rest
