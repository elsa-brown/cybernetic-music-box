import * as Tone from "tone";
import initPoem from "./modules/initPoem";

const init = () => {
  // Reset
  window.onbeforeunload = () => {
    window.scrollTo(0, 0);
    Tone?.getContext().close();
  };

  // Add Poem to DOM
  const poem = initPoem();

  // Initialize Audio
  const audioButton = document.querySelector("button.audio");
  audioButton.addEventListener("click", async (evt) => {
    await Tone.start();

    const button = evt.target;
    button.disabled = true;
    button.innerHTML = "Audio is on. Scroll to Play.";

    // Make Line Synths
    const lineSynths = new Map();
    const lines = [...poem.getElementsByTagName("P")];

    lines.forEach((line, index) => {
      line.id = index;

      const env = new Tone.AmplitudeEnvelope({
        attack: 0.1,
        decay: 0.05,
        sustain: 0.01,
        release: 0.02,
      }).toDestination();
      const osc = new Tone.Oscillator({
        type: "sine",
        volume: -25,
        frequency: line.dataset.code,
      });

      lineSynths.set(index, { osc, env });
    });

    // Play Line Synths on Scroll
    let center = window.innerHeight / 2;

    window.addEventListener("resize", () => {
      const nextCenter = window.innerHeight / 2;
      if (nextCenter !== center) {
        center = nextCenter;
      }
    });

    const playCenterLine = () => {
      for (const line of lines) {
        const { height, top } = line.getBoundingClientRect();
        const offset = height / 2;

        if (top >= center - offset && top <= center + offset) {
          const { osc, env } = lineSynths.get(+line.id);
          osc.connect(env).start().stop("+1n");
          env.triggerAttack();

          line.classList.add("flicker");
        } else if (line.classList.contains("flicker")) {
          line.classList.remove("flicker");
        }
      }
    };

    document.addEventListener("scroll", playCenterLine);

    // Make Char Synth
    const charSynth = new Tone.AMSynth().toDestination();

    const chars = poem.getElementsByTagName("SPAN");
    [...chars].forEach((char) => {
      const frequency = char.dataset.code;

      ["mouseenter", "touchstart"].forEach((event) => {
        char.addEventListener(event, () => {
          char.classList.add("flicker");
          charSynth.triggerAttackRelease(frequency, "0.25");
        });
      });

      ["mouseleave", "touchend"].forEach((event) => {
        char.addEventListener(event, () => {
          char.classList.remove("flicker");
        });
      });
    });
  });
};

/* START */
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", () => init());
} else {
  init();
}
