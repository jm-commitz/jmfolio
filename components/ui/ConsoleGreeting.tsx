'use client';

import { useEffect } from 'react';

// DevTools easter egg: a colour ANSI-art banner in the browser console for
// curious developers, logged once per page load. Each line is a list of
// [text, color, background] runs, rendered with one %c style per run
// (black background where the art has none, like a terminal).
type Run = [text: string, color: string, background: string];

const ART: Run[][] = [
  [["▄▄▄","#0000AA",""],["▀▀▀","#0000AA","#AAAAAA"],["█","#0000AA",""],["                       ","#AAAAAA",""],["▄▄▄","#0000AA",""],["▀▀▀","#0000AA","#AAAAAA"],["█","#0000AA",""],["                ","#AAAAAA",""]],
  [[" ","#AAAAAA",""],["█","#0000AA",""],["   ","#0000AA","#AAAAAA"],["█","#0000AA",""],["                         ","#AAAAAA",""],["█","#0000AA",""],["   ","#0000AA","#AAAAAA"],["█","#0000AA",""],["                 ","#AAAAAA",""]],
  [[" ","#AAAAAA",""],["█","#0000AA",""],[" ░ ","#0000AA","#AAAAAA"],["█","#0000AA",""],["            ","#AAAAAA",""],["▀","#000000","#0000AA"],["▄▄▄▄▄▄▄","#AAAAAA","#0000AA"],["▀","#000000","#0000AA"],["    ","#AAAAAA",""],["█","#0000AA",""],[" ░ ","#0000AA","#AAAAAA"],["█","#0000AA",""],["    ","#AAAAAA",""],["▄","#0000AA",""],["▀▀","#0000AA","#AAAAAA"],["▒▀▀▄","#AAAAAA",""],["█","#0000AA",""],["▄▄","#AAAAAA","#0000AA"],["▄▄▄","#0000AA",""]],
  [[" ","#AAAAAA",""],["█","#0000AA",""],["░▒░","#0000AA","#AAAAAA"],["█","#0000AA",""],["           ","#AAAAAA",""],["█","#0000AA",""],["█▓█","#AAAAAA","#0000AA"],["█▀█","#0000AA",""],["█▓█","#AAAAAA","#0000AA"],["█","#0000AA",""],["   ","#AAAAAA",""],["█","#0000AA",""],["░▒░","#0000AA","#AAAAAA"],["█","#0000AA",""],["   ","#AAAAAA",""],["█","#0000AA",""],[" ░ ","#0000AA","#AAAAAA"],["█","#0000AA",""],["   ░","#AAAAAA",""],["█▓█","#AAAAAA","#0000AA"],["█","#0000AA",""],[" ","#AAAAAA",""]],
  [[" ","#AAAAAA",""],["█","#0000AA",""],["▒▓▒","#0000AA","#AAAAAA"],["▄▀▀▓","#AAAAAA",""],["▄▄▄","#AAAAAA","#0000AA"],["■▄","#0000AA",""],["  ","#AAAAAA",""],["█","#0000AA",""],["▓▒▓ ","#AAAAAA","#0000AA"],["   ","#AAAAAA",""],[" ▓▒▓","#AAAAAA","#0000AA"],["█","#0000AA",""],["  ","#AAAAAA",""],["█","#0000AA",""],["▒▓▒","#0000AA","#AAAAAA"],["█","#0000AA",""],["  ","#AAAAAA",""],["█","#0000AA",""],["░▒░","#0000AA","#AAAAAA"],["█","#0000AA",""],["    ","#AAAAAA",""],["█","#0000AA",""],["▓▒▓","#AAAAAA","#0000AA"],["█","#0000AA",""],[" ","#AAAAAA",""]],
  [[" ","#AAAAAA",""],["█","#0000AA",""],["▓█▓","#0000AA","#AAAAAA"],["░","#AA00AA","#0000AA"],["  ","#AAAAAA",""],["▐","#0000AA",""],["▐","#AAAAAA","#0000AA"],["░","#0000AA","#AAAAAA"],["▓█▌","#AAAAAA","#0000AA"],["▌","#0000AA",""],[" ","#AAAAAA",""],["█","#0000AA",""],["▒░▒","#AAAAAA","#0000AA"],["▓","#0000AA",""],["   ","#AAAAAA",""],["▓","#0000AA",""],["▒░▒","#AAAAAA","#0000AA"],["█","#0000AA",""],["  ","#AAAAAA",""],["█","#0000AA",""],["▓█▓","#0000AA","#AAAAAA"],["░","#AA00AA","#0000AA"],["  ","#AAAAAA",""],["█","#0000AA",""],["▒▓▒","#0000AA","#AAAAAA"],["█","#0000AA",""],["    ","#AAAAAA",""],["█","#0000AA",""],["▒░▒","#AAAAAA","#0000AA"],["░","#AA00AA","#0000AA"],[" ","#AAAAAA",""]],
  [[" ","#AAAAAA",""],["█","#0000AA",""],[" ","#0000AA","#0000AA"],["░ ","#5555FF","#0000AA"],["▒","#AA00AA","#0000AA"],["   ","#AAAAAA",""],["█","#0000AA",""],["▓▒▓█","#AAAAAA","#0000AA"],["░","#AA00AA","#0000AA"],[" ","#AAAAAA",""],["█","#0000AA",""],["░ ░","#AAAAAA","#0000AA"],["▓","#0000AA",""],["   ","#AAAAAA",""],["▓","#0000AA",""],["░ ░","#AAAAAA","#0000AA"],["█","#0000AA",""],["  ","#AAAAAA",""],["█","#0000AA",""],[" ","#0000AA","#0000AA"],["░ ","#5555FF","#0000AA"],["▒","#AA00AA","#0000AA"],["  ","#AAAAAA",""],["█","#0000AA",""],["▓█▓","#0000AA","#AAAAAA"],["█","#0000AA",""],["    ","#AAAAAA",""],["█","#0000AA",""],["░ ░","#AAAAAA","#0000AA"],["▒","#AA00AA","#0000AA"],[" ","#AAAAAA",""]],
  [[" ","#AAAAAA",""],["█","#0000AA",""],["░▒░","#5555FF","#0000AA"],["▓","#AA00AA","#0000AA"],["   ","#AAAAAA",""],["█","#0000AA",""],["▒░░▒","#AAAAAA","#0000AA"],["▒","#AA00AA","#0000AA"],["  ","#AAAAAA",""],["█","#0000AA",""],[" ","#0000AA","#0000AA"],["░▒ ","#5555FF","#0000AA"],["▄","#0000AA",""],[" ▒░","#5555FF","#0000AA"],[" ","#0000AA","#0000AA"],["█","#0000AA",""],["   ","#AAAAAA",""],["█","#0000AA",""],["░▒░","#5555FF","#0000AA"],["▓","#AA00AA","#0000AA"],["   ","#AAAAAA",""],["█","#0000AA",""],["░▒░ ","#5555FF","#0000AA"],["▄","#0000AA",""],[" ","#AAAAAA",""],["▄","#AA00AA",""],["█","#0000AA",""],[" ","#0000AA","#0000AA"],["░ ","#5555FF","#0000AA"],["▓","#AA00AA","#0000AA"],[" ","#AAAAAA",""]],
  [[" ","#AAAAAA",""],["█","#0000AA",""],["▀▀▀ ","#0000AA","#AA00AA"],["   ","#AAAAAA",""],["█","#0000AA",""],["░","#5555FF","#0000AA"],["▄▄▄▓","#AA00AA","#0000AA"],["   ","#AAAAAA",""],["▀","#AA00AA",""],["▄▄▄","#AA00AA","#0000AA"],["■","#AA00AA",""],["▄▄▄","#AA00AA","#0000AA"],["▀","#AA00AA",""],["    ","#AAAAAA",""],["█","#0000AA",""],["▀▀▀ ","#0000AA","#AA00AA"],["     ","#AAAAAA",""],["▀","#0000AA",""],["▀▀▀▀","#AA00AA",""],["  ","#AAAAAA",""],["▀■","#AA00AA",""],["▄","#AA00AA","#0000AA"],["█▄","#AA00AA",""]],
  [["▀▀","#0000AA",""],["     ","#AAAAAA",""],["■▀","#0000AA",""],["▀▀","#AA00AA",""],["                   ","#AAAAAA",""],["▀▀","#0000AA",""],["                     ","#AAAAAA",""]],
];

const REPO = 'https://github.com/jm-commitz/jmfolio';
const FONT =
  "font-family: 'Courier New', Courier, ui-monospace, monospace; font-size: 12px; line-height: 1.17;";

let greeted = false; // dev StrictMode runs effects twice — log only once

export default function ConsoleGreeting() {
  useEffect(() => {
    if (greeted) return;
    greeted = true;

    // One %c segment per coloured run; a newline closes every line but the last.
    let format = '';
    const styles: string[] = [];
    ART.forEach((line, i) => {
      line.forEach(([text, color, background], j) => {
        const end = j === line.length - 1 && i < ART.length - 1 ? '\n' : '';
        format += `%c${text}${end}`;
        styles.push(`${FONT} color: ${color}; background: ${background || '#000'};`);
      });
    });
    console.log(format, ...styles);

    console.log(
      `%cHey, fellow developer 👋%c\nPoking around? This portfolio is open source — fork it and make it yours:\n${REPO}`,
      'font-size: 14px; font-weight: 700;',
      'font-size: 12px; color: #a1a1a1;',
    );
  }, []);

  return null;
}

