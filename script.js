const initialItems = [
  { name: 'Ribbed t-shirt', type: 'Top', color: 'Sage green', size: 'M' },
  { name: 'Collared long sleeve', type: 'Top', color: 'Cherry red', size: 'L' },
  { name: 'Straight-leg denim', type: 'Bottom', color: 'Indigo', size: '30' },
  { name: 'Pleated trousers', type: 'Bottom', color: 'Black', size: 'M' },
  { name: 'Canvas sneakers', type: 'Shoes', color: 'Cream', size: '8' },
  { name: 'Gold watch', type: 'Watch', color: 'Gold', size: 'One size' }
];
const account = JSON.parse(localStorage.getItem('ootd-current-user') || 'null');
if (!account) window.location.replace('login.html');
const closetKey = `ootd-closet-${account?.id || 'guest'}`;
let closet = JSON.parse(localStorage.getItem(closetKey) || 'null') || initialItems;
closet = closet.map(item => item.type === 'Accessory' && /watch/i.test(item.name) ? { ...item, type: 'Watch' } : item);
localStorage.setItem(closetKey, JSON.stringify(closet));
let activeFilter = 'All';
const icons = { Top: '👕', Bottom: '👖', Dress: '👗', Shoes: '👟', Accessory: '⌚', Layer: '🧥' };
const colorMap = { sagegreen:'#96a88b',cherryred:'#ca4134',indigo:'#41577e',black:'#292a2a',cream:'#eadbb9',gold:'#d4a930',forestgreen:'#2e6545',white:'#f9f8f2',blue:'#557ba7',navy:'#233a5d',skyblue:'#83bce0',brown:'#765647',beige:'#d8c5a5',tan:'#bd9164',grey:'#92908b',gray:'#92908b',red:'#bd4034',pink:'#e997a5',purple:'#8566a9',orange:'#ee7a35',yellow:'#e9c444',green:'#548051',teal:'#3c8e8d',olive:'#778241' };

