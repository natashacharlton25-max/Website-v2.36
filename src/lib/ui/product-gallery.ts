/**
 * Product Gallery - GSAP Flip Animation
 * Based on gsap-flip-card-sorting example
 */

import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

const activeClass = "is-active";
const inactiveClass = "is-inactive";

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll(".thumbnail");

  cards.forEach((card, idx) => {
    card.addEventListener("click", () => {
      const state = Flip.getState(cards);
      const isCardActive = card.classList.contains(activeClass);

      cards.forEach((otherCard, otherIdx) => {
        otherCard.classList.remove(activeClass);
        otherCard.classList.remove(inactiveClass);
        if (!isCardActive && idx !== otherIdx)
          otherCard.classList.add(inactiveClass);
      });

      if (!isCardActive) {
        card.classList.add(activeClass);
      }

      Flip.from(state, {
        duration: 1,
        ease: "expo.out",
        absolute: true
      });
    });
  });
});
