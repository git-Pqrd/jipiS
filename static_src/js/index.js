

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
LooperGal(btnGal, gal, 'showing')

const slidermodebtn = document.getElementsByClassName('slidermodebtn')
const modeCom = document.getElementsByClassName('modeCom')
console.log(modeCom.length);
const sliderMoving = document.getElementsByClassName('slider-moving');
const sliderWidth = modeCom.length*100+'%'
console.log(sliderWidth);
sliderMoving[0].style.width = sliderWidth

function LooperCont(item, toMove, classToToggle) {
  let ratio = (100/(toMove.length)) ;

  let previousX = 99
  // item.map(addEventListener('click' ,function(){console.log(hello);} )
  for (i = 0; i < item.length; i++) {
    item[i].addEventListener('click', function(e) {
      // toMove[this.dataset.num].classList.remove(classToToggle);
      let x = parseInt(e.target.dataset.num) ;
      console.log(ratio);
      if (previousX != x) {
        previousX = x
        Object.keys(document.getElementsByClassName(toMove)).map(function(i){
          document.getElementsByClassName(toMove)[i].classList.remove(classToToggle);
        });
        // .classList.remove(classToToggle);
        toMove[this.dataset.num].classList.add(classToToggle);
        toMove[0].parentNode.style.transform = 'translateX(-' + x * ratio + '%)';
      }

    })
  }

}
LooperCont(slidermodebtn, modeCom, 'showing')
