import poemText from "./poem";

const initPoem = () => {
  const poem = document.querySelector(".poem");
  const poemLines = poemText.split("\n");

  for (const line of poemLines) {
    const p = document.createElement("p");
    poem.appendChild(p);

    let charCodeTotal = 0;
    let lineCode = 0;
    const chars = line.split("");

    chars.forEach((char, i) => {
      if (char === "~") {
        p.replaceWith(document.createElement("br"));
      }

      const span = document.createElement("span");
      span.innerHTML = char;
      p.appendChild(span);

      const charCode = line.charCodeAt(i);
      span.dataset.code = charCode;

      charCodeTotal += charCode;
      lineCode += Math.floor(charCodeTotal / line.length);
    });

    p.dataset.code = lineCode;
  }

  poemLines.forEach((line) => {});

  return poem;
};

export default initPoem;
