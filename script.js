/* ============================================================
   Reference data (pulled from the trained pipeline's encoder)
   ============================================================ */
const NEIGHBOURHOOD_GROUPS = ["Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"];

const NEIGHBOURHOODS = ["Allerton", "Arden Heights", "Arrochar", "Arverne", "Astoria", "Bath Beach", "Battery Park City", "Bay Ridge", "Bay Terrace", "Bay Terrace, Staten Island", "Baychester", "Bayside", "Bayswater", "Bedford-Stuyvesant", "Belle Harbor", "Bellerose", "Belmont", "Bensonhurst", "Bergen Beach", "Boerum Hill", "Borough Park", "Breezy Point", "Briarwood", "Brighton Beach", "Bronxdale", "Brooklyn Heights", "Brownsville", "Bull's Head", "Bushwick", "Cambria Heights", "Canarsie", "Carroll Gardens", "Castle Hill", "Castleton Corners", "Chelsea", "Chinatown", "City Island", "Civic Center", "Claremont Village", "Clason Point", "Clifton", "Clinton Hill", "Co-op City", "Cobble Hill", "College Point", "Columbia St", "Concord", "Concourse", "Concourse Village", "Coney Island", "Corona", "Crown Heights", "Cypress Hills", "DUMBO", "Ditmars Steinway", "Dongan Hills", "Douglaston", "Downtown Brooklyn", "Dyker Heights", "East Elmhurst", "East Flatbush", "East Harlem", "East Morrisania", "East New York", "East Village", "Eastchester", "Edenwald", "Edgemere", "Elmhurst", "Eltingville", "Emerson Hill", "Far Rockaway", "Fieldston", "Financial District", "Flatbush", "Flatiron District", "Flatlands", "Flushing", "Fordham", "Forest Hills", "Fort Greene", "Fort Hamilton", "Fresh Meadows", "Glendale", "Gowanus", "Gramercy", "Graniteville", "Grant City", "Gravesend", "Great Kills", "Greenpoint", "Greenwich Village", "Grymes Hill", "Harlem", "Hell's Kitchen", "Highbridge", "Hollis", "Holliswood", "Howard Beach", "Howland Hook", "Huguenot", "Hunts Point", "Inwood", "Jackson Heights", "Jamaica", "Jamaica Estates", "Jamaica Hills", "Kensington", "Kew Gardens", "Kew Gardens Hills", "Kingsbridge", "Kips Bay", "Laurelton", "Little Italy", "Little Neck", "Long Island City", "Longwood", "Lower East Side", "Manhattan Beach", "Marble Hill", "Mariners Harbor", "Maspeth", "Melrose", "Middle Village", "Midland Beach", "Midtown", "Midwood", "Mill Basin", "Morningside Heights", "Morris Heights", "Morris Park", "Morrisania", "Mott Haven", "Mount Eden", "Mount Hope", "Murray Hill", "Navy Yard", "Neponsit", "New Brighton", "New Dorp", "New Dorp Beach", "New Springville", "NoHo", "Nolita", "North Riverdale", "Norwood", "Oakwood", "Olinville", "Ozone Park", "Park Slope", "Parkchester", "Pelham Bay", "Pelham Gardens", "Port Morris", "Port Richmond", "Prince's Bay", "Prospect Heights", "Prospect-Lefferts Gardens", "Queens Village", "Randall Manor", "Red Hook", "Rego Park", "Richmond Hill", "Ridgewood", "Riverdale", "Rockaway Beach", "Roosevelt Island", "Rosebank", "Rosedale", "Rossville", "Schuylerville", "Sea Gate", "Sheepshead Bay", "Shore Acres", "Silver Lake", "SoHo", "Soundview", "South Beach", "South Ozone Park", "South Slope", "Springfield Gardens", "Spuyten Duyvil", "St. Albans", "St. George", "Stapleton", "Stuyvesant Town", "Sunnyside", "Sunset Park", "Theater District", "Throgs Neck", "Todt Hill", "Tompkinsville", "Tottenville", "Tremont", "Tribeca", "Two Bridges", "Unionport", "University Heights", "Upper East Side", "Upper West Side", "Van Nest", "Vinegar Hill", "Wakefield", "Washington Heights", "West Brighton", "West Farms", "West Village", "Westchester Square", "Westerleigh", "Whitestone", "Williamsbridge", "Williamsburg", "Willowbrook", "Windsor Terrace", "Woodhaven", "Woodlawn", "Woodside"];

