/**
 * Hero Morph Animation Script
 * Handles SVG morphing animation for the hero section
 * Uses GSAP and MorphSVGPlugin for smooth transitions
 */

import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin);

// Animation configuration
const CONFIG = {
  morphDuration: 1.8,  // Slower for smoother morphing
  textFadeIn: 0.6,  // Slower fade for smoother text transitions
  textHold: 2.0,
};

interface ShapeData {
  file: string;
  text: string;
  holdTime: number;
}

async function loadSVG(filename: string): Promise<string> {
  try {
    // Special case: Generate single circle (same size as diverging circles)
    if (filename === 'circle1.svg') {
      const circlePath = 'M500,400 C555.228,400 600,444.772 600,500 C600,555.228 555.228,600 500,600 C444.772,600 400,555.228 400,500 C400,444.772 444.772,400 500,400Z';
      return `<?xml version="1.0" encoding="UTF-8"?>
        <svg width="100%" height="100%" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <path d="${circlePath}" fill="#8B9D83" fill-opacity="0.98"/>
        </svg>`;
    }

    // Special case: Generate 3 circles (positioned left, center, right) - same size as circle1
    if (filename === 'circles3.svg') {
      const circlePath = 'M500,400 C555.228,400 600,444.772 600,500 C600,555.228 555.228,600 500,600 C444.772,600 400,555.228 400,500 C400,444.772 444.772,400 500,400Z';
      return `<?xml version="1.0" encoding="UTF-8"?>
        <svg width="100%" height="100%" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <path d="${circlePath}" fill="#8B9D83" fill-opacity="0.98" data-position="center"/>
          <path d="${circlePath}" fill="#8B9D83" fill-opacity="0.98" data-position="left"/>
          <path d="${circlePath}" fill="#8B9D83" fill-opacity="0.98" data-position="right"/>
        </svg>`;
    }

    const response = await fetch(`/Animations/Hero Morph/${filename}`);
    return await response.text();
  } catch (error) {
    console.error(`Failed to load SVG: ${filename}`, error);
    return '';
  }
}

