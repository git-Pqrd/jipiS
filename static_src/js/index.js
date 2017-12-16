

const btnGal = document.getElementsByClassName('btn');
const gal = document.getElementsByClassName('gal');


function LooperGal(item, toMove, classToToggle) {
  for (i = 0; i < item.length; i++) {
    item[i].addEventListener('click', function(e) {
      toMove[this.dataset.num].classList.toggle(classToToggle);
      let galToMove  = ('gal' + (parseInt(this.dataset.num) + 1))
      
      var myLazyLoad = new LazyLoad({
        container: document.getElementById(galToMove)
      });
    })
  }

}
LooperGal(btnGal, gal, 'showing')

const contactmodebtn = document.getElementsByClassName('contactmodebtn')
const modeCom = document.getElementsByClassName('modeCom')

function LooperCont(item, toMove, classToToggle) {

  let previousX = 99
  // item.map(addEventListener('click' ,function(){console.log(hello);} )
  for (i = 0; i < item.length; i++) {
    item[i].addEventListener('click', function(e) {
      // toMove[this.dataset.num].classList.remove(classToToggle);
      let x = parseInt(e.target.dataset.num) + 1;

      if (previousX != x) {
        previousX = x
        Object.keys(document.getElementsByClassName('modeCom')).map(function(i){
          document.getElementsByClassName('modeCom')[i].classList.remove(classToToggle);
        });
        // .classList.remove(classToToggle);
        toMove[this.dataset.num].classList.add(classToToggle);
        toMove[0].parentNode.style.transform = 'translateX(-' + x * 25 + '%)';
      }

    })
  }

}
LooperCont(contactmodebtn, modeCom, 'showing')
