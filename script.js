(() => {
  'use strict';
  const HISTORY_KEY = 'electracalc-history-v1';
  const titles = {
    ohms: ["Ohm's Law Calculator", 'Calculate voltage, current, or resistance from two known values.'],
    power: ['Electrical Power Calculator', 'Calculate electrical power and related DC circuit values.'],
    series: ['Series Resistance Calculator', 'Find total resistance for resistors connected in series.'],
    parallel: ['Parallel Resistance Calculator', 'Find equivalent resistance for resistors connected in parallel.'],
    history: ['Calculation History', 'Review calculations you have completed in this browser.']
  };
  const $ = id => document.getElementById(id);
  const number = id => {
    const raw = $(id).value.trim();
    if (raw === '') throw new Error('Please fill in both required values.');
    const value = Number(raw);
    if (!Number.isFinite(value) || value < 0) throw new Error('Enter valid non-negative numbers.');
    return value;
  };
  const format = value => Number.isFinite(value) ? Number(value.toPrecision(8)).toLocaleString(undefined, { maximumFractionDigits: 8 }) : 'Not defined';
  function clearResult(id) {
    const box = $(id); box.classList.add('hidden'); box.style.background = ''; box.style.borderColor = ''; box.replaceChildren();
  }
  function showResult(id, label, value, unit, formula, details) {
    const box = $(id); box.classList.remove('hidden'); box.style.background = ''; box.style.borderColor = ''; box.replaceChildren();
    const labelEl = document.createElement('div'); labelEl.className = 'result-label'; labelEl.textContent = label;
    const valueEl = document.createElement('div'); valueEl.className = 'result-value'; valueEl.textContent = `${format(value)} ${unit}`;
    const formulaEl = document.createElement('div'); formulaEl.className = 'result-formula'; formulaEl.textContent = `${formula}${details ? ' · ' + details : ''}`;
    box.append(labelEl, valueEl, formulaEl);
  }
  function showError(id, message) {
    const box = $(id); box.classList.remove('hidden'); box.style.background = '#fff5f5'; box.style.borderColor = '#f5caca'; box.replaceChildren();
    const el = document.createElement('div'); el.style.color = '#a52727'; el.style.fontSize = '12px'; el.textContent = message; box.append(el);
  }
  function readHistory() {
    try { const value = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); return Array.isArray(value) ? value : []; }
    catch (_) { return []; }
  }
  function record(title, result, details, formula) {
    const entries = readHistory(); entries.unshift({ title, result, details, formula, date: new Date().toISOString() });
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, 50))); } catch (_) { /* History remains optional if storage is blocked. */ }
  }
  function renderHistory() {
    const list = $('history-list'); list.replaceChildren(); const history = readHistory();
    if (!history.length) { const empty = document.createElement('div'); empty.className = 'empty-state'; empty.textContent = 'No calculations yet. Complete a calculation and it will appear here.'; list.append(empty); return; }
    history.forEach(entry => {
      const row = document.createElement('div'); row.className = 'history-entry';
      const details = document.createElement('div'); const heading = document.createElement('strong'); heading.textContent = `${entry.title}: ${entry.result}`;
      const desc = document.createElement('p'); desc.textContent = `${entry.details} · ${entry.formula}`; details.append(heading, desc);
      const time = document.createElement('time'); time.dateTime = entry.date; time.textContent = new Date(entry.date).toLocaleString(); row.append(details, time); list.append(row);
    });
  }
  document.querySelectorAll('.nav-item').forEach(button => button.addEventListener('click', () => {
    const view = button.dataset.view;
    document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item === button));
    document.querySelectorAll('.view').forEach(section => section.classList.toggle('active', section.id === `view-${view}`));
    $('page-title').textContent = titles[view][0]; $('page-subtitle').textContent = titles[view][1]; if (view === 'history') renderHistory();
  }));
  function configureFields(prefix, target, fields) { fields.forEach(field => { const wrap = $(`${prefix}-${field}-wrap`); if (wrap) wrap.classList.toggle('hidden-field', field === target); }); }
  const ohmsFields = ['voltage', 'current', 'resistance'];
  $('ohms-target').addEventListener('change', () => configureFields('ohms', $('ohms-target').value, ohmsFields));
  const powerFields = ['power', 'voltage', 'current', 'resistance'];
  $('power-target').addEventListener('change', () => configureFields('power', $('power-target').value, powerFields));
  configureFields('ohms', $('ohms-target').value, ohmsFields); configureFields('power', $('power-target').value, powerFields);

  $('calculate-ohms').addEventListener('click', () => {
    const target = $('ohms-target').value; clearResult('ohms-result');
    try {
      let result, unit, formula, details;
      if (target === 'voltage') { const current = number('ohms-current'), resistance = number('ohms-resistance'); result = current * resistance; unit = 'V'; formula = 'V = I × R'; details = `${format(current)} A × ${format(resistance)} Ω`; }
      else if (target === 'current') { const voltage = number('ohms-voltage'), resistance = number('ohms-resistance'); if (resistance === 0) throw new Error('Resistance must be greater than zero to calculate current.'); result = voltage / resistance; unit = 'A'; formula = 'I = V ÷ R'; details = `${format(voltage)} V ÷ ${format(resistance)} Ω`; }
      else { const voltage = number('ohms-voltage'), current = number('ohms-current'); if (current === 0) throw new Error('Current must be greater than zero to calculate resistance.'); result = voltage / current; unit = 'Ω'; formula = 'R = V ÷ I'; details = `${format(voltage)} V ÷ ${format(current)} A`; }
      showResult('ohms-result', 'CALCULATION RESULT', result, unit, formula, details); record("Ohm's law", `${format(result)} ${unit}`, details, formula);
    } catch (error) { showError('ohms-result', error.message); }
  });
  $('reset-ohms').addEventListener('click', () => { ohmsFields.forEach(field => $(`ohms-${field}`).value = ''); clearResult('ohms-result'); });

  $('calculate-power').addEventListener('click', () => {
    const target = $('power-target').value; clearResult('power-result');
    try {
      let result, unit, formula, details;
      if (target === 'power') { const voltage = number('power-voltage'), current = number('power-current'); result = voltage * current; unit = 'W'; formula = 'P = V × I'; details = `${format(voltage)} V × ${format(current)} A`; }
      else if (target === 'voltage') { const power = number('power-power'), current = number('power-current'); if (current === 0) throw new Error('Current must be greater than zero to calculate voltage from power.'); result = power / current; unit = 'V'; formula = 'V = P ÷ I'; details = `${format(power)} W ÷ ${format(current)} A`; }
      else if (target === 'current') { const power = number('power-power'), voltage = number('power-voltage'); if (voltage === 0) throw new Error('Voltage must be greater than zero to calculate current from power.'); result = power / voltage; unit = 'A'; formula = 'I = P ÷ V'; details = `${format(power)} W ÷ ${format(voltage)} V`; }
      else { const voltage = number('power-voltage'), power = number('power-power'); if (power === 0) throw new Error('Power must be greater than zero to calculate resistance from voltage.'); result = voltage * voltage / power; unit = 'Ω'; formula = 'R = V² ÷ P'; details = `${format(voltage)}² ÷ ${format(power)}`; }
      showResult('power-result', 'CALCULATION RESULT', result, unit, formula, details); record('Electrical power', `${format(result)} ${unit}`, details, formula);
    } catch (error) { showError('power-result', error.message); }
  });
  $('reset-power').addEventListener('click', () => { powerFields.forEach(field => $(`power-${field}`).value = ''); clearResult('power-result'); });

  function parseResistors(id, allowZero) {
    const raw = $(id).value.trim(); if (!raw) throw new Error('Enter at least two resistor values.');
    const parts = raw.split(/[\s,;]+/).filter(Boolean); const values = parts.map(Number);
    if (values.length < 2) throw new Error('Enter at least two resistor values.');
    if (values.some(value => !Number.isFinite(value) || value < 0 || (!allowZero && value === 0))) throw new Error(allowZero ? 'Enter valid non-negative resistance values.' : 'All parallel resistance values must be positive numbers.');
    return values;
  }
  $('calculate-series').addEventListener('click', () => {
    clearResult('series-result');
    try { const values = parseResistors('series-values', true); const total = values.reduce((sum, value) => sum + value, 0); const details = values.map(value => `${format(value)} Ω`).join(' + '); showResult('series-result', 'TOTAL RESISTANCE', total, 'Ω', 'Rₜ = R₁ + R₂ + … + Rₙ', details); record('Series circuit', `${format(total)} Ω`, details, 'Rₜ = sum of resistances'); }
    catch (error) { showError('series-result', error.message); }
  });
  $('reset-series').addEventListener('click', () => { $('series-values').value = ''; clearResult('series-result'); });
  $('calculate-parallel').addEventListener('click', () => {
    clearResult('parallel-result');
    try {
      const values = parseResistors('parallel-values', true); let total, formula;
      if (values.some(value => value === 0)) { total = 0; formula = 'A zero-ohm branch is an ideal short circuit.'; }
      else { total = 1 / values.reduce((sum, value) => sum + 1 / value, 0); formula = 'Rₜ = 1 ÷ (1/R₁ + 1/R₂ + … + 1/Rₙ)'; }
      const details = values.map(value => `${format(value)} Ω`).join(' ∥ '); showResult('parallel-result', 'EQUIVALENT RESISTANCE', total, 'Ω', formula, details); record('Parallel circuit', `${format(total)} Ω`, details, 'Reciprocal sum formula');
    } catch (error) { showError('parallel-result', error.message); }
  });
  $('reset-parallel').addEventListener('click', () => { $('parallel-values').value = ''; clearResult('parallel-result'); });
  $('clear-history').addEventListener('click', () => { try { localStorage.removeItem(HISTORY_KEY); } catch (_) {} renderHistory(); });
  renderHistory();
})();