/* Maps the model's class labels to a slug used for color + copy */
const TYPE_META = {
  "Entire home/apt": { slug: "entire", short: "an entire home or apartment" },
  "Private room":    { slug: "private", short: "a private room" },
  "Shared room":     { slug: "shared", short: "a shared room" }
};

/* ============================================================
   Skyline window lights
   ============================================================ */
(function buildSkylineLights() {
  const container = document.getElementById('skyline');
  const layer = document.createElement('div');
  layer.className = 'skyline-lights';
  const count = window.innerWidth < 600 ? 45 : 90;
  for (let i = 0; i < count; i++) {
    const w = document.createElement('span');
    w.className = 'window';
    w.style.left = `${Math.random() * 100}%`;
    w.style.bottom = `${Math.random() * 34}vh`;
    w.style.animationDelay = `${(Math.random() * 6).toFixed(2)}s`;
    w.style.animationDuration = `${(4 + Math.random() * 5).toFixed(2)}s`;
    layer.appendChild(w);
  }
  container.appendChild(layer);
})();

/* ============================================================
   Populate location inputs
   ============================================================ */
const groupSelect = document.getElementById('neighbourhood_group');
NEIGHBOURHOOD_GROUPS.forEach(g => {
  const opt = document.createElement('option');
  opt.value = g;
  opt.textContent = g;
  groupSelect.appendChild(opt);
});

const neighDatalist = document.getElementById('neighbourhood-list');
NEIGHBOURHOODS.forEach(n => {
  const opt = document.createElement('option');
  opt.value = n;
  neighDatalist.appendChild(opt);
});

/* ============================================================
   Hero scroll
   ============================================================ */
document.getElementById('startBtn').addEventListener('click', () => {
  document.getElementById('wizardWrap').scrollIntoView({ behavior: 'smooth' });
});

/* ============================================================
   Wizard navigation
   ============================================================ */
const steps = Array.from(document.querySelectorAll('.step'));
const progressSteps = Array.from(document.querySelectorAll('.progress-step'));
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const formError = document.getElementById('formError');
let current = 1;
const totalSteps = steps.length;

function showStep(n) {
  steps.forEach(s => s.classList.toggle('active', Number(s.dataset.step) === n));
  progressSteps.forEach(p => {
    const stepNum = Number(p.dataset.step);
    p.classList.toggle('active', stepNum === n);
    p.classList.toggle('done', stepNum < n);
  });
  backBtn.disabled = n === 1;
  nextBtn.hidden = n === totalSteps;
  submitBtn.hidden = n !== totalSteps;
  hideError();
}

function fieldsInStep(n) {
  return Array.from(document.querySelector(`.step[data-step="${n}"]`).querySelectorAll('input, select'));
}

function validateStep(n) {
  const fields = fieldsInStep(n);
  let valid = true;
  for (const f of fields) {
    if (!f.reportValidity()) valid = false;
  }
  return valid;
}

nextBtn.addEventListener('click', () => {
  if (!validateStep(current)) {
    showError('Please fill in every field before moving on.');
    return;
  }
  current = Math.min(current + 1, totalSteps);
  showStep(current);
});

backBtn.addEventListener('click', () => {
  current = Math.max(current - 1, 1);
  showStep(current);
});

function showError(msg) {
  formError.textContent = msg;
  formError.hidden = false;
}
function hideError() {
  formError.hidden = true;
}

