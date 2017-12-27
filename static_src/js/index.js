const cardEvent = document.getElementsByClassName('card-event');
const sliderMoving = document.getElementsByClassName('sliderMoving');
const sliderWidth = cardEvent.length * 100 + '%';
// to have the width correctly even if a lot of cards
sliderMoving[0].style.width = sliderWidth;

var x = 0;
var myElement = document.getElementById('full-slider');

function LooperCont(toMove, classToToggle, direction) {
  Object.keys(document.getElementsByClassName(toMove)).map(function(i) {
    document.getElementsByClassName(toMove)[i].classList.remove(classToToggle);
  });
  let ratio = (100 / (toMove.length));
  if (direction == 'right' && x + 1 < toMove.length) {
    x += 1;
  } else if (direction == 'left' && x != 0) {
    x -= 1;
  }

  // setting the still of the moving slide to have it going left
  toMove[0].parentNode.style.setProperty("-webkit-transform", 'translateX(-' + (
  x) * ratio + '%)');
  toMove[0].parentNode.style.setProperty("-moz-transform", 'translateX(-' + (
  x) * ratio + '%)');
  toMove[0].parentNode.style.setProperty("transform", 'translateX(-' + (
  x) * ratio + '%)');

  // need to add still but when i will have time
  Object.keys(document.getElementsByClassName(toMove)).map(function(i) {
    document.getElementsByClassName(toMove)[i].classList.add(classToToggle);
  });

}

// create a simple instance
// by default, it only adds horizontal recognizers
var mc = new Hammer(sliderMoving[0]);
// listen to events...
mc.on("swiperight", function(ev) {
  LooperCont(cardEvent, 'showing', 'left');
});
mc.on("swipeleft", function(ev) {
  LooperCont(cardEvent, 'showing', 'right');
});

//masonry grid layout

// external js: masonry.pkgd.js, imagesloaded.pkgd.js

// init Masonry
var grid = document.querySelector('.grid');

var msnry = new Masonry(grid, {
  itemSelector: '.grid-item',
  columnWidth: '.grid-sizer',
  percentPosition: true
});

imagesLoaded(grid).on('progress', function() {
  // layout Masonry after each image loads
  msnry.layout();
});

// definie les btn a tester
// set up all my vars and const
const btnUn = document.getElementById('btnUn');
const btnDeux = document.getElementById('btnDeux');
const btnTroi = document.getElementById('btnTroi');
const btnQuat = document.getElementById('btnQuat');
var cats = [];

// ajoute et ou supprime des categorie
function filterCat(cat) {
  if (cats.includes(cat)) {
    cats.splice(cats.indexOf(cat));

  } else {
    cats.push(cat)
  }
  return cats;
}
// add event listener
btnUn.addEventListener('click', filterImage);
btnDeux.addEventListener('click', filterImage);
btnTroi.addEventListener('click', filterImage);
btnQuat.addEventListener('click', filterImage);

function filterImage(e) {
  let cat = e.target.dataset.cat;
  let toChange = document.getElementsByClassName(cat);
  Array.prototype.forEach.call(document.getElementsByClassName(cat), function(el) {
    console.log(el);
    el.classList.toggle('test');
    msnry.layout();


  })

}