function getColor(color) { const key = color.toLowerCase().replace(/[^a-z]/g, ''); return colorMap[key] || '#cabca8'; }
function garment(item) {
  const className = item.type.toLowerCase().replace(/[^a-z]/g, '');
  return `<div class="garment garment-${className}" style="--garment-color:${getColor(item.color)}" aria-hidden="true"><i></i><b></b></div>`;
}
function save() { localStorage.setItem(closetKey, JSON.stringify(closet)); }
function updateClosetMode(filter) {
  const scene = document.getElementById('closetScene');
  scene.classList.toggle('watch-drawer', filter === 'Watch');
  scene.classList.toggle('hat-rack', filter === 'Hat');
}
function renderCloset() {
  const shown = activeFilter === 'All' ? closet : closet.filter(i => i.type === activeFilter);
  document.getElementById('itemsGrid').innerHTML = shown.length ? shown.map(item => {
    const index = closet.indexOf(item);
    return `<article class="closet-item" id="closet-item-${index}" data-type="${item.type}"><span class="hanger" aria-hidden="true"></span><button class="remove" aria-label="Remove ${item.name}" data-index="${index}">×</button>${garment(item)}<div class="item-type">${item.type}</div><div class="item-name">${item.name}</div><div class="item-details">${item.color}${item.size ? ' · ' + item.size : ''}</div><button class="pull-item" type="button" aria-expanded="false">Pull out <span aria-hidden="true">↗</span></button></article>`;
  }).join('') : '<p class="empty">Nothing here yet — add a piece to get started.</p>';
  document.getElementById('closetCount').textContent = closet.length;
}
function pick(type) { const choices = closet.filter(item => item.type === type); return choices[Math.floor(Math.random() * choices.length)]; }
function showOutfit() {
  const canWearDress = closet.some(item => item.type === 'Dress');
  const wearsDress = canWearDress && (Math.random() < .45 || !closet.some(item => item.type === 'Top'));
  const pieces = wearsDress ? ['Dress', 'Shoes'] : ['Top', 'Bottom', 'Shoes'];
  if (document.getElementById('accessories').checked) {
    const accessoryTypes = ['Hat', 'Watch', 'Accessory'].filter(type => closet.some(item => item.type === type));
    if (accessoryTypes.length) pieces.push(accessoryTypes[Math.floor(Math.random() * accessoryTypes.length)]);
  }
  const selected = pieces.map(pick).filter(Boolean);
  const display = document.getElementById('outfitDisplay');
  const top = selected.find(item => item.type === 'Top');
  const bottom = selected.find(item => item.type === 'Bottom');
  const dress = selected.find(item => item.type === 'Dress');
  const shoes = selected.find(item => item.type === 'Shoes');
  const outfitBody = dress ? '<div class="fake-dress"></div>' : '<div class="fake-top"><i></i><b></b></div><div class="fake-bottom"></div>';
  const usesDressForm = account?.sex === 'Female' || Boolean(dress);
  const topColor = dress ? getColor(dress.color) : (top ? getColor(top.color) : '#d7b094');
  const bottomColor = dress ? getColor(dress.color) : (bottom ? getColor(bottom.color) : '#53647d');
  const dressFormBody = dress ? '<div class="mannequin-torso"><div class="mannequin-dress"></div></div>' : '<div class="mannequin-torso"><div class="mannequin-top"></div><div class="mannequin-bottom"></div></div>';
  const modelFigure = usesDressForm
    ? `<div class="dress-form${dress ? ' dress-look' : ''}" aria-label="A dress-form mannequin wearing your generated outfit"><div class="mannequin-finial"></div><div class="mannequin-neck"></div>${dressFormBody}<div class="mannequin-pole"></div><div class="mannequin-base"></div></div>`
    : `<div class="fake-person" aria-label="A fictional mannequin wearing your generated outfit"><div class="fake-head"></div><div class="fake-neck"></div>${outfitBody}<div class="fake-shoes"><i></i><b></b></div></div>`;
  const model = `<article class="model-card" style="--top-color:${topColor};--bottom-color:${bottomColor};--dress-color:${dress ? getColor(dress.color) : '#d7b094'};--shoe-color:${shoes ? getColor(shoes.color) : '#eee5d1'}"><span class="model-label">Your OOTD</span>${modelFigure}<span class="model-caption">${usesDressForm ? 'Styled on your dress form' : 'Your fictional style model'}</span></article>`;
  display.innerHTML = selected.length ? model + selected.map(item => `<article class="outfit-piece"><div><div class="piece-icon" aria-hidden="true">${garment(item)}</div><div class="piece-type">${item.type}</div></div><div><div class="piece-name">${item.name}</div><div class="piece-meta">${item.color}${item.size ? ' · ' + item.size : ''}</div><button class="find-item" type="button" data-index="${closet.indexOf(item)}">Find in closet <span aria-hidden="true">↓</span></button></div></article>`).join('') : '<p>Add a few closet pieces first, then we can style you.</p>';
  const occasion = document.getElementById('occasion').value.toLowerCase();
  document.getElementById('resultSummary').textContent = `A ${document.getElementById('vibe').value.toLowerCase()} look for ${occasion}.`;
  document.getElementById('result').classList.remove('hidden');
  document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'center' });
}
document.querySelectorAll('.pill').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.pill').forEach(b => b.classList.remove('selected')); button.classList.add('selected'); document.getElementById('occasion').value = button.dataset.occasion; }));
document.getElementById('outfitForm').addEventListener('submit', event => { event.preventDefault(); showOutfit(); });
document.getElementById('reroll').addEventListener('click', showOutfit);
document.getElementById('outfitDisplay').addEventListener('click', event => {
  const button = event.target.closest('.find-item');
  if (!button) return;
  activeFilter = 'All';
  document.querySelectorAll('.filter').forEach(filter => filter.classList.toggle('active', filter.dataset.filter === 'All'));
  updateClosetMode('All');
  renderCloset();
  const item = document.getElementById(`closet-item-${button.dataset.index}`);
  if (!item) return;
  item.scrollIntoView({ behavior: 'smooth', block: 'center' });
  item.classList.add('located');
  window.setTimeout(() => item.classList.remove('located'), 1800);
});
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
document.getElementById('itemsGrid').addEventListener('click', event => {
  const removeButton = event.target.closest('.remove');
  if (removeButton) {
    closet.splice(Number(removeButton.dataset.index), 1);
    save();
    renderCloset();
    return;
  }
  const card = event.target.closest('.closet-item');
  if (!card) return;
  const pullButton = card.querySelector('.pull-item');
  const pulled = card.classList.toggle('pulled');
  pullButton.setAttribute('aria-expanded', String(pulled));
  pullButton.innerHTML = pulled ? 'Put back <span aria-hidden="true">↙</span>' : 'Pull out <span aria-hidden="true">↗</span>';
});
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => { activeFilter = button.dataset.filter; document.querySelectorAll('.filter').forEach(b => b.classList.toggle('active', b === button)); updateClosetMode(activeFilter); renderCloset(); }));
document.getElementById('accountName').textContent = account ? `${account.name}'s closet` : 'My closet';
document.getElementById('logoutButton').textContent = account ? account.name.slice(0, 2).toUpperCase() : 'ME';
document.getElementById('logoutButton').addEventListener('click', () => { localStorage.removeItem('ootd-current-user'); window.location.href = 'login.html'; });
renderCloset();