/* range input live value */
const availabilityInput = document.getElementById('availability_365');
const availabilityValue = document.getElementById('availabilityValue');
availabilityInput.addEventListener('input', () => {
  availabilityValue.textContent = availabilityInput.value;
});

/* ============================================================
   Submit -> call API -> render result
   ============================================================ */
const form = document.getElementById('predictForm');
const resultCard = document.getElementById('resultCard');
const wizardCard = document.querySelector('.wizard-card');
const resultTitle = document.getElementById('resultTitle');
const resultBars = document.getElementById('resultBars');
const apiUrlInput = document.getElementById('apiUrl');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError();

  if (!validateStep(current)) {
    showError('Please fill in every field before predicting.');
    return;
  }

  const payload = {
    neighbourhood_group: document.getElementById('neighbourhood_group').value,
    neighbourhood: document.getElementById('neighbourhood').value,
    latitude: parseFloat(document.getElementById('latitude').value),
    longitude: parseFloat(document.getElementById('longitude').value),
    price: parseFloat(document.getElementById('price').value),
    minimum_nights: parseInt(document.getElementById('minimum_nights').value, 10),
    number_of_reviews: parseInt(document.getElementById('number_of_reviews').value, 10),
    reviews_per_month: parseFloat(document.getElementById('reviews_per_month').value),
    calculated_host_listings_count: parseInt(document.getElementById('calculated_host_listings_count').value, 10),
    availability_365: parseInt(document.getElementById('availability_365').value, 10)
  };

  setLoading(true);

  try {
    const res = await fetch(apiUrlInput.value, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Server responded ${res.status}: ${body.slice(0, 200)}`);
    }

    const data = await res.json();
    renderResult(data);
  } catch (err) {
    showError(`Couldn't reach the prediction server (${apiUrlInput.value}). ${err.message}`);
  } finally {
    setLoading(false);
  }
});

function setLoading(isLoading) {
  submitBtn.classList.toggle('is-loading', isLoading);
  submitBtn.disabled = isLoading;
  backBtn.disabled = isLoading || current === 1;
}

function renderResult(data) {
  const predicted = data.Predicted_room_type;
  const probs = data.Probability && data.Probability[0] ? data.Probability[0] : [];
  const classOrder = ["Entire home/apt", "Private room", "Shared room"];

  const meta = TYPE_META[predicted] || { slug: 'entire', short: predicted };
  resultTitle.textContent = predicted;
  resultTitle.className = `result-title type-${meta.slug}`;

  resultBars.innerHTML = '';
  classOrder.forEach((label, i) => {
    const pct = probs[i] !== undefined ? probs[i] * 100 : 0;
    const slug = TYPE_META[label].slug;

    const row = document.createElement('div');
    row.className = 'result-bar-row';
    row.innerHTML = `
      <div class="bar-top">
        <span>${label}</span>
        <span class="bar-pct">${pct.toFixed(1)}%</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill type-${slug}" style="width:0%"></div>
      </div>
    `;
    resultBars.appendChild(row);
  });

  wizardCard.hidden = true;
  document.querySelector('.progress').hidden = true;
  resultCard.hidden = false;
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // animate bars in after layout settles
  requestAnimationFrame(() => {
    setTimeout(() => {
      resultBars.querySelectorAll('.bar-fill').forEach((el, i) => {
        const pct = probs[i] !== undefined ? probs[i] * 100 : 0;
        el.style.width = `${pct}%`;
      });
    }, 60);
  });
}

document.getElementById('againBtn').addEventListener('click', () => {
  resultCard.hidden = true;
  wizardCard.hidden = false;
  document.querySelector('.progress').hidden = false;
  current = 1;
  showStep(current);
  form.reset();
  availabilityValue.textContent = availabilityInput.value;
  document.getElementById('wizardWrap').scrollIntoView({ behavior: 'smooth' });
});

/* init */
showStep(current);
