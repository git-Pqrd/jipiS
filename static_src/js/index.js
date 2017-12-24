

const btnGal = document.getElementsByClassName('btn');
const gal = document.getElementsByClassName('gal');

function LooperGal(item, toMove, classToToggle) {
  for (i = 0; i < item.length; i++) {
    item[i].addEventListener('click', function(e) {
      toMove[this.dataset.num].classList.toggle(classToToggle);
      console.log(toMove[this.dataset.num]);
      let galToMove  = ('gal' + (parseInt(this.dataset.num) + 1))
      console.log(galToMove);
      var myLazyLoad = new LazyLoad({
        container: document.getElementById(galToMove)
      });
    })
  }

}
LooperGal(btnGal, gal, 'showing');
const slidermodebtn = document.getElementsByClassName('slidermodebtn')
const modeCom = document.getElementsByClassName('modeCom');
const sliderMoving = document.getElementsByClassName('slider-moving');
const sliderWidth = modeCom.length*100+'%'
sliderMoving[0].style.width = sliderWidth;
var x = 0;
var myElement = document.getElementById('full-slider');

function LooperCont(item, toMove, classToToggle ,direction) {
  Object.keys(document.getElementsByClassName(toMove)).map(function(i){
    document.getElementsByClassName(toMove)[i].classList.remove(classToToggle);
  });
  let ratio = (100/(toMove.length)) ;
  if (direction == 'right' && x+1 < toMove.length ) {
    x +=1;
  } else if ( direction == 'left' && x != 0) {
    x -= 1;
  } else {
    console.log('nothing happen');
  }
  // toMove[this.dataset.num]


  toMove[0].parentNode.style.transform = 'translateX(-' + (x) * ratio + '%)';

  Object.keys(document.getElementsByClassName(toMove)).map(function(i){
    document.getElementsByClassName(toMove)[i].classList.add(classToToggle);
  });

}





// create a simple instance
// by default, it only adds horizontal recognizers
var mc = new Hammer(myElement);

// listen to events...
mc.on("swiperight", function(ev) {
  LooperCont(slidermodebtn, modeCom, 'showing' , 'left');
  console.log(ev.target);
});
mc.on("swipeleft", function(ev) {
  LooperCont(slidermodebtn, modeCom, 'showing' , 'right');
  console.log(ev.target);
});
