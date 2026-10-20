# ElectraCalc — Electrical Circuit Calculator

A responsive, browser-based educational calculator for basic electrical engineering calculations. Built with HTML, CSS, and vanilla JavaScript.

## Features
- Ohm's law: calculate voltage, current, or resistance.
- Electrical power: calculate power, voltage, current, or resistance using supported equations.
- Series resistor network equivalent resistance.
- Parallel resistor network equivalent resistance.
- Input validation and readable calculation steps.
- Calculation history saved in browser `localStorage`.
- Responsive layout for desktop and mobile.
- No dependencies, server, or database required.

## Run locally
1. Extract the project folder if downloaded as a ZIP.
2. Open `index.html` in a modern web browser.
3. Optional: open the folder in Visual Studio Code and use the Live Server extension.

## Project files
- `index.html` — application structure and calculator views.
- `style.css` — responsive styling.
- `script.js` — formulas, validation, navigation, and history.

## Formulas
### Ohm's law
- `V = I × R`
- `I = V ÷ R` (requires `R > 0`)
- `R = V ÷ I` (requires `I > 0`)

### Electrical power
- `P = V × I`
- `V = P ÷ I` (requires `I > 0`)
- `I = P ÷ V` (requires `V > 0`)
- `R = V² ÷ P` (requires `P > 0`)

### Series resistance
`R_total = R1 + R2 + ... + Rn`

### Parallel resistance
`R_total = 1 ÷ (1/R1 + 1/R2 + ... + 1/Rn)`

An ideal zero-ohm branch makes the parallel equivalent resistance zero.

## Test examples
- Ohm's law: `I = 2 A`, `R = 6 Ω` → `V = 12 V`.
- Power: `V = 12 V`, `I = 2 A` → `P = 24 W`.
- Series: `100 Ω, 220 Ω, 330 Ω` → `650 Ω`.
- Parallel: `100 Ω, 100 Ω` → `50 Ω`.

## Safety note
This project is for education and basic calculations. It does not replace professional engineering design, applicable electrical codes, or safety procedures. The power calculations assume compatible values for the same DC circuit operating point; AC circuits may require RMS and power-factor calculations not included here.
