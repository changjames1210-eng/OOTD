const initialItems = [
  { name: 'Ribbed t-shirt', type: 'Top', color: 'Sage green', size: 'M' },
  { name: 'Collared long sleeve', type: 'Top', color: 'Cherry red', size: 'L' },
  { name: 'Straight-leg denim', type: 'Bottom', color: 'Indigo', size: '30' },
  { name: 'Pleated trousers', type: 'Bottom', color: 'Black', size: 'M' },
  { name: 'Canvas sneakers', type: 'Shoes', color: 'Cream', size: '8' },
  { name: 'Gold watch', type: 'Accessory', color: 'Gold', size: 'One size' }
];
let closet = JSON.parse(localStorage.getItem('ootd-closet') || 'null') || initialItems;
let activeFilter = 'All';
const icons = { Top: '♧', Bottom: '▰', Shoes: '⌁', Accessory: '◌', Layer: '◇' };
const colorMap = { sagegreen:'#96a88b',cherryred:'#ca4134',indigo:'#41577e',black:'#292a2a',cream:'#eadbb9',gold:'#d4a930',forestgreen:'#2e6545',white:'#f9f8f2',blue:'#557ba7',brown:'#765647',grey:'#92908b',gray:'#92908b',red:'#bd4034',green:'#548051' };

function getColor(color) { const key = color.toLowerCase().replace(/[^a-z]/g, ''); return colorMap[key] || '#cabca8'; }
function save() { localStorage.setItem('ootd-closet', JSON.stringify(closet)); }
function renderCloset() {
  const shown = activeFilter === 'All' ? closet : closet.filter(i => i.type === activeFilter);
  document.getElementById('itemsGrid').innerHTML = shown.length ? shown.map(item => {
    const index = closet.indexOf(item);
    return `<article class="closet-item"><button class="remove" aria-label="Remove ${item.name}" data-index="${index}">×</button><div class="item-swatch" style="background:${getColor(item.color)}"></div><div class="item-type">${item.type}</div><div class="item-name">${item.name}</div><div class="item-details">${item.color}${item.size ? ' · ' + item.size : ''}</div></article>`;
  }).join('') : '<p class="empty">Nothing here yet — add a piece to get started.</p>';
  document.getElementById('closetCount').textContent = closet.length;
}
function pick(type) { const choices = closet.filter(item => item.type === type); return choices[Math.floor(Math.random() * choices.length)]; }
function showOutfit() {
  const pieces = ['Top', 'Bottom', 'Shoes'];
  if (document.getElementById('accessories').checked && closet.some(i => i.type === 'Accessory')) pieces.push('Accessory');
  const selected = pieces.map(pick).filter(Boolean);
  const display = document.getElementById('outfitDisplay');
  display.innerHTML = selected.length ? selected.map(item => `<article class="outfit-piece"><div><div class="piece-icon">${icons[item.type]}</div><div class="piece-type">${item.type}</div></div><div><div class="piece-name">${item.name}</div><div class="piece-meta">${item.color}${item.size ? ' · ' + item.size : ''}</div></div></article>`).join('') : '<p>Add a few closet pieces first, then we can style you.</p>';
  const occasion = document.getElementById('occasion').value.toLowerCase();
  document.getElementById('resultSummary').textContent = `A ${document.getElementById('vibe').value.toLowerCase()} look for ${occasion}.`;
  document.getElementById('result').classList.remove('hidden');
  document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'center' });
}
document.querySelectorAll('.pill').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.pill').forEach(b => b.classList.remove('selected')); button.classList.add('selected'); document.getElementById('occasion').value = button.dataset.occasion; }));
document.getElementById('outfitForm').addEventListener('submit', event => { event.preventDefault(); showOutfit(); });
document.getElementById('reroll').addEventListener('click', showOutfit);
document.getElementById('addItemForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('itemName');
  const type = document.getElementById('itemType');
  const color = document.getElementById('itemColor');
  const size = document.getElementById('itemSize');
  closet.unshift({ name: name.value.trim(), type: type.value, color: color.value.trim(), size: size.value.trim() });
  save();
  renderCloset();
  event.target.reset();
  name.focus();
});
document.getElementById('itemsGrid').addEventListener('click', event => { const button = event.target.closest('.remove'); if (!button) return; closet.splice(Number(button.dataset.index), 1); save(); renderCloset(); });
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => { activeFilter = button.dataset.filter; document.querySelectorAll('.filter').forEach(b => b.classList.toggle('active', b === button)); renderCloset(); }));
renderCloset();