export async function initHeroMorph() {
  const container = document.querySelector('.hero-morph__svg-container') as HTMLElement;
  const textElement = document.querySelector('.hero-morph__title') as HTMLElement;
  const storage = document.querySelector('[data-svg-storage]');

  if (!container || !textElement || !storage) return;

  // Get sequence data from hidden storage
  const sequenceData: ShapeData[] = Array.from(storage.querySelectorAll('[data-svg-index]')).map(el => ({
    file: el.getAttribute('data-svg-file') || '',
    text: el.getAttribute('data-text') || '',
    holdTime: parseFloat(el.getAttribute('data-hold-time') || '2.8'),
  }));

  // Load all SVGs
  const svgCache = new Map<string, string>();
  for (const shape of sequenceData) {
    const svgContent = await loadSVG(shape.file);
    svgCache.set(shape.file, svgContent);
  }

  // Create initial SVG
  const firstSVG = svgCache.get(sequenceData[0].file);
  if (!firstSVG) return;

  container.innerHTML = firstSVG;
  const svg = container.querySelector('svg');
  if (!svg) return;

  let currentIndex = 0;
  let isLooping = false;

  async function showText(text: string) {
    // Fade out with moderate blur - opacity does most of the work
    await gsap.to(textElement, {
      opacity: 0,
      filter: 'blur(20px)', // Moderate blur for smooth effect
      duration: 1.0,
      ease: 'power3.in',
    });

    // Extra pause to ensure absolute invisibility
    await gsap.to({}, { duration: 0.15 });

    // Change text while completely invisible
    textElement.textContent = text;

    // Set starting state for fade in - text is invisible and blurred
    gsap.set(textElement, { opacity: 0, filter: 'blur(20px)' });

    // Smooth fade in with deblur from complete invisibility
    await gsap.to(textElement, {
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.4,
      ease: 'power2.out',
    });
  }

  async function morphToNext() {
    // Stop if we're at the logo and have already looped once
    if (currentIndex === 0 && isLooping) {
      return;
    }

    const nextIndex = (currentIndex + 1) % sequenceData.length;
    const nextShape = sequenceData[nextIndex];
    const nextSVG = svgCache.get(nextShape.file);

    if (!nextSVG) return;

    // Parse next SVG
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = nextSVG;
    const targetSVG = tempDiv.querySelector('svg');
    if (!targetSVG) return;

    if (!svg) return;
    const currentPaths = Array.from(svg.querySelectorAll('path'));
    const targetPaths = Array.from(targetSVG.querySelectorAll('path'));

    // Check if text is changing
    const currentText = sequenceData[currentIndex].text;
    const nextText = nextShape.text;
    const textChanging = currentText !== nextText;

    // Start text change in parallel (don't await) so it happens during SVG morph
    if (textChanging && nextText) {
      showText(nextText); // Run in parallel, don't wait
    }

    // Morph SVG - Simple approach: always replace entire SVG
    const timeline = gsap.timeline();

    // Get current and next file names for special handling
    const currentFile = sequenceData[currentIndex].file;
    const nextFile = nextShape.file;

    // Special case: Circle1 -> Circles3 (Divergence animation)
    if (currentFile === 'circle1.svg' && nextFile === 'circles3.svg') {
      // All same size circles (radius 100)
      const circlePath = 'M500,400 C555.228,400 600,444.772 600,500 C600,555.228 555.228,600 500,600 C444.772,600 400,555.228 400,500 C400,444.772 444.772,400 500,400Z';
      const centerPath = currentPaths[0];

      // Create 2 additional circles at center position (fully visible)
      const leftCircle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      leftCircle.setAttribute('d', circlePath);
      leftCircle.setAttribute('fill', '#8B9D83');
      leftCircle.style.opacity = '1';
      leftCircle.setAttribute('data-position', 'left');
      svg.appendChild(leftCircle);

      const rightCircle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      rightCircle.setAttribute('d', circlePath);
      rightCircle.setAttribute('fill', '#8B9D83');
      rightCircle.style.opacity = '1';
      rightCircle.setAttribute('data-position', 'right');
      svg.appendChild(rightCircle);

      // Animate divergence - smoother and slower
      const divergeDuration = 0.9;
      const horizontalOffset = 250;

      // Center circle stays, left and right diverge (no opacity change, just movement)
      timeline.to(leftCircle, {
        x: -horizontalOffset,
        duration: divergeDuration,
        ease: 'power1.inOut',
      }, 0);

      timeline.to(rightCircle, {
        x: horizontalOffset,
        duration: divergeDuration,
        ease: 'power1.inOut',
      }, 0);

      // Mark center circle with data attribute for later
      centerPath.setAttribute('data-position', 'center');

      // Wait for divergence to complete
      await timeline;

      currentIndex = nextIndex;

      // Mark that we've completed one loop when we return to logo
      if (nextIndex === 0) isLooping = true;

      const holdTime = nextShape.holdTime || CONFIG.textHold;
      await gsap.to({}, { duration: holdTime });
      morphToNext();
      return;
    }

    // Special case: Circles3 -> anything (Convergence animation first)
    if (currentFile === 'circles3.svg') {
      const convergeDuration = 0.8; // Smoother, slower convergence

      // Get all circles by their data-position attributes
      const centerCircle = currentPaths.find(p => p.getAttribute('data-position') === 'center');
      const leftCircle = currentPaths.find(p => p.getAttribute('data-position') === 'left');
      const rightCircle = currentPaths.find(p => p.getAttribute('data-position') === 'right');

      if (leftCircle && rightCircle) {
        // Step 1: Move circles to center (no fade during movement)
        timeline.to(leftCircle, {
          x: 0,
          duration: convergeDuration,
          ease: 'power1.inOut',
        }, 0);

        timeline.to(rightCircle, {
          x: 0,
          duration: convergeDuration,
          ease: 'power1.inOut',
        }, 0);

        // Wait for movement to complete
        await timeline;

        // Step 2: Quick fade out AFTER they reach center
        const fadeTimeline = gsap.timeline();
        fadeTimeline.to([leftCircle, rightCircle], {
          opacity: 0,
          duration: 0.15,
          ease: 'power1.in',
        });

        await fadeTimeline;

        // Remove the circles
        leftCircle.remove();
        rightCircle.remove();

        // Now continue with normal morph from center circle to target
        // Update currentPaths to just the center circle
        const remainingPath = centerCircle;
        if (!remainingPath) return;

        // Create new timeline for the morph
        const morphTimeline = gsap.timeline();

        // Morph center circle to target (single path)
        if (targetPaths.length === 1) {
          morphTimeline.to(remainingPath, {
            morphSVG: { shape: targetPaths[0], type: 'rotational' },
            duration: CONFIG.morphDuration,
            ease: 'power2.inOut',
          }, 0);
        } else {
          // If target has multiple paths, use the multi-path logic
          const circlePath = 'M500,400 C555.228,400 600,444.772 600,500 C600,555.228 555.228,600 500,600 C444.772,600 400,555.228 400,500 C400,444.772 444.772,400 500,400Z';

          // Morph to circle first
          morphTimeline.to(remainingPath, {
            morphSVG: circlePath,
            duration: 0.25,
            ease: 'power2.inOut',
          }, 0);

          // Create additional circles
          const additionalCircles: SVGPathElement[] = [];
          for (let i = 1; i < targetPaths.length; i++) {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            circle.setAttribute('d', circlePath);
            circle.setAttribute('fill', '#8B9D83');
            circle.style.opacity = '0';
            svg.appendChild(circle);
            additionalCircles.push(circle);

            morphTimeline.to(circle, {
              opacity: 1,
              duration: 0.15,
            }, 0.15);
          }

          // Morph all circles to target paths
          const allCircles = [remainingPath, ...additionalCircles];
          allCircles.forEach((circle, i) => {
            morphTimeline.to(circle, {
              morphSVG: { shape: targetPaths[i], type: 'rotational' },
              duration: CONFIG.morphDuration,
              ease: 'power2.inOut',
            }, 0.2);
          });
        }

        await morphTimeline;

        currentIndex = nextIndex;

        // Mark that we've completed one loop when we return to logo
        if (nextIndex === 0) isLooping = true;

        const holdTime = nextShape.holdTime || CONFIG.textHold;
        await gsap.to({}, { duration: holdTime });
        morphToNext();
        return;
      }
    }

    // Handle multi-path (logo with 4 separate paths) to single-path transitions
    if (currentPaths.length > 1 && targetPaths.length === 1) {
      const targetPath = targetPaths[0];

      // Create a circle path for intermediate step (radius 100)
      const circlePath = 'M500,400 C555.228,400 600,444.772 600,500 C600,555.228 555.228,600 500,600 C444.772,600 400,555.228 400,500 C400,444.772 444.772,400 500,400Z';

      // Smooth transition with visible circle intermediate state
      const circleTransitionDuration = 0.8; // Morph to circles
      const circleFadeDuration = 0.3; // Fade out extra circles
      const targetMorphDuration = 1.0; // Morph from circle to target

      // Step 1: Morph all paths to circles
      currentPaths.forEach(path => {
        timeline.to(path, {
          morphSVG: circlePath,
          duration: circleTransitionDuration,
          ease: 'power2.inOut',
        }, 0);
      });

      // Step 2: Fade out extra circles - start near end of circle morph
      currentPaths.slice(1).forEach(path => {
        timeline.to(path, {
          opacity: 0,
          duration: circleFadeDuration,
          ease: 'power1.inOut',
          onComplete: () => path.remove(),
        }, circleTransitionDuration * 0.7); // Start near end so circle is visible
      });

      // Step 3: Wait for circle to fully form, THEN morph to target
      const morphStartTime = circleTransitionDuration + circleFadeDuration; // Start AFTER circle is fully formed and extras faded
      timeline.to(currentPaths[0], {
        morphSVG: { shape: targetPath, type: 'rotational' },
        duration: targetMorphDuration,
        ease: 'power2.inOut',
      }, morphStartTime);

    } else if (currentPaths.length === 1 && targetPaths.length > 1) {
      // Single to Multi: Morph to circle, spawn more circles, morph all to targets
      const currentPath = currentPaths[0];
      const circlePath = 'M500,400 C555.228,400 600,444.772 600,500 C600,555.228 555.228,600 500,600 C444.772,600 400,555.228 400,500 C400,444.772 444.772,400 500,400Z';

      // Smooth transition with visible circle intermediate state
      const circleTransitionDuration = 0.8; // Morph to circle
      const circleFadeDuration = 0.3; // Fade in additional circles
      const targetMorphDuration = 1.0; // Morph from circles to target

      // Step 1: Morph current to circle
      timeline.to(currentPath, {
        morphSVG: circlePath,
        duration: circleTransitionDuration,
        ease: 'power2.inOut',
      }, 0);

      // Step 2: Create additional circles and fade them in - start near end of circle morph
      const additionalCircles: SVGPathElement[] = [];
      for (let i = 1; i < targetPaths.length; i++) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        circle.setAttribute('d', circlePath);
        circle.setAttribute('fill', '#8B9D83');
        circle.style.opacity = '0';
        svg.appendChild(circle);
        additionalCircles.push(circle);

        timeline.to(circle, {
          opacity: 1,
          duration: circleFadeDuration,
          ease: 'power1.inOut',
        }, circleTransitionDuration * 0.7); // Start near end so circle is visible
      }

      // Step 3: Wait for circles to fully form, THEN morph to target
      const allCircles = [currentPath, ...additionalCircles];
      const morphStartTime = circleTransitionDuration + circleFadeDuration; // Start AFTER circles are fully formed
      allCircles.forEach((circle, i) => {
        timeline.to(circle, {
          morphSVG: { shape: targetPaths[i], type: 'rotational' },
          duration: targetMorphDuration,
          ease: 'power2.inOut',
        }, morphStartTime);
      });

    } else if (currentPaths.length === 1 && targetPaths.length === 1) {
      const currentPath = currentPaths[0];
      const targetPath = targetPaths[0];

      // Count sub-paths within each path
      const currentSubPathCount = (currentPath.getAttribute('d') || '').split(/[Mm]/).length - 1;
      const targetSubPathCount = (targetPath.getAttribute('d') || '').split(/[Mm]/).length - 1;

      if (currentSubPathCount > 1 && targetSubPathCount === 1) {
        // Multi to Single: Extract first sub-path, fade out original, morph first to target
        const pathData = currentPath.getAttribute('d') || '';
        const subPaths = pathData.split(/(?=[Mm])/).filter(p => p.trim());

        // Create temp path with just first sub-path
        const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        tempPath.setAttribute('d', subPaths[0]);
        tempPath.setAttribute('fill', '#8B9D83');
        tempPath.style.opacity = '0';
        svg.appendChild(tempPath);

        // Fade out original multi-part path, fade in temp single path
        timeline.to(currentPath, { opacity: 0, duration: 0.3 }, 0);
        timeline.to(tempPath, { opacity: 1, duration: 0.3 }, 0);

        // Morph temp to target
        timeline.to(tempPath, {
          morphSVG: { shape: targetPath, type: 'rotational' },
          duration: CONFIG.morphDuration,
          ease: 'power2.inOut',
        }, 0.3);

      } else if (currentSubPathCount === 1 && targetSubPathCount > 1) {
        // Single to Multi: Morph to first part, then scale up + fade in full target
        const targetData = targetPath.getAttribute('d') || '';
        const targetSubPaths = targetData.split(/(?=[Mm])/).filter(p => p.trim());

        // Create temp path with just first sub-path of target
        const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        tempPath.setAttribute('d', targetSubPaths[0]);
        tempPath.setAttribute('fill', '#8B9D83');

        // Morph current to first part of target
        timeline.to(currentPath, {
          morphSVG: { shape: tempPath, type: 'rotational' },
          duration: CONFIG.morphDuration,
          ease: 'power2.inOut',
        }, 0);

        // Replace with full target and scale up + fade in
        timeline.call(() => {
          svg.innerHTML = '';
          const fullTarget = targetPath.cloneNode(true) as SVGPathElement;
          fullTarget.style.opacity = '0';
          svg.appendChild(fullTarget);

          // Scale up from small while fading in (extra parts grow from center)
          gsap.fromTo(fullTarget,
            {
              opacity: 0,
              scale: 0.3,
              transformOrigin: '50% 50%'
            },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: 'back.out(1.2)'
            }
          );
        }, undefined, CONFIG.morphDuration);

      } else if (currentSubPathCount > 1 && targetSubPathCount > 1) {
        // Multi to Multi: Scale down old, scale up new with crossfade
        timeline.to(currentPath, {
          opacity: 0,
          scale: 0.4,
          transformOrigin: '50% 50%',
          duration: CONFIG.morphDuration / 2,
          ease: 'power2.in'
        }, 0);

        timeline.call(() => {
          svg.innerHTML = '';
          const fullTarget = targetPath.cloneNode(true) as SVGPathElement;
          fullTarget.style.opacity = '0';
          svg.appendChild(fullTarget);

          gsap.fromTo(fullTarget,
            {
              opacity: 0,
              scale: 0.4,
              transformOrigin: '50% 50%'
            },
            {
              opacity: 1,
              scale: 1,
              duration: CONFIG.morphDuration / 2,
              ease: 'power2.out'
            }
          );
        }, undefined, CONFIG.morphDuration / 2);

      } else {
        // Normal single-to-single morph
        timeline.to(currentPath, {
          morphSVG: { shape: targetPath, type: 'rotational' },
          duration: CONFIG.morphDuration,
          ease: 'power2.inOut',
        }, 0);
      }
    } else {
      // Multi-to-Multi transitions (e.g., smile 3 paths → logo 4 paths)
      const circlePath = 'M500,400 C555.228,400 600,444.772 600,500 C600,555.228 555.228,600 500,600 C444.772,600 400,555.228 400,500 C400,444.772 444.772,400 500,400Z';

      if (currentPaths.length < targetPaths.length) {
        // Need MORE paths (e.g., smile 3 → logo 4)
        // Smooth transition with visible circle intermediate state
        const circleTransitionDuration = 0.8; // Morph to circles
        const circleFadeDuration = 0.3; // Fade in additional circles
        const targetMorphDuration = 1.0; // Morph from circles to target

        // Step 1: Morph all current paths to circles
        currentPaths.forEach(path => {
          timeline.to(path, {
            morphSVG: circlePath,
            duration: circleTransitionDuration,
            ease: 'power2.inOut',
          }, 0);
        });

        // Step 2: Create and fade in additional circles - start near end of circle morph
        const additionalCircles: SVGPathElement[] = [];
        const numToCreate = targetPaths.length - currentPaths.length;
        for (let i = 0; i < numToCreate; i++) {
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          circle.setAttribute('d', circlePath);
          circle.setAttribute('fill', '#8B9D83');
          circle.style.opacity = '0';
          svg.appendChild(circle);
          additionalCircles.push(circle);

          timeline.to(circle, {
            opacity: 1,
            duration: circleFadeDuration,
            ease: 'power1.inOut',
          }, circleTransitionDuration * 0.7); // Start near end so circle is visible
        }

        // Step 3: Wait for circles to fully form, THEN morph to target
        const allCircles = [...currentPaths, ...additionalCircles];
        const morphStartTime = circleTransitionDuration + circleFadeDuration; // Start AFTER circles are fully formed
        allCircles.forEach((circle, i) => {
          timeline.to(circle, {
            morphSVG: { shape: targetPaths[i], type: 'rotational' },
            duration: targetMorphDuration,
            ease: 'power2.inOut',
          }, morphStartTime);
        });

      } else if (currentPaths.length > targetPaths.length) {
        // Need FEWER paths (e.g., logo 4 → smile 3)
        // Smooth transition with visible circle intermediate state
        const circleTransitionDuration = 0.8; // Morph to circles
        const circleFadeDuration = 0.3; // Fade out extra circles
        const targetMorphDuration = 1.0; // Morph from circles to target

        // Step 1: Morph all to circles
        currentPaths.forEach(path => {
          timeline.to(path, {
            morphSVG: circlePath,
            duration: circleTransitionDuration,
            ease: 'power2.inOut',
          }, 0);
        });

        // Step 2: Fade out extra circles - start near end of circle morph
        const numToRemove = currentPaths.length - targetPaths.length;
        currentPaths.slice(-numToRemove).forEach(path => {
          timeline.to(path, {
            opacity: 0,
            duration: circleFadeDuration,
            ease: 'power1.inOut',
            onComplete: () => path.remove(),
          }, circleTransitionDuration * 0.7); // Start near end so circle is visible
        });

        // Step 3: Wait for circles to fully form, THEN morph to target
        const morphStartTime = circleTransitionDuration + circleFadeDuration; // Start AFTER circles are fully formed
        currentPaths.slice(0, targetPaths.length).forEach((circle, i) => {
          timeline.to(circle, {
            morphSVG: { shape: targetPaths[i], type: 'rotational' },
            duration: targetMorphDuration,
            ease: 'power2.inOut',
          }, morphStartTime);
        });

      } else {
        // Same number of paths - direct morph
        currentPaths.forEach((path, i) => {
          timeline.to(path, {
            morphSVG: { shape: targetPaths[i], type: 'rotational' },
            duration: CONFIG.morphDuration,
            ease: 'power2.inOut',
          }, 0);
        });
      }
    }

    // Wait for morph to complete
    await timeline;

    currentIndex = nextIndex;

    // Mark that we've completed one loop when we return to logo
    if (nextIndex === 0) isLooping = true;

    // Wait before next morph (use custom hold time or default)
    const holdTime = nextShape.holdTime || CONFIG.textHold;
    await gsap.to({}, { duration: holdTime });

    // Continue the loop
    morphToNext();
  }

  // Start the animation - show initial text immediately (no fade)
  textElement.textContent = sequenceData[0].text;
  gsap.set(textElement, { opacity: 1, filter: 'blur(0px)' });
  await gsap.to({}, { duration: CONFIG.textHold });
  morphToNext();
}

// Initialize on page load
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroMorph);
  } else {
    initHeroMorph();
  }

  // Support Astro page transitions
  document.addEventListener('astro:page-load', initHeroMorph);
}
